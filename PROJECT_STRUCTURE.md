# SPECTRE Project Structure Guide

## 📁 Recommended Organization

This document describes the ideal project structure for SPECTRE. Files are currently in root but should be organized as follows:

```
SPECTRE/
│
├── 📄 README.md                          # Main project documentation
├── 📄 .gitignore                         # Git ignore rules
├── 📄 .env.example                       # Environment variables template
│
├── 📂 backend/                           # Backend server and obfuscation engine
│   ├── server.py                         # Flask API server
│   ├── obfuscator.py                     # Basic obfuscator
│   ├── advanced_obfuscator.py            # Advanced obfuscation engine
│   ├── requirements.txt                  # Python dependencies
│   └── __init__.py                       # Package initializer
│
├── 📂 frontend/                          # Frontend web application
│   │
│   ├── 📂 pages/                         # HTML pages
│   │   ├── index.html                    # Landing page
│   │   ├── app.html                      # Main application
│   │   ├── login.html                    # Login page
│   │   └── features.html                 # Features showcase
│   │
│   ├── 📂 css/                           # Stylesheets
│   │   ├── style.css                     # Main application styles
│   │   ├── style-home.css                # Homepage styles
│   │   └── auth.css                      # Authentication styles
│   │
│   ├── 📂 js/                            # JavaScript files
│   │   ├── script.js                     # Main application logic
│   │   ├── home.js                       # Homepage functionality
│   │   └── auth.js                       # Authentication logic
│   │
│   └── 📂 assets/                        # Frontend assets
│       └── 📂 images/                    # Images
│           ├── spectrelogo.jpg           # SPECTRE logo
│           ├── shield.png                # Shield icon
│           └── worldmap.jpg              # World map background
│
├── 📂 docs/                              # Documentation
│   ├── QUICK_START.md                    # 5-minute getting started
│   ├── ADVANCED_OBFUSCATION_GUIDE.md     # Technical documentation
│   ├── OBFUSCATION_GUIDE.md              # Implementation details
│   ├── IMPLEMENTATION_SUMMARY.md         # Complete summary
│   ├── DEPLOYMENT_SUMMARY.md             # Deployment guide
│   └── README_CODE_REVIEW.md             # Code review documentation
│
├── 📂 examples/                          # Example C/C++ programs
│   ├── simple_hello.c                    # Beginner example
│   ├── calculator.c                      # Intermediate example
│   ├── password_checker.c                # Advanced example
│   └── README.md                         # Examples guide
│
└── 📂 tests/                             # Test files (future)
    ├── test_obfuscator.py                # Unit tests for obfuscator
    ├── test_api.py                       # API endpoint tests
    └── test_examples.py                  # Example program tests
```

## 🔄 Current vs Recommended Structure

### Current Structure (Root Level)
```
SPECTRE/
├── *.html (4 files)          ❌ Should be in frontend/pages/
├── *.css (3 files)           ❌ Should be in frontend/css/
├── *.js (3 files)            ❌ Should be in frontend/js/
├── *.jpg, *.png (3 files)    ❌ Should be in frontend/assets/images/
├── *.md (6 files)            ❌ Should be in docs/ (except README.md)
├── backend/ ✅               ✅ Correct location
└── examples/ ✅              ✅ Correct location
```

### Recommended Structure (Organized)
```
SPECTRE/
├── README.md ✅
├── frontend/ ✅
│   ├── pages/ ✅
│   ├── css/ ✅
│   ├── js/ ✅
│   └── assets/images/ ✅
├── backend/ ✅
├── docs/ ✅
├── examples/ ✅
└── tests/ ✅
```

## 📋 File Migration Checklist

### Step 1: Create Directories
```bash
# Create main directories
New-Item -ItemType Directory -Path "frontend\pages","frontend\css","frontend\js","frontend\assets\images","docs","tests" -Force
```

### Step 2: Move HTML Files
```bash
Move-Item -Path "index.html" -Destination "frontend\pages\"
Move-Item -Path "app.html" -Destination "frontend\pages\"
Move-Item -Path "login.html" -Destination "frontend\pages\"
Move-Item -Path "features.html" -Destination "frontend\pages\"
```

### Step 3: Move CSS Files
```bash
Move-Item -Path "style.css" -Destination "frontend\css\"
Move-Item -Path "style-home.css" -Destination "frontend\css\"
Move-Item -Path "auth.css" -Destination "frontend\css\"
```

### Step 4: Move JavaScript Files
```bash
Move-Item -Path "script.js" -Destination "frontend\js\"
Move-Item -Path "home.js" -Destination "frontend\js\"
Move-Item -Path "auth.js" -Destination "frontend\js\"
```

### Step 5: Move Images
```bash
Move-Item -Path "spectrelogo.jpg" -Destination "frontend\assets\images\"
Move-Item -Path "shield.png" -Destination "frontend\assets\images\"
Move-Item -Path "worldmap.jpg" -Destination "frontend\assets\images\"
```

### Step 6: Move Documentation
```bash
Move-Item -Path "QUICK_START.md" -Destination "docs\"
Move-Item -Path "ADVANCED_OBFUSCATION_GUIDE.md" -Destination "docs\"
Move-Item -Path "OBFUSCATION_GUIDE.md" -Destination "docs\"
Move-Item -Path "IMPLEMENTATION_SUMMARY.md" -Destination "docs\"
Move-Item -Path "DEPLOYMENT_SUMMARY.md" -Destination "docs\"
Move-Item -Path "README_CODE_REVIEW.md" -Destination "docs\"
```

