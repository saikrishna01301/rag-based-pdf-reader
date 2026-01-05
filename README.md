# PDF Q&A Application

AI-powered PDF question answering system built with Next.js, FastAPI, and LocalAI.

## 🚀 Features

- Upload PDF documents
- Ask questions about PDF content
- AI-powered answers using LocalAI
- Vector search with Qdrant
- Modern UI with Next.js & Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS

### Backend
- FastAPI (Python)
- Qdrant (Vector Database)
- LocalAI (AI Model Inference)
- pdfplumber (PDF Processing)

## 📦 Local Setup

### Prerequisites
- Docker & Docker Compose
- 8GB RAM minimum

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR-USERNAME/pdf-reader.git
cd pdf-reader
```

2. Set up AI models directory
```bash
mkdir -p models
```

> **Note:** Models are large files (not included in repo). They will be auto-downloaded on first run, or you can manually download from:
> - Embedding models: Auto-downloaded via langchain-huggingface
> - LocalAI models: Place your model files in `models/` folder

3. Start services
```bash
docker-compose up --build
```

3. Access the application
- Frontend: http://localhost:3000
- Embeddings API: http://localhost:8080/docs
- PDF QA API: http://localhost:9000/docs

## 🏗️ Architecture

```
Frontend (Next.js) → PDF QA Service → Embeddings Service
                                    → LocalAI
                                    → Qdrant
```

## 📁 Project Structure

```
pdf-reader/
├── frontend/           # Next.js frontend
├── backend/
│   ├── embeddings/    # Embeddings service
│   └── pdfqa/         # PDF processing service
└── docker-compose.yml
```

## 🚀 Deployment

See deployment guides for:
- Vercel (Frontend)
- Render (Backend)

## 📄 License

MIT
