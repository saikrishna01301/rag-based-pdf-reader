# 🎥 Video Demo Recording Guide

Complete guide to record a professional demo of your PDF Q&A Application.

---

## 🎯 Goal

Create a **2-3 minute video** showing:
- PDF upload
- AI-powered question answering
- Vector search with citations
- Real-time streaming responses

---

## 📋 Pre-Recording Checklist

### 1. Start Your Application

```bash
cd /Users/saikrishna/Desktop/skool/ai\ engineer/practice/mypdf-reader/pdf-reader

# Start all services
docker-compose up

# Wait for all services to be healthy (10-30 minutes first time)
# Watch logs for:
# - "Application startup complete" (FastAPI services)
# - Qdrant ready
# - LocalAI model loaded
```

### 2. Verify Everything Works

Open browser and test:
- Frontend: http://localhost:3000
- PDF QA API: http://localhost:9000/docs
- Embeddings API: http://localhost:8080/docs

Upload a test PDF and ask a question to verify it works.

### 3. Prepare a Good PDF

Choose a PDF that:
- ✅ Is 5-20 pages (not too long)
- ✅ Has clear, interesting content
- ✅ You can ask good questions about
- ✅ Is professional (e.g., research paper, documentation, article)

**Suggested PDFs:**
- Research paper on AI/ML
- Technical documentation
- Company report
- Educational material

### 4. Prepare 3-4 Questions

Write down questions beforehand:
- ✅ One simple question (tests basic functionality)
- ✅ One complex question (shows AI reasoning)
- ✅ One that requires context from multiple sections

**Example Questions:**
```
1. "What is the main topic of this document?"
2. "What are the key findings mentioned in the methodology section?"
3. "How does the author compare X and Y?"
```

---

## 🛠️ Recording Tools

### Option 1: Loom (Easiest - Recommended)

