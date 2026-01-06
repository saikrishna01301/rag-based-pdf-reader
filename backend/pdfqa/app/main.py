from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
import pdfplumber
import io
from langchain_text_splitters import TokenTextSplitter
import aiohttp
import uuid
import time
import json
from typing import List, Dict, Optional
from fastapi.middleware.cors import CORSMiddleware
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, PointStruct
import os
from pydantic import BaseModel

app = FastAPI(title="PDF QA Backend", version="1.0.0")


# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # In a production setting, this should be mapped to only the production host
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# no .env file so using default values
qdrant_client = QdrantClient(
    host=os.getenv("QDRANT_HOST", "localhost"),
    port=int(os.getenv("QDRANT_PORT", "6333")),
)
EMBEDDINGS_SERVICE_URL = os.getenv("EMBEDDINGS_SERVICE_URL", "http://localhost:8080")
LOCALAI_URL = os.getenv("LOCALAI_URL", "http://localhost:8080/v1")


# extract text page by page list[str]
def extract_text_from_pdf(pdf_bytes):
    pages = []
    # io.BytesIO treats raw bytes as a file-like object.. creates in-memory object around it
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            pages.append(page.extract_text() or "")
    return pages


async def get_embedding(text: str) -> List[float]:
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{EMBEDDINGS_SERVICE_URL}/embed", json={"text": text}
        ) as response:
            if response.status != 200:
                raise HTTPException(status_code=500, detail="Embedding service error")
            result = await response.json()
            return result


async def get_embedding_batch(texts: List[str]) -> List[List[float]]:
    async with aiohttp.ClientSession() as session:
        async with session.post(
            f"{EMBEDDINGS_SERVICE_URL}/embed_batch", json={"texts": texts}
        ) as response:
            if response.status != 200:
                raise HTTPException(status_code=500, detail="Embedding service error")
            result = await response.json()
            return result


def format_phi_prompt(system_content: str, user_content: str) -> str:
    """Format prompt for Phi model with proper tokens"""
    return (
        f"<|system|>{system_content}<|end|><|user|>{user_content}<|end|><|assistant|>"
    )


async def query_llm(prompt: str, context: str):
    system_content = "You are a helpful assistant that answers questions based on the provided context. Do not provide anything other than the answer to the user's question. Answer based on the context."
    if context:
        system_content += f" Context: {context}"

    formatted_prompt = format_phi_prompt(system_content, prompt)

    data = {
        "model": "phi-3.5-mini-instruct",
        "prompt": formatted_prompt,
        "temperature": 0.3,
        "stop": ["<|endoftext|>", "<|end|>"],
        "stream": True,
        "max_tokens": 1024,
    }

    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(
                f"{LOCALAI_URL}/completions", json=data
            ) as response:
                if response.status != 200:
                    raise HTTPException(status_code=500, detail="LLM service error")

                # Process the streaming response
                async for line in response.content:
                    line = line.decode("utf-8").strip()

                    # Skip empty lines
                    if not line:
                        continue

                    # Handle SSE format
                    if line.startswith("data: "):
                        line = line[6:]

                    # Skip end marker
                    if line == "[DONE]":
                        continue

                    try:
                        chunk = json.loads(line)
                        if chunk.get("choices") and chunk["choices"][0].get("text"):
                            content = chunk["choices"][0]["text"]
                            yield content

                    except json.JSONDecodeError:
                        continue

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Streaming error: {str(e)}")


def setup_collection(collection_name: str, vector_size: int):
    try:
        qdrant_client.get_collection(collection_name)
    except:
        qdrant_client.create_collection(
            collection_name=collection_name,
            vectors_config=VectorParams(size=vector_size, distance=Distance.COSINE),
        )


# Split text into chunks with overlap
# def split_text(text: str, chunk_size: int = 600, overlap: int = 100):
#     words = text.split()
#     chunks = []
#     start = 0

