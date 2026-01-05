from fastapi import FastAPI, UploadFile, File, HTTPException
import pdfplumber
import io
from langchain_text_splitters import TokenTextSplitter

app = FastAPI(title="PDF QA Backend", version="1.0.0")


# extract text page by page list[str]
def extract_text_from_pdf(pdf_bytes):
    pages = []
    # io.BytesIO treats raw bytes as a file-like object.. creates in-memory object around it
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        for page in pdf.pages:
            pages.append(page.extract_text() or "")
    return pages


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

    


@app.post("/ask")
def ask_question(question: str):
    pass


@app.get("/health")
def health():
    return {"status": "healthy"}
