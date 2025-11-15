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

### 4. **Update Cultivar Content** (JSON files)
```bash
# Edit content files in public/data/cultivars/[cultivar-id]/
# Files: content.json, content.es.json, content.pt.json
git add public/data/cultivars/
git commit -m "Update: cultivar content for [cultivar-name]"
git push
```

### 5. **Update Chart Data** (CSV files)
```bash
# Edit CSV files in public/data/csv/
git add public/data/csv/
git commit -m "Update: chart data for [cultivar-name]"
git push
```

### 6. **Major Update** (multiple components, data, images)
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

## 📁 Current File Structure

```
cbc-cultivar-explorer/
├── app/
│   ├── page.tsx              # Main app router and layout
│   ├── layout.tsx            # Root layout with providers
│   ├── globals.css           # Global styles and theme system
│   ├── cultivar-themes.css   # Cultivar-specific color themes
│   └── api/
│       └── contact/
│           └── route.ts      # Contact form API endpoint
├── components/
│   ├── CultivarDetailCardV2.tsx  # Primary detail view component
│   ├── CultivarIcon.tsx          # Reusable icon rendering (NEW)
│   ├── Homepage.tsx              # Welcome/intro page
│   ├── TopNav.tsx                # Navigation bar
│   ├── CultivarFilterPanel.tsx   # Filter controls
│   ├── CultivarChart.tsx         # Performance comparison charts
│   ├── SpiderChart.tsx           # Trait radar charts
│   ├── CultivarSelector.tsx      # Cultivar selection UI
│   ├── ImageCarousel.tsx         # Auto-rotating image display
│   ├── ContactForm.tsx           # Inquiry form
│   ├── InfoOverlayMobile.tsx     # Mobile info overlay
│   └── LanguageContext.tsx       # i18n support
├── data/
│   ├── cultivars.ts              # Core cultivar data definitions
│   ├── cultivarContent.ts        # Content loading logic
│   ├── chartData.ts              # Chart data and comparison logic
│   ├── infoOverlayContent.ts     # Info overlay system
│   ├── csvParser.ts              # CSV parsing utilities
│   └── i18n/                     # Translation files
│       ├── en.json, es.json, pt.json
│       └── infoOverlay.*.json
├── public/
│   ├── images/
│   │   ├── cultivars/            # Cultivar-specific images
│   │   │   └── [cultivar-id]/    # banner.jpg, [id]_1.jpg, etc.
│   │   ├── backgrounds/          # Background images
│   │   └── icons/                # Card icons (31 PNG files)
│   └── data/
│       ├── cultivars/            # Rich content JSON files
│       │   └── [cultivar-id]/
│       │       ├── content.json
│       │       ├── content.es.json
│       │       └── content.pt.json
│       └── csv/                  # Chart data CSV files
├── types/
│   ├── cultivar.ts               # TypeScript type definitions
│   └── background.ts
├── docs/
│   ├── INDEX.md                  # Master documentation index
│   ├── CODE_STRUCTURE.md         # Code structure guide
│   └── CSS_THEME_SYSTEM.md       # CSS architecture documentation
└── data/
    └── README_ArchitectureGuide.md  # Complete architecture guide
```

---

## 🚀 Deployment Process

### Branch Strategy
- **Production Branch**: `feature/major-ui-redesign-with-carousels` (currently deployed to Vercel)
- **Development Branch**: `refactor/clean-code-2025` (for refactoring work)
- **Main Branch**: `main` (default branch)

### Auto-Deployment
The app auto-deploys when you push to the production branch:

1. **GitHub** receives your push
2. **Vercel** detects the change
3. **Vercel** runs `npm run build`
4. **Vercel** deploys if build succeeds
5. **Live site** updates automatically

### Check Deployment Status
- Visit your [Vercel Dashboard](https://vercel.com/dashboard)
- Check which branch is set as production branch in Vercel settings
- Or check the GitHub repo for deployment status badges

### Switching Production Branch
To change which branch deploys to production:
1. Go to Vercel Dashboard → Project Settings → Git
2. Change the "Production Branch" setting
3. Save changes

---

## 🔍 Git Commands Reference

### Check Status
```bash
git status                  # See what files changed
git diff                    # See exact changes made
git log --oneline          # See recent commits
git branch                 # List all branches
git remote -v              # Check remote repository URLs
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
git push                   # Push to current branch
git push origin branch-name # Push to specific branch
git pull                   # Get latest changes from GitHub
```

### Branches
```bash
git branch                 # List branches
git checkout -b new-feature # Create new branch
git checkout branch-name   # Switch to branch
git merge branch-name      # Merge branch into current
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
- Cultivar banners: 1200x400px (3:1 aspect ratio)
- Cultivar carousel images: 1200x800px
- Card icons: 130px width, 50px height (mobile), or 130px width (desktop)
- Background images: Optimized for full-screen display

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
git commit -m "Content: add new strawberry cultivar"
git commit -m "Content: update cultivar descriptions"
git commit -m "Images: batch upload cultivar photos"

# Refactoring
git commit -m "Refactor: extract icon rendering to component"
git commit -m "Refactor: simplify useEffect patterns"
```

---

## 🎯 Workflow Summary

1. **Develop**: `npm run dev` → make changes → test locally
2. **Verify**: `npm run build` → check for errors
3. **Commit**: `git add .` → `git commit -m "message"`
4. **Deploy**: `git push` (to production branch)
5. **Monitor**: Check Vercel dashboard for deployment status

**Remember**: Every `git push` to the production branch triggers a new deployment!

---

## 📚 Key Components Reference

### Recently Refactored Components
- **CultivarIcon.tsx**: New component that centralizes icon rendering logic (replaces 256+ lines of duplication)
- **CultivarDetailCardV2.tsx**: Simplified useEffect patterns and cultivar-specific logic
- **page.tsx**: Now uses CultivarIcon component for cleaner code

### Removed Components (Dead Code)
- ~~CultivarCard.tsx~~ (deleted - not used)
- ~~CultivarList.tsx~~ (deleted - not used)

### Data Files
- **cultivars.ts**: Core cultivar registry (11 cultivars)
- **cultivarContent.ts**: Loads rich content from JSON files
- **chartData.ts**: Chart data and comparison logic
- **infoOverlayContent.ts**: Info overlay system

---

## 🔗 Related Documentation

- `docs/INDEX.md` - Master documentation index (start here!)
- `README.md` - Project overview and features
- `docs/CODE_STRUCTURE.md` - File-by-file code structure guide
- `docs/CSS_THEME_SYSTEM.md` - CSS architecture and theme system
- `data/README_ArchitectureGuide.md` - Complete architecture documentation
- `data/README_ChartSystem.md` - Chart system documentation
- `data/README_InfoOverlaySystem.md` - Info overlay system documentation
