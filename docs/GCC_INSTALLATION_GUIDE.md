# GCC Installation Guide for Windows

## 🎯 Why You Need GCC

SPECTRE needs GCC (GNU Compiler Collection) to:
- ✅ Compile C/C++ code for verification
- ✅ Test original code before obfuscation
- ✅ Verify obfuscated code works correctly
- ✅ Generate executable files

## ⚠️ Current Issue

**Error:** `[WinError 2] The system cannot find the file specified`

**Cause:** GCC is not installed or not in system PATH

**Impact:** Verification and code vault features won't work

---

## 🚀 Installation Options

### Option 1: WinLibs (Recommended - Easiest)

**Best for:** Quick setup, no installer needed

#### Steps:

1. **Download WinLibs:**
   - Visit: https://winlibs.com/
   - Download: `winlibs-x86_64-posix-seh-gcc-13.2.0-mingw-w64ucrt-11.0.1-r5.zip`
   - Or latest version from downloads section

2. **Extract:**
   ```
   Extract to: C:\mingw64
   ```

3. **Add to PATH:**
   
   **Method A - PowerShell (Temporary):**
   ```powershell
   $env:Path += ";C:\mingw64\bin"
   ```
   
   **Method B - System Settings (Permanent):**
   - Press `Win + X` → System
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", find "Path"
   - Click "Edit" → "New"
   - Add: `C:\mingw64\bin`
   - Click OK on all dialogs
   - **Restart terminal/IDE**

4. **Verify:**
   ```bash
   gcc --version
   ```
   
   Should show:
   ```
   gcc (GCC) 13.2.0
   ```

---

### Option 2: TDM-GCC (Easiest - Auto PATH)

**Best for:** Automatic installation with GUI

#### Steps:

1. **Download Installer:**
   - Visit: https://jmeubank.github.io/tdm-gcc/
   - Download: `tdm64-gcc-10.3.0-2.exe`

2. **Run Installer:**
   - Double-click the installer
   - Choose "Create" (new installation)
   - Select installation directory (default: `C:\TDM-GCC-64`)
   - **Check "Add to PATH"** ✅
   - Click Install

3. **Restart Terminal:**
   - Close and reopen any terminals/IDE
   - This loads the new PATH

4. **Verify:**
   ```bash
   gcc --version
   ```

---

### Option 3: MSYS2 (Advanced - Full Linux Tools)

**Best for:** Developers who want full Unix-like environment

#### Steps:

1. **Download MSYS2:**
   - Visit: https://www.msys2.org/
   - Download installer: `msys2-x86_64-latest.exe`

2. **Install MSYS2:**
   - Run installer
   - Install to: `C:\msys64`
   - Launch MSYS2 terminal

3. **Install GCC:**
   ```bash
   pacman -Syu
   pacman -S mingw-w64-x86_64-gcc
   ```

4. **Add to PATH:**
   Add: `C:\msys64\mingw64\bin`

5. **Verify:**
   ```bash
   gcc --version
   ```

---

### Option 4: Chocolatey (Package Manager)

**Best for:** Users with Chocolatey already installed

#### Steps:

1. **Install Chocolatey** (if not installed):
   - Visit: https://chocolatey.org/install
   - Run PowerShell as Administrator
   - Run installation command

2. **Install MinGW:**
   ```powershell
   choco install mingw
   ```

3. **Restart Terminal**

4. **Verify:**
   ```bash
   gcc --version
   ```

---

## ✅ Verification Steps

After installation, verify GCC is working:

### 1. Check Version
```bash
gcc --version
```

**Expected output:**
```
gcc (GCC) 13.2.0 (or similar)
Copyright (C) 2023 Free Software Foundation, Inc.
```

### 2. Test Compilation
Create test file `test.c`:
```c
#include <stdio.h>
int main() {
    printf("GCC works!\n");
    return 0;
}
```

Compile and run:
```bash
gcc test.c -o test.exe
test.exe
```

**Expected output:**
```
GCC works!
```

### 3. Test with SPECTRE
- Open SPECTRE app
- Upload a C file
- Click "Start Obfuscation"
- Should work without errors! ✅

---

## 🔄 After Installing GCC

### Re-enable Verification in SPECTRE

Once GCC is installed, re-enable verification:

**File:** `frontend/js/script.js` (line 141-142)

**Change from:**
```javascript
verify: false,  // Disabled until GCC is installed
create_vault: false  // Disabled until GCC is installed
```

