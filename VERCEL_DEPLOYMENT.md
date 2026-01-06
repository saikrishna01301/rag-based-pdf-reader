# 🎨 Vercel Frontend Deployment - Quick Guide

Deploy your Next.js frontend to Vercel in 5 minutes.

## 🚀 Quick Deploy (Recommended)

### Method 1: Vercel Dashboard (No CLI needed)

1. **Go to Vercel**
   - Visit: [vercel.com/new](https://vercel.com/new)
   - Sign up/Login with GitHub

2. **Import Repository**
   - Click "Add New Project"
   - Find: `saikrishna01301/rag-based-pdf-reader`
   - Click "Import"

3. **Configure Project**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Add Environment Variable**
   - Click "Environment Variables"
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://pdfqa-xxxxx.run.app` (your GCP Cloud Run URL)
   - Apply to: Production, Preview, Development
   - Click "Add"

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! 🎉

6. **Get Your URL**
   - You'll get: `https://rag-based-pdf-reader.vercel.app`
   - Or custom: `https://pdf-qa-saikrishna.vercel.app`

---

## 💻 Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Answer prompts:
# ? Set up and deploy "~/frontend"? Y
# ? Which scope? [Your Account]
# ? Link to existing project? N
# ? What's your project's name? pdf-qa-app
# ? In which directory is your code located? ./
# ? Want to override the settings? N

# You'll get a preview URL

# Set environment variable
vercel env add NEXT_PUBLIC_API_URL production

# When prompted, enter your Cloud Run URL:
# https://pdfqa-xxxxx.run.app

# Deploy to production
vercel --prod
```

---

## 🔄 Update Environment Variables Later

### Via Dashboard:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Settings → Environment Variables
4. Edit `NEXT_PUBLIC_API_URL`
5. Redeploy (Deployments → ... → Redeploy)

### Via CLI:
```bash
vercel env rm NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_API_URL production
vercel --prod
```

---

## 🎯 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain: `pdfqa.yourdomain.com`
3. Update DNS records as instructed
4. Wait 24-48 hours for DNS propagation

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `Cannot find module`
**Solution:**
```bash
# Ensure package.json is in frontend directory
cd frontend
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

### API URL Not Working

**Error:** API calls fail
**Solution:**
1. Check environment variable is set
2. Verify Cloud Run URL is correct
3. Ensure CORS is configured in backend
4. Redeploy frontend

### Preview vs Production

- **Preview**: Deployed on every git push
- **Production**: Only from main/master branch
- Set env vars for both environments

---

## ✅ Verification

After deployment:

1. Visit your Vercel URL
2. Open browser DevTools → Network tab
3. Try uploading a PDF
4. Check API requests go to your Cloud Run URL
5. Verify responses work correctly

---

## 🚀 Auto-Deploy on Git Push

Vercel automatically deploys when you push to GitHub:

- **Main branch** → Production
- **Other branches** → Preview deployments

No configuration needed! Just push:
```bash
git add .
git commit -m "Update feature"
git push
```

Vercel will auto-deploy within 1-2 minutes.

---

## 📊 Performance Tips

1. **Use Vercel Analytics** (Free)
   - Dashboard → Analytics
   - See real user metrics

2. **Enable Speed Insights**
   - Install `@vercel/speed-insights`
   - Add to your app

3. **Check Lighthouse Score**
   - Vercel runs it automatically
   - View in deployment details

---

## 🔗 Useful Links

- **Dashboard**: https://vercel.com/dashboard
- **Docs**: https://vercel.com/docs
- **CLI Docs**: https://vercel.com/docs/cli

---

That's it! Your frontend should be live now. 🎉