#     while start < len(words):
#         end = start + chunk_size
#         chunk = " ".join(words[start:end])
#         chunks.append(chunk)
#         start += chunk_size - overlap
#     return chunks


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400, detail="Invalid file, only PDF file is supported!"
        )

    # Read file bytes
    # Read file bytes
    pdf_bytes = await file.read()
    pages = extract_text_from_pdf(pdf_bytes)
    text = "\n".join(pages)

    # chunks = split_text(text). split_text is not used currently
    # spliting using langchain as token splitter
    # creating object instance for TokenTextSplitter
    text_splitter = TokenTextSplitter(chunk_size=600, chunk_overlap=100)
    chunks = text_splitter.split_text(text)

    # getting sample embedding for vector size
    sample_embedding = await get_embedding(chunks[0])
    vector_size = len(sample_embedding)
    collection_name = f"pdf_{uuid.uuid4()}"
    setup_collection(collection_name, vector_size)
    batch_size = 100

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        embeddings = await get_embedding_batch(batch)
        points = [
            PointStruct(
                id=i + j,
                vector=embedding,
                payload={
                    "text": text,
                    "metadata": {
                        "pdf_id": collection_name,
                        "chunk_id": i + j,
                    },
                },
            )
            for j, (text, embedding) in enumerate(zip(batch, embeddings))
        ]

        qdrant_client.upsert(collection_name=collection_name, points=points)
    return {
        "pdf_id": collection_name,
        "message": "PDF processed successfully",
        "stats": {
            "chunks": len(chunks),
        },
    }


class QuestionRequest(BaseModel):
    question: str
    pdf_id: Optional[str] = None
    chat_history: Optional[List[Dict[str, str]]] = []


class ChunkResponse(BaseModel):
    """Response model for chunk retrieval"""

    chunk_id: int
    text: str
    metadata: dict


@app.post("/ask")
async def ask_question(request: QuestionRequest):
    if not request.pdf_id:

        async def generate_stream():
            try:
                # Send metadata without PDF (no PDF selected)
                yield json.dumps(
                    {"type": "metadata", "pdf_id": None, "sources": []}
                ) + "\n"

                # Stream the answer chunks
                async for chunk in query_llm(request.question, ""):
                    yield json.dumps({"type": "chunk", "content": chunk}) + "\n"

            except Exception as e:
                yield json.dumps({"type": "error", "content": str(e)}) + "\n"

        return StreamingResponse(generate_stream(), media_type="application/x-ndjson")

    # If PDF is selected, proceed with embedding search and context

    question_embedding = await get_embedding(request.question)

    results = qdrant_client.query_points(
        collection_name=request.pdf_id,
        query=question_embedding,
        limit=2
    ).points

    # Extract context for LLM (internal use only, NOT sent to frontend)
    context = "\n\n".join([result.payload["text"] for result in results])

    # Extract only chunk IDs for citation (sent to frontend)
    sources = [
        {"chunk_id": result.payload["metadata"]["chunk_id"]} for result in results
    ]

    async def generate_stream():
        try:
            # Send metadata: PDF ID and chunk IDs only (no raw context)
            yield json.dumps(
                {"type": "metadata", "pdf_id": request.pdf_id, "sources": sources}
            ) + "\n"

            # Stream AI model's response (context is used internally by LLM)
            async for chunk in query_llm(request.question, context):
                yield json.dumps({"type": "chunk", "content": chunk}) + "\n"

        except Exception as e:
            yield json.dumps({"type": "error", "content": str(e)}) + "\n"

    return StreamingResponse(generate_stream(), media_type="application/x-ndjson")


@app.get("/pdfs")
async def list_pdfs():
    """List all available PDF collections"""
    try:
        collections = qdrant_client.get_collections()
        pdf_collections = [
            {"id": collection.name, "name": collection.name}
            for collection in collections.collections
        ]
        return {"pdfs": pdf_collections}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing PDFs: {str(e)}")


@app.get("/pdfs/{pdf_id}/chunks/{chunk_id}", response_model=ChunkResponse)
async def get_chunk(pdf_id: str, chunk_id: int):
    """
    Retrieve a specific chunk from a PDF collection by its ID.

    Args:
        pdf_id (str): The ID of the PDF collection (e.g., 'pdf_example_uuid.pdf')
        chunk_id (int): The ID of the specific chunk to retrieve

    Returns:
        ChunkResponse: Contains the chunk text and metadata

    Raises:
        HTTPException: If the PDF collection or chunk is not found
    """
    try:
        try:
            qdrant_client.get_collection(pdf_id)
        except Exception as e:
            raise HTTPException(
                status_code=404, detail=f"PDF collection {pdf_id} not found"
            )

        results = qdrant_client.retrieve(
            collection_name=pdf_id,
            ids=[chunk_id],
        )
        if not results:
            raise HTTPException(status_code=404, detail=f"Chunk {chunk_id} not found")
        chunk = results[0]
        return ChunkResponse(
            chunk_id=chunk_id,
            text=chunk.payload["text"],
            metadata=chunk.payload["metadata"],
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail=f"Error retrieving chunk: {str(e)}")


@app.get("/health")
def health():
    return {"status": "healthy"}