**Pros:** Free, easy, no editing needed, instant sharing
**Steps:**
1. Go to [loom.com](https://loom.com)
2. Sign up (free)
3. Install desktop app or Chrome extension
4. Click "Record" → "Screen + Camera" (or just Screen)
5. Select your browser window
6. Start recording!

### Option 2: OBS Studio (Professional)

**Pros:** Free, professional quality, full control
**Cons:** Requires setup and basic editing

1. Download [OBS Studio](https://obsproject.com)
2. Install and open
3. Add Source → "Display Capture" or "Window Capture"
4. Select your browser
5. Click "Start Recording"
6. Stop when done
7. Video saved to ~/Videos

### Option 3: Mac Built-in (Simple)

**Mac Only:**
1. Press `Cmd + Shift + 5`
2. Select "Record Selected Portion" or "Record Entire Screen"
3. Click "Record"
4. Stop from menu bar when done

### Option 4: Windows Game Bar

**Windows Only:**
1. Press `Win + G`
2. Click record button
3. Stop when done

---

## 🎬 Recording Script (2-3 minutes)

### Introduction (15 seconds)

**Say:**
> "Hi, I'm [Your Name]. This is my PDF Q&A Application - an AI-powered tool that lets you chat with your PDF documents using Retrieval Augmented Generation."

**Show:**
- Frontend homepage
- Briefly mention tech stack on screen

---

### Part 1: Upload PDF (30 seconds)

**Say:**
> "Let me show you how it works. First, I'll upload a PDF document about [topic]."

**Do:**
1. Click upload area or drag-and-drop
2. Select your prepared PDF
3. Show upload progress
4. Point out confirmation message with chunk count

**Say:**
> "The system extracts text, splits it into chunks, generates embeddings, and stores them in a vector database for semantic search."

---

### Part 2: Ask Questions (90 seconds)

**Question 1 - Simple:**

**Say:**
> "Now I can ask questions. Let's start with something simple: [Question 1]"

**Do:**
1. Type question clearly
2. Press enter
3. Show streaming response
4. Point out the answer

**Question 2 - Complex:**

**Say:**
> "Here's a more complex question: [Question 2]"

**Do:**
1. Type question
2. Show response streaming in real-time
3. Point out source citations at bottom

**Question 3 - Multi-context:**

**Say:**
> "And one more: [Question 3]"

**Do:**
1. Ask question
2. Show response
3. Click on source citation to show original text chunk

---

### Part 3: Architecture Highlight (20 seconds)

**Say:**
> "Under the hood, this uses a microservices architecture with:"

**Show** (optional - can show architecture diagram from README):
- Next.js frontend
- FastAPI backend services
- Qdrant vector database
- LocalAI for inference
- Docker orchestration

**Say:**
> "Everything runs locally for complete privacy - no data leaves your machine."

---

### Closing (10 seconds)

**Say:**
> "Thanks for watching! Check out the GitHub repo for the complete code, documentation, and setup instructions. Link in the description."

**Show:**
- Briefly show README on GitHub (optional)

---

## 🎨 Recording Tips

### Visual Tips:
- ✅ **Close unnecessary tabs/windows**
- ✅ **Hide desktop clutter**
- ✅ **Use full screen browser (F11)**
- ✅ **Zoom browser to 100% (Cmd/Ctrl + 0)**
- ✅ **Dark mode looks professional** (if your UI supports it)

### Audio Tips:
- ✅ **Use a microphone** (even cheap earbuds are better than laptop mic)
- ✅ **Record in quiet room**
- ✅ **Speak clearly and not too fast**
- ✅ **Pause briefly between sections**

### Content Tips:
- ✅ **Rehearse once before recording**
- ✅ **Have your script/notes visible**
- ✅ **It's okay to re-record if you mess up**
- ✅ **Keep it under 3 minutes** (attention span)

---

## 📤 Upload to YouTube

### Steps:

1. **Go to YouTube Studio**
   - Visit: [studio.youtube.com](https://studio.youtube.com)
   - Sign in

2. **Upload Video**
   - Click "Create" → "Upload videos"
   - Select your video file
   - Wait for upload

3. **Video Details**
   ```
   Title: PDF Q&A Application - AI-Powered Document Chat with RAG

   Description:
   AI-powered PDF question answering system built with Next.js, FastAPI, and LocalAI.

   🔗 GitHub: https://github.com/saikrishna01301/rag-based-pdf-reader
   🔗 Live Demo (UI): [Your Vercel URL]

   🛠️ Tech Stack:
   • Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
   • Backend: FastAPI, Python
   • AI: LocalAI (Phi-3.5), RAG, Vector Search
   • Database: Qdrant
   • Infrastructure: Docker Compose

   ✨ Features:
   • Upload PDFs and ask natural language questions
   • AI-powered answers with source citations
   • Semantic search using embeddings
   • Real-time streaming responses
   • Privacy-first (runs locally)

   Built by [Your Name]
   LinkedIn: [Your LinkedIn URL]
   Portfolio: [Your Portfolio URL]
   ```

4. **Visibility**
   - Select "Unlisted" (can share link but not searchable)
   - Or "Public" (if you want it on your channel)

5. **Thumbnail** (Optional but recommended)
   - Take screenshot of your app
   - Add text: "PDF Q&A with AI"
   - Use Canva or any image editor

6. **Publish**
   - Click "Publish"
   - Copy video URL

---

## 🔗 Alternative: Loom (Faster)

If using Loom instead of YouTube:

1. Record with Loom app
2. Video auto-uploads when done
3. Click "Copy link"
4. Add to README
5. Done! (No editing needed)

**Loom Pros:**
- Instant upload
- No rendering time
- Easy sharing
- Professional looking

---

## ✅ After Recording

### 1. Add to README

```markdown
## 📸 Demo

[![Video Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

**[▶️ Watch Full Demo](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)** (2:30)

Or view the [live UI preview](https://your-app.vercel.app) on Vercel.
```

### 2. Create GIF (Optional)

Extract a 10-second GIF from your video:

**Using GIPHY Capture (Mac):**
1. Download GIPHY Capture
2. Record 5-10 seconds of interesting part
3. Save as GIF
4. Add to README

**Using online tool:**
1. Upload video to [ezgif.com](https://ezgif.com/video-to-gif)
2. Select 10-second clip
3. Download GIF
4. Add to README

### 3. Update Portfolio Website

Add to your portfolio:
```markdown
### PDF Q&A Application
AI-powered document chat using RAG and LocalAI

[Live Demo (UI)](vercel-url) | [Video Demo](youtube-url) | [GitHub](github-url)
```

---

## 🎯 Quality Checklist

Before publishing, verify:

- [ ] Video is 2-3 minutes long
- [ ] Audio is clear and professional
- [ ] Shows PDF upload working
- [ ] Shows at least 2-3 questions
- [ ] Shows streaming responses
- [ ] Shows source citations
- [ ] Mentions tech stack
- [ ] No sensitive information visible
- [ ] Clean desktop/browser (no personal info)
- [ ] Good lighting (if showing camera)

---

## 💡 Pro Tips

1. **Practice run** - Record once as practice, watch it, improve, re-record
2. **Speed up** - You can speed up boring parts (like upload) in editing
3. **Add captions** - YouTube auto-generates captions (review and edit them)
4. **Pin comment** - Pin a comment with GitHub link and tech stack
5. **Share it** - Post on LinkedIn, Twitter, Reddit (r/webdev, r/MachineLearning)

---

## 📊 Example Demo Structure

```
0:00-0:15  Introduction + Overview
0:15-0:45  Upload PDF + Processing
0:45-2:15  Ask 3 questions + Show responses
2:15-2:35  Highlight architecture
2:35-2:45  Call to action (GitHub link)
```

---

Good luck with your recording! 🎥 You've got this! 🚀
