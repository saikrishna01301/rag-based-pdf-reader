# 🚂 Railway Deployment Guide

## 📋 Prerequisites

- GitHub account with your code pushed
- Railway account (sign up at [railway.app](https://railway.app))
- $5 free trial credit (no credit card required for trial)

## 🚀 Deployment Steps

### Step 1: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign in with your GitHub account
4. Authorize Railway to access your repositories

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `saikrishna01301/rag-based-pdf-reader`
4. Railway will automatically detect your `docker-compose.yml`

### Step 3: Configure Services

Railway will create **4 separate services** from your docker-compose.yml:
- `frontend` (Next.js)
- `pdfqa` (FastAPI)
- `embeddings` (FastAPI)
- `qdrant` (Vector DB)
- `localai` (LLM inference)

### Step 4: Set Environment Variables

For the **frontend** service:
```
NEXT_PUBLIC_API_URL=https://pdfqa-production.up.railway.app
```
(Replace with your actual pdfqa service URL after deployment)

For the **pdfqa** service:
```
EMBEDDINGS_SERVICE_URL=http://embeddings.railway.internal:8080
QDRANT_HOST=qdrant.railway.internal
QDRANT_PORT=6333
LOCALAI_URL=http://localai.railway.internal:8080/v1
```

For the **localai** service:
```
MODELS_PATH=/models
LOG_LEVEL=INFO
```

### Step 5: Add Volumes (Important!)

For persistent model storage:

1. Go to **localai** service
2. Click "Variables" → "Volumes"
3. Add volume: `/models` → This will persist your AI models

For Qdrant data:

1. Go to **qdrant** service
2. Add volume: `/qdrant/storage`

### Step 6: Deploy!

1. Railway will automatically start building
2. **First deployment takes 15-30 minutes** (model downloads)
3. Monitor logs: Click each service → "Deployments" → View logs
4. Wait for all services to show "Active"

### Step 7: Get Your URLs

1. Click on **frontend** service
2. Go to "Settings" → "Networking"
3. Click "Generate Domain"
4. Copy your public URL (e.g., `https://yourapp.up.railway.app`)

5. Do the same for **pdfqa** service
6. Update frontend environment variable with pdfqa URL

### Step 8: Update README

Once deployed, update your README.md with:
- Live Demo URL (frontend)
- API Documentation URL (pdfqa/docs)

## ⚠️ Important Notes

### Cost Expectations

- **Free Trial**: $5 credit (lasts ~5-7 days of continuous running)
- **After Trial**: ~$10-15/month
  - Frontend: ~$2-3/month
  - Backend services: ~$3-5/month each
  - LocalAI (most expensive): ~$8-12/month

### Resource Limits

Railway **may struggle** with LocalAI because:
- LocalAI needs significant CPU (2+ cores)
- Model files are large (2-4GB)
- Inference is slow on CPU

### Alternative: Skip LocalAI on Railway

If LocalAI doesn't work or is too expensive:

**Option 1**: Deploy without LocalAI, add note in README
**Option 2**: Use Hugging Face Inference API instead (modify code)
**Option 3**: Use OpenAI API (cheapest cloud option)

## 🐛 Troubleshooting

### Service Won't Start

**Check logs**: Railway dashboard → Service → Deployments → View logs

Common issues:
- Out of memory (increase resources in settings)
- Model download timeout (use volumes for persistence)
- Port conflicts (Railway auto-assigns ports)

### Services Can't Talk to Each Other

Railway services communicate via internal DNS:
- Use `servicename.railway.internal:port`
- Example: `http://qdrant.railway.internal:6333`

### Frontend Can't Reach Backend

- Make sure `NEXT_PUBLIC_API_URL` is set correctly
- Use the **public URL** of pdfqa service (not internal)
- Must start with `https://`

## 🎯 Expected Deployment Time

- **Initial Setup**: 5 minutes
- **Build Time**: 10-15 minutes
- **Model Downloads**: 15-30 minutes
- **Total**: ~30-50 minutes first time

Subsequent deploys are faster (models cached): ~5-10 minutes

## 📊 Success Checklist

- [ ] All 5 services showing "Active" status
- [ ] No error logs in any service
- [ ] Frontend accessible at public URL
- [ ] Can upload a PDF via UI
- [ ] Can ask questions and get responses
- [ ] Sources/citations working

## 🔗 Useful Links

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway (for support)

---

Good luck with your deployment! 🚀
