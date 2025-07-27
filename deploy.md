# Quick Vercel Deployment Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "New repository"
3. Name it: `portfolio` or `armstrong-portfolio`
4. Make it **Public** (required for free hosting)
5. Click "Create repository"

### Step 2: Upload Files
1. In your new repository, click "uploading an existing file"
2. Drag and drop ALL your portfolio files:
   - `Index.html`
   - `styles.css`
   - `app.js`
   - `sw.js`
   - `manifest.json`
   - `vercel.json`
   - `.gitignore`
   - `img/` folder (with all images)
   - `Pdf/` folder (with Arms.pdf)
   - `Proposal.html`
3. Click "Commit changes"

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your portfolio repository
5. Click "Deploy"

### Step 4: Get Your URL
- Your site will be live at: `https://your-project-name.vercel.app`
- You can add a custom domain later

## 🔧 Before Deploying

### Update These Placeholders:
1. **Google Analytics**: Replace `G-XXXXXXXXXX` in `Index.html`
2. **Formspree**: Replace `xpzgwqzg` in the contact form

### Test Locally First:
```bash
# Open Index.html in your browser
# Check console for errors
# Test all links and forms
```

## ✅ Done!

Your portfolio will be live and accessible worldwide!

## 🌐 Custom Domain (Optional)

1. Buy a domain (e.g., `armstrongnzotta.com`)
2. In Vercel dashboard → Settings → Domains
3. Add your domain
4. Update DNS settings as instructed

---

**Need help?** Check the full `DEPLOYMENT_GUIDE.md` for detailed instructions. 