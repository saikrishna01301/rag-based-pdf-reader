# ☁️ GCP + Vercel Deployment Guide

Complete guide to deploy your PDF Q&A Application to Google Cloud Platform and Vercel.

## 📋 Overview

- **Frontend**: Vercel (FREE, global CDN)
- **Backend Services**: Google Cloud Run (Serverless containers)
- **Cost**: $0-5/month (FREE for 90 days with $300 credit)

---

## 🎯 Deployment Architecture

```
┌─────────────────┐
│  Vercel (FREE)  │ ← Frontend (Next.js)
└────────┬────────┘
         │
         ↓
┌─────────────────────────────────────────┐
│      Google Cloud Run (Serverless)      │
├─────────────────────────────────────────┤
│  • PDF QA Service                       │
│  • Embeddings Service                   │
│  • Qdrant (Vector DB)                   │
│  • LocalAI (LLM - Optional)             │
└─────────────────────────────────────────┘
```

---

## 📦 Part 1: Setup Google Cloud Platform

### Step 1: Create GCP Account

1. Go to [cloud.google.com](https://cloud.google.com)
2. Click "Get started for free"
3. Sign in with your Google account
4. **Enter credit card** (required for verification)
   - Won't be charged
   - Get $300 free credit (90 days)
5. Complete signup

### Step 2: Create a New Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click project dropdown (top left)
3. Click "New Project"
4. Project name: `pdf-qa-app`
5. Click "Create"
6. **Wait 30 seconds** for project creation
7. Select the new project from dropdown

### Step 3: Enable Required APIs

Run these commands in **Google Cloud Shell** (click terminal icon in top right):

```bash
# Enable Cloud Run API
gcloud services enable run.googleapis.com

# Enable Container Registry
gcloud services enable containerregistry.googleapis.com

# Enable Cloud Build
gcloud services enable cloudbuild.googleapis.com

# Enable Artifact Registry
gcloud services enable artifactregistry.googleapis.com
```

### Step 4: Install Google Cloud CLI (on your local machine)

**Mac/Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

**Windows:**
Download from: https://cloud.google.com/sdk/docs/install

**After installation:**
```bash
# Login to your account
gcloud auth login

# Set your project
gcloud config set project pdf-qa-app

# Configure Docker
gcloud auth configure-docker
```

---

## 🐳 Part 2: Deploy Backend Services to Cloud Run

### Option A: Deploy Each Service Individually (Recommended)

We'll deploy 4 services separately. **Note:** LocalAI might be too resource-heavy for Cloud Run's free tier.

#### Service 1: Qdrant (Vector Database)

```bash
# Navigate to your project
cd /Users/saikrishna/Desktop/skool/ai\ engineer/practice/mypdf-reader/pdf-reader

# Deploy Qdrant from Docker Hub
gcloud run deploy qdrant \
  --image qdrant/qdrant:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 6333 \
  --memory 1Gi \
  --cpu 1
```

**Save the URL:** `https://qdrant-xxxxx.run.app`

#### Service 2: Embeddings Service

```bash
# Build and deploy
gcloud run deploy embeddings \
  --source backend/embeddings \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 2Gi \
  --cpu 1 \
  --timeout 300
```

**Save the URL:** `https://embeddings-xxxxx.run.app`

#### Service 3: PDF QA Service

```bash
# Deploy with environment variables
gcloud run deploy pdfqa \
  --source backend/pdfqa \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 9000 \
  --memory 2Gi \
  --cpu 1 \
  --timeout 300 \
  --set-env-vars EMBEDDINGS_SERVICE_URL=https://embeddings-xxxxx.run.app \
  --set-env-vars QDRANT_HOST=qdrant-xxxxx.run.app \
  --set-env-vars QDRANT_PORT=443 \
  --set-env-vars LOCALAI_URL=https://api.openai.com/v1
```

**Replace URLs** with your actual Cloud Run URLs from previous steps.

**Save the URL:** `https://pdfqa-xxxxx.run.app`

---

### Option B: Skip LocalAI (Use OpenAI API Instead)

LocalAI is too resource-intensive for Cloud Run. Instead:

1. **Get OpenAI API Key**:
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create account
   - Get API key
   - Add $5 credit

2. **Update PDF QA deployment**:
```bash
gcloud run deploy pdfqa \
  --source backend/pdfqa \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 9000 \
  --memory 2Gi \
  --cpu 1 \
  --timeout 300 \
  --set-env-vars EMBEDDINGS_SERVICE_URL=https://embeddings-xxxxx.run.app \
  --set-env-vars QDRANT_HOST=qdrant-xxxxx.run.app \
  --set-env-vars QDRANT_PORT=443 \
  --set-env-vars OPENAI_API_KEY=sk-your-key-here
```

**Note:** This requires code changes to use OpenAI instead of LocalAI. I can help with this if needed.

---

### Verify Deployments

```bash
# List all Cloud Run services
gcloud run services list

# Test each service
curl https://pdfqa-xxxxx.run.app/health
curl https://embeddings-xxxxx.run.app/health
```

---

## 🎨 Part 3: Deploy Frontend to Vercel

### Step 1: Prepare Frontend

Your frontend is already configured with `NEXT_PUBLIC_API_URL` environment variable.

### Step 2: Deploy to Vercel

**Option A: Using Vercel Dashboard (Easiest)**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New Project"
4. Import `saikrishna01301/rag-based-pdf-reader`
5. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://pdfqa-xxxxx.run.app
   ```
   (Use your actual Cloud Run URL)

7. Click "Deploy"
8. Wait 2-3 minutes
9. Get your URL: `https://pdf-qa-saikrishna.vercel.app`

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: pdf-qa-app
# - Directory: ./
# - Override settings? No

# Add environment variable
vercel env add NEXT_PUBLIC_API_URL

# Paste your Cloud Run URL when prompted
# Select: Production, Preview, Development

# Redeploy
vercel --prod
```

---

## ✅ Verify Full Deployment

1. Open your Vercel URL: `https://pdf-qa-xxxxx.vercel.app`
2. Upload a PDF
3. Ask a question
4. Check response

---

## 💰 Cost Breakdown

| Service | Free Tier | After Free Credit | Monthly Cost |
|---------|-----------|-------------------|--------------|
| **Vercel** | Unlimited | Unlimited | **$0** |
| **Cloud Run (4 services)** | 2M requests/mo | 180K vCPU-sec/mo | **$0-5** |
| **Container Registry** | 1GB storage | Per GB | **$0.10** |
| **Network Egress** | 1GB/month | Per GB | **$1-3** |
| **Total** | **FREE (90 days)** | After credits | **$1-8/month** |

**With OpenAI API:**
- Add $2-10/month depending on usage
- Still cheaper than running LocalAI

---

## 🐛 Troubleshooting

### Cloud Run Service Won't Start

**Problem:** Container fails to build
**Solution:**
```bash
# Check logs
gcloud run services logs pdfqa --region us-central1

# Common issues:
# - Missing Dockerfile: Ensure Dockerfile exists in service directory
# - Port mismatch: Cloud Run uses PORT env var
# - Memory limit: Increase with --memory 4Gi
```

### CORS Errors from Frontend

**Problem:** Frontend can't reach backend
**Solution:** Update CORS in backend:

```python
# backend/pdfqa/app/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://pdf-qa-xxxxx.vercel.app"],  # Your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Redeploy:
```bash
gcloud run deploy pdfqa --source backend/pdfqa
```

### Service Timeout

**Problem:** Requests timeout after 60s
**Solution:**
```bash
# Increase timeout to 5 minutes
gcloud run services update pdfqa --timeout 300
```

### Cold Start Delays

**Problem:** First request takes 30-60s
**Solution:**
```bash
# Keep 1 instance always warm (costs more)
gcloud run services update pdfqa --min-instances 1
```

---

## 🚀 Post-Deployment

### Update README

Add your live demo links:

```markdown
[🚀 Live Demo](https://pdf-qa-saikrishna.vercel.app) |
[📖 API Docs](https://pdfqa-xxxxx.run.app/docs)
```

### Monitor Usage

```bash
# View Cloud Run metrics
gcloud run services describe pdfqa --region us-central1

# Check billing
# Go to: console.cloud.google.com/billing
```

### CI/CD (Optional)

Set up auto-deploy on git push:

**For Cloud Run:**
1. Go to Cloud Run service
2. Click "Set up continuous deployment"
3. Connect GitHub repo
4. Choose branch: `master`
5. Cloud Build will auto-deploy on push

**For Vercel:**
- Already auto-deploys on git push!

---

## 📊 Expected Timeline

- **GCP Setup**: 15 minutes
- **Backend Deploy**: 20-30 minutes (first time)
- **Frontend Deploy**: 5 minutes
- **Testing & Troubleshooting**: 15-30 minutes
- **Total**: 60-90 minutes

---

## 🎯 Success Checklist

- [ ] GCP account created with $300 credit
- [ ] Project created and APIs enabled
- [ ] Qdrant deployed to Cloud Run
- [ ] Embeddings service deployed
- [ ] PDF QA service deployed
- [ ] All services returning 200 on /health endpoint
- [ ] Frontend deployed to Vercel
- [ ] Can upload PDF via live URL
- [ ] Can ask questions and get responses
- [ ] Updated README with live demo links

---

## 🔗 Useful Links

- **GCP Console**: https://console.cloud.google.com
- **Cloud Run Dashboard**: https://console.cloud.google.com/run
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Billing**: https://console.cloud.google.com/billing

---

## 💡 Pro Tips

1. **Use Cloud Run for all services** - It's cheaper than VMs
2. **Set budget alerts** - Avoid surprise bills
3. **Monitor logs** - Use Cloud Logging for debugging
4. **Scale to zero** - Cloud Run auto-scales to 0 when not used (saves $$)
5. **Use OpenAI API** - Cheaper than running LocalAI on Cloud Run

---

Good luck with your deployment! 🚀
