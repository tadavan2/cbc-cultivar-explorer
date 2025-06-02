# CBC Cultivar Explorer - Deployment & Update Guide

## 📋 Quick Reference Commands

### Basic Workflow
```bash
# 1. Make your changes (edit files, add images, etc.)
# 2. Test locally with development server
npm run dev

# 3. Test production build locally
npm run build
npm run start  # (kill dev server first if running)

# 4. Deploy to production
git add .
git commit -m "Your descriptive message"
git push
```

---

## 🔄 Common Update Scenarios

### 1. **Update Single File** (e.g., fix a component)
```bash
# Edit your file, then:
git add path/to/your/file.tsx
git commit -m "Fix: describe what you fixed"
git push
```

### 2. **Update Multiple Files** 
```bash
# Edit multiple files, then:
git add file1.tsx file2.tsx file3.tsx
# OR add all changed files:
git add .

git commit -m "Update: describe your changes"
git push
```

### 3. **Add New Images** (batch upload)
```bash
# Copy your new images to public/images/cultivars/[cultivar-name]/
# Then:
git add public/images/
git commit -m "Add new cultivar images for [cultivar-name]"
git push
```

### 4. **Update Entire Folder** (e.g., all cultivar data)
```bash
# Make your changes, then:
git add data/
git commit -m "Update all cultivar data"
git push
```

### 5. **Major Update** (multiple components, data, images)
```bash
# Make all your changes, then:
git add .
git commit -m "Major update: describe overall changes"
git push
```

---

## 🧪 Testing Before Deployment

### Development Testing (fast, hot reload)
```bash
npm run dev
# Visit http://localhost:3000
# Make changes, see them instantly
```

### Production Testing (exact same as Vercel)
```bash
# Stop dev server first (Ctrl+C)
npm run build    # Check for errors
npm run start    # Test production build locally
# Visit http://localhost:3000
```

**Important:** Always run `npm run build` before deploying to catch errors locally!

---

## 📁 File Structure Guide

```
cbc-cultivar-explorer/
├── app/                    # Main app pages
├── components/             # React components  
├── data/                   # CSV data, configurations
├── public/
│   ├── images/
│   │   ├── cultivars/      # Cultivar-specific images
│   │   ├── backgrounds/    # Background images
│   │   └── icons/          # Icon files
│   └── data/
│       └── csv/            # CSV data files
└── types/                  # TypeScript definitions
```

---

## 🚀 Deployment Process

Your app auto-deploys when you push to GitHub main branch:

1. **GitHub** receives your push
2. **Vercel** detects the change
3. **Vercel** runs `npm run build`
4. **Vercel** deploys if build succeeds
5. **Live site** updates automatically

### Check Deployment Status
- Visit your [Vercel Dashboard](https://vercel.com/dashboard)
- Or check the GitHub repo for deployment status badges

---

## 🔍 Git Commands Reference

### Check Status
```bash
git status                  # See what files changed
git diff                    # See exact changes made
git log --oneline          # See recent commits
```

### Staging Changes
```bash
git add filename.tsx       # Add specific file
git add folder/            # Add entire folder
git add .                  # Add all changes
git add *.tsx              # Add all .tsx files
```

### Committing
```bash
git commit -m "Your message"              # Commit with message
git commit -am "Message"                  # Add all & commit
git commit --amend -m "New message"       # Fix last commit message
```

### Pushing & Pulling
```bash
git push                   # Push to GitHub (triggers deployment)
git pull                   # Get latest changes from GitHub
git push origin main       # Explicit push to main branch
```

### Branches (if needed)
```bash
git branch                 # List branches
git checkout -b new-feature # Create new branch
git checkout main          # Switch to main branch
git merge new-feature      # Merge branch into current
```

---

## 🖼️ Image Optimization Tips

Before adding new images:

```bash
# Optimize images on macOS (keeps same quality, reduces size)
sips -Z 1200 your-image.jpg  # Resize to max 1200px
sips -s format png your-image.jpg --out your-image.png  # Convert format
```

**Recommended image sizes:**
- Cultivar banners: 1200x400px
- Cultivar thumbnails: 300x200px  
- Icons: 64x64px or 128x128px

---

## ⚠️ Troubleshooting

### Build Fails on Vercel
```bash
# Test locally first:
npm run build
# Fix any errors, then push again
```

### Port 3000 Already in Use
```bash
# Kill dev server:
Ctrl+C (in terminal running npm run dev)

# Or kill all Node processes:
killall node
```

### Forgot What You Changed
```bash
git status          # See modified files
git diff            # See exact changes
git diff --staged   # See staged changes
```

### Undo Changes
```bash
git checkout filename.tsx   # Undo changes to specific file
git reset HEAD filename.tsx # Unstage specific file
git reset --hard HEAD       # Undo ALL changes (dangerous!)
```

---

## 📝 Commit Message Templates

```bash
# Features
git commit -m "Add: new cultivar comparison tool"
git commit -m "Feature: mobile responsive navigation"

# Fixes
git commit -m "Fix: chart display on mobile devices"
git commit -m "Bugfix: cultivar filter not working"

# Updates
git commit -m "Update: optimize all cultivar images"
git commit -m "Improve: chart loading performance"

# Content
git commit -m "Content: add 5 new strawberry cultivars"
git commit -m "Images: batch upload cultivar photos"
```

---

## 🎯 Workflow Summary

1. **Develop**: `npm run dev` → make changes → test locally
2. **Verify**: `npm run build` → check for errors
3. **Deploy**: `git add .` → `git commit -m "message"` → `git push`
4. **Monitor**: Check Vercel dashboard for deployment status

**Remember**: Every `git push` triggers a new deployment! 