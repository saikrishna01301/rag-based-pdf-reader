from fastapi import FastAPI, UploadFile, File, HTTPException

app = FastAPI(title="PDF QA Backend", version="1.0.0")


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400, detail="Invalid file, only PDF file is supported!"
        )
    
    # Read file bytes
    pdf_bytes = await file.read()

@app.post("/ask")
def ask_question(question: str):
    pass


@app.get("/health")
def health():
    return {"status": "healthy"}
