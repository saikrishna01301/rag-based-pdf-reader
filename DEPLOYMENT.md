# 🚀 Deployment Guide - Frontend Only (Vercel)

This project showcases a **privacy-first AI architecture** with LocalAI running locally. The frontend is deployed to Vercel to demonstrate the UI/UX, while the full functionality is shown via video demo.

---

## 📋 Deployment Strategy

**Frontend (UI):** Vercel - Live demo of interface
**Backend (AI):** Local only - Shown in video demo
**Why:** LocalAI requires significant resources (4-8GB RAM, GPU acceleration) which are cost-prohibitive for cloud hosting. This approach demonstrates:
- Production-ready frontend deployment
- Cost-effective architecture decisions
- Privacy-first design (data stays local)

---

## 🎨 Deploy Frontend to Vercel

### Quick Deploy (5 minutes)

1. **Go to Vercel**
   - Visit: [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub

2. **Import Repository**
   - Click "Add New Project"
   - Select: `saikrishna01301/rag-based-pdf-reader`
   - Click "Import"

3. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Environment Variables** (Optional)
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `http://localhost:9000`
   - Note: This won't work in production, but shows the UI

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your URL: `https://rag-based-pdf-reader.vercel.app`

---

## 🎥 Create Video Demo

See [VIDEO_DEMO_GUIDE.md](VIDEO_DEMO_GUIDE.md) for detailed instructions.

### Quick Steps:

1. **Prepare Local Environment**
   ```bash
   docker-compose up
   # Wait for all services to start (~10-30 min first time)
   ```

2. **Record Demo (2-3 minutes)**
   - Open http://localhost:3000
   - Upload a PDF
   - Ask 2-3 questions
   - Show AI responses with citations

3. **Upload to YouTube**
   - Upload as "Unlisted"
   - Add to README

---

## ✅ What Gets Deployed

### Vercel (Live):
- ✅ Next.js frontend UI
- ✅ Responsive design
- ✅ Upload interface
- ✅ Chat interface
- ❌ Backend API (not connected)

### Video Demo Shows:
- ✅ Full working application
- ✅ PDF upload and processing
- ✅ AI-powered Q&A
- ✅ Vector search with citations
- ✅ Real-time streaming responses

---

## 📝 Update README After Deployment

Add your links:

```markdown
[🚀 Live Demo](https://your-app.vercel.app) - UI/UX Preview
[📹 Video Demo](https://youtube.com/watch?v=xxx) - Full Functionality
```

Add a note:
```markdown
> **Note:** Frontend deployed to Vercel shows the UI. Full AI functionality
> (LocalAI with Phi-3.5) runs locally for privacy and cost efficiency.
> See video demo for complete walkthrough.
```

---

## 🎯 Why This Approach?

**Professional Reasons:**
1. **Cost-Effective** - No monthly cloud costs
2. **Shows Decision-Making** - Understanding production tradeoffs
3. **Privacy-First** - Demonstrates security awareness
4. **Full-Stack Skills** - Frontend deployment + backend architecture

**What Recruiters See:**
- Live deployed frontend (production skills)
- Well-documented architecture (technical writing)
- Video demo (presentation skills)
- Smart cost decisions (business awareness)

---

## 💰 Total Cost

- **Vercel:** $0 (FREE forever)
- **YouTube:** $0 (FREE)
- **Total:** **$0/month**

---

## 🔗 Quick Links

- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Video Recording Guide:** [VIDEO_DEMO_GUIDE.md](VIDEO_DEMO_GUIDE.md)

---

That's it! Simple, professional, and completely FREE. 🚀