## 🔧 Required Path Updates After Migration

### 1. HTML Files - Update Asset Paths

#### In `frontend/pages/index.html`:
```html
<!-- Before -->
<link rel="stylesheet" href="style-home.css">
<img src="spectrelogo.jpg" alt="SPECTRE Logo">

<!-- After -->
<link rel="stylesheet" href="../css/style-home.css">
<img src="../assets/images/spectrelogo.jpg" alt="SPECTRE Logo">
<script src="../js/home.js"></script>
```

#### In `frontend/pages/app.html`:
```html
<!-- Before -->
<link rel="stylesheet" href="style.css">
<link rel="icon" href="spectrelogo.jpg">

<!-- After -->
<link rel="stylesheet" href="../css/style.css">
<link rel="icon" href="../assets/images/spectrelogo.jpg">
<script src="../js/script.js"></script>
```

#### In `frontend/pages/login.html`:
```html
<!-- Before -->
<link rel="stylesheet" href="auth.css">

<!-- After -->
<link rel="stylesheet" href="../css/auth.css">
<script src="../js/auth.js"></script>
```

#### In `frontend/pages/features.html`:
```html
<!-- Before -->
<link rel="stylesheet" href="style-home.css">

<!-- After -->
<link rel="stylesheet" href="../css/style-home.css">
```

### 2. CSS Files - Update Image Paths

#### In `frontend/css/style-home.css`:
```css
/* Before */
background-image: url('worldmap.jpg');

/* After */
background-image: url('../assets/images/worldmap.jpg');
```

### 3. JavaScript Files - Update Paths

#### In `frontend/js/auth.js`:
```javascript
// Update any relative paths if needed
// Usually no changes required for JS logic
```

### 4. README.md - Update Documentation Links

```markdown
<!-- Before -->
- [QUICK_START.md](QUICK_START.md)

<!-- After -->
- [QUICK_START.md](docs/QUICK_START.md)
```

## 🚀 Benefits of Organized Structure

### 1. **Better Maintainability**
- Easy to find files
- Clear separation of concerns
- Logical grouping

### 2. **Scalability**
- Easy to add new features
- Simple to add more pages/components
- Clear where new files go

### 3. **Professional Standards**
- Follows industry best practices
- Easier for team collaboration
- Better for version control

### 4. **Deployment Ready**
- Clear frontend/backend separation
- Easy to configure build tools
- Simple to containerize (Docker)

### 5. **Testing**
- Dedicated test directory
- Easy to run test suites
- Clear test organization

## 📝 Alternative: Keep Current Structure

If you prefer to keep files in root for simplicity:

### Pros:
- ✅ No path updates needed
- ✅ Quick access to files
- ✅ Simple for small projects

### Cons:
- ❌ Cluttered root directory
- ❌ Hard to scale
- ❌ Not professional standard
- ❌ Difficult for teams

## 🎯 Recommended Approach

### For Development (Current):
Keep current structure for rapid development and testing.

### For Production:
Migrate to organized structure before deployment.

### Migration Script:
```powershell
# Run this script to organize all files at once
# Save as: organize_project.ps1

# Create directories
$dirs = @(
    "frontend\pages",
    "frontend\css", 
    "frontend\js",
    "frontend\assets\images",
    "docs",
    "tests"
)

foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Path $dir -Force
}

# Move HTML files
Move-Item -Path "index.html" -Destination "frontend\pages\" -Force
Move-Item -Path "app.html" -Destination "frontend\pages\" -Force
Move-Item -Path "login.html" -Destination "frontend\pages\" -Force
Move-Item -Path "features.html" -Destination "frontend\pages\" -Force

# Move CSS files
Move-Item -Path "*.css" -Destination "frontend\css\" -Force

# Move JS files
Move-Item -Path "*.js" -Destination "frontend\js\" -Force

# Move images
Move-Item -Path "*.jpg","*.png" -Destination "frontend\assets\images\" -Force

# Move docs (except README.md)
Get-ChildItem -Path "*.md" | Where-Object { $_.Name -ne "README.md" } | Move-Item -Destination "docs\" -Force

Write-Host "✅ Project organized successfully!"
Write-Host "⚠️  Remember to update file paths in HTML/CSS files!"
```

## 📚 Next Steps

1. **Review this structure** - Understand the organization
2. **Decide when to migrate** - Now or before production
3. **Run migration script** - Use provided PowerShell script
4. **Update paths** - Fix all relative paths in files
5. **Test thoroughly** - Ensure everything still works
6. **Update documentation** - Reflect new structure

## 🔗 Quick Reference

### Opening Files After Migration

**Landing Page:**
```
frontend/pages/index.html
```

**Main Application:**
```
frontend/pages/app.html
```

**Documentation:**
```
docs/QUICK_START.md
docs/ADVANCED_OBFUSCATION_GUIDE.md
```

**Backend:**
```
backend/server.py
backend/advanced_obfuscator.py
```

**Examples:**
```
examples/simple_hello.c
examples/calculator.c
```

---

**Choose your approach and organize when ready!** 📁✨