**Change to:**
```javascript
verify: true,  // Re-enabled after GCC installation
create_vault: true  // Re-enabled after GCC installation
```

---

## 🐛 Troubleshooting

### Issue: "gcc is not recognized"

**Solution 1:** Restart terminal/IDE
```bash
# Close and reopen terminal
# PATH changes require restart
```

**Solution 2:** Check PATH manually
```powershell
$env:Path -split ';' | Select-String "mingw"
```

Should show your GCC path.

**Solution 3:** Add to PATH manually
```powershell
# Temporary (current session)
$env:Path += ";C:\mingw64\bin"

# Permanent (use System Settings as shown above)
```

### Issue: "Permission denied"

**Solution:** Run PowerShell/CMD as Administrator

### Issue: "Multiple GCC versions"

**Solution:** Ensure only one GCC in PATH
```powershell
where gcc
```

Should show only one path. If multiple, remove old ones from PATH.

### Issue: Still getting WinError 2

**Checklist:**
- [ ] GCC installed
- [ ] Added to PATH
- [ ] Terminal restarted
- [ ] Verified with `gcc --version`
- [ ] Test compilation works
- [ ] Backend server restarted

---

## 📊 Quick Comparison

| Method | Difficulty | Size | Auto PATH | Time |
|--------|-----------|------|-----------|------|
| WinLibs | Easy | ~200MB | Manual | 5 min |
| TDM-GCC | Easiest | ~150MB | ✅ Auto | 3 min |
| MSYS2 | Medium | ~500MB | Manual | 10 min |
| Chocolatey | Easy | ~200MB | ✅ Auto | 5 min |

**Recommendation:** Use **TDM-GCC** for quickest setup with auto PATH.

---

## 🎯 Recommended: TDM-GCC Installation

### Step-by-Step with Screenshots:

1. **Download:** https://jmeubank.github.io/tdm-gcc/
2. **Run:** `tdm64-gcc-10.3.0-2.exe`
3. **Select:** "Create" → Next
4. **Check:** ✅ "Add to PATH"
5. **Install:** Click Install button
6. **Wait:** ~2 minutes
7. **Done:** Close installer
8. **Restart:** Close and reopen terminal
9. **Test:** `gcc --version`

---

## ✨ After Installation

### What You Can Do:

✅ **Full Verification** - Compile and test code  
✅ **Code Vault** - Password-protected backups  
✅ **Security Score** - Complete analysis  
✅ **Platform Builds** - Windows and Linux  
✅ **Example Programs** - Test all examples  

### SPECTRE Features Now Available:

1. **Baseline Verification** - Runs original code
2. **Obfuscation Verification** - Tests obfuscated code
3. **Output Comparison** - Ensures correctness
4. **Code Vault Creation** - Encrypted backups
5. **Complete Reports** - Full statistics

---

## 📝 Quick Reference

### Installation Commands

**WinLibs:**
```powershell
# Extract to C:\mingw64
$env:Path += ";C:\mingw64\bin"
gcc --version
```

**TDM-GCC:**
```
Download → Run Installer → Check "Add to PATH" → Install
```

**Chocolatey:**
```powershell
choco install mingw
gcc --version
```

### Verification Commands

```bash
# Check installation
gcc --version

# Test compilation
gcc test.c -o test.exe

# Run test
test.exe
```

---

## 🆘 Still Having Issues?

1. **Check installation path exists:**
   ```powershell
   Test-Path C:\mingw64\bin\gcc.exe
   ```

2. **Manually test GCC:**
   ```bash
   C:\mingw64\bin\gcc.exe --version
   ```

3. **Check system PATH:**
   ```powershell
   [Environment]::GetEnvironmentVariable("Path", "Machine")
   ```

4. **Restart everything:**
   - Close IDE
   - Close all terminals
   - Restart computer (if needed)
   - Try again

---

## ✅ Success Checklist

- [ ] GCC downloaded
- [ ] GCC extracted/installed
- [ ] Added to PATH
- [ ] Terminal restarted
- [ ] `gcc --version` works
- [ ] Test compilation works
- [ ] Backend server restarted
- [ ] SPECTRE obfuscation works
- [ ] Verification enabled

---

**Once GCC is installed, SPECTRE will have full functionality!** 🎉

*For issues, check the troubleshooting section or verify PATH settings.*
