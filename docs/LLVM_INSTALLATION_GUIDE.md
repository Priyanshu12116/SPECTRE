# LLVM Installation Guide for SPECTRE

## 🎯 Overview

This guide will help you install the LLVM toolchain required for SPECTRE's SIH-compliant object file obfuscation.

**Required Tools:**
- `clang` - LLVM C/C++ compiler
- `opt` - LLVM optimizer
- `llc` - LLVM static compiler

---

## 🪟 Windows Installation

### Method 1: Chocolatey (Recommended)

**Step 1: Install Chocolatey** (if not already installed)
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

**Step 2: Install LLVM**
```powershell
# Run as Administrator
choco install llvm -y
```

**Step 3: Verify Installation**
```powershell
clang --version
opt --version
llc --version
```

### Method 2: Direct Download

**Step 1: Download LLVM**
- Visit: https://github.com/llvm/llvm-project/releases
- Download: `LLVM-17.0.6-win64.exe` (or latest version)
- Run the installer

**Step 2: Add to PATH**
```powershell
# Add LLVM to PATH (replace with your installation path)
$env:Path += ";C:\Program Files\LLVM\bin"

# Make it permanent
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\Program Files\LLVM\bin",
    "Machine"
)
```

**Step 3: Verify**
```powershell
clang --version
```

### Method 3: Pre-built Binaries

**Step 1: Download**
- Visit: https://releases.llvm.org/download.html
- Download Windows pre-built binaries
- Extract to `C:\LLVM`

**Step 2: Add to PATH**
```powershell
$env:Path += ";C:\LLVM\bin"
```

---

## 🐧 Linux Installation

### Ubuntu/Debian

```bash
# Update package list
sudo apt-get update

# Install LLVM toolchain
sudo apt-get install -y clang llvm

# Verify installation
clang --version
opt --version
llc --version
```

### Fedora/RHEL/CentOS

```bash
# Install LLVM
sudo dnf install clang llvm

# Verify
clang --version
```

### Arch Linux

```bash
# Install LLVM
sudo pacman -S clang llvm

# Verify
clang --version
```

### From Source (Advanced)

```bash
# Clone LLVM
git clone https://github.com/llvm/llvm-project.git
cd llvm-project

# Build
mkdir build && cd build
cmake -G "Unix Makefiles" -DLLVM_ENABLE_PROJECTS="clang" ../llvm
make -j$(nproc)
sudo make install
```

---

## 🍎 macOS Installation

### Using Homebrew

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install LLVM
brew install llvm

# Add to PATH
echo 'export PATH="/usr/local/opt/llvm/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify
clang --version
```

### Using Xcode Command Line Tools

```bash
# Install Xcode Command Line Tools (includes clang)
xcode-select --install

# Verify
clang --version
```

---

## ✅ Verification

### Test LLVM Installation

Create a test file `test.c`:
```c
#include <stdio.h>

int main() {
    printf("Hello from LLVM!\n");
    return 0;
}
```

### Test Compilation Workflow

```bash
# Step 1: Compile to LLVM IR
clang -S -emit-llvm test.c -o test.ll

# Step 2: View IR (optional)
cat test.ll

# Step 3: Optimize IR
opt -O2 test.ll -S -o test_opt.ll

# Step 4: Generate object file
llc -filetype=obj test_opt.ll -o test.o

# Step 5: Link to executable
clang test.o -o test.exe

# Step 6: Run
./test.exe
```

**Expected Output:**
```
Hello from LLVM!
```

---

## 🔧 Test SPECTRE LLVM Integration

### Quick Test

```bash
# Navigate to backend
cd backend

# Run LLVM obfuscator test
python llvm_obfuscator.py
```

**Expected Output:**
```
LLVM Toolchain Status:
{
  "llvm_available": true,
  "ollvm_available": false,
  "tools": {
    "clang": true,
    "opt": true,
    "llc": true
  }
}

Starting obfuscation test...
============================================================
SPECTRE LLVM Obfuscation Workflow
============================================================
Step 1/4: Compiling to LLVM IR...
✓ Generated IR: 15 instructions
Step 2/4: Applying obfuscation passes (level: balanced)...
✓ Applied 3 passes
Step 3/4: Generating object file...
✓ Object file: 1234 bytes
Step 4/4: Linking executable...
✓ Executable generated: output.exe
============================================================
✓ LLVM Obfuscation Complete (2.34s)
============================================================

✓ Obfuscation successful!
```

### Test via API

```bash
# Start SPECTRE backend
python wsgi.py

# In another terminal, check LLVM status
curl http://localhost:5000/api/llvm/status
```

**Expected Response:**
```json
{
  "llvm_available": true,
  "ollvm_available": false,
  "tools": {
    "clang": true,
    "opt": true,
    "llc": true
  },
  "ready": true,
  "message": "LLVM toolchain is ready"
}
```

---

## 🚨 Troubleshooting

### Issue 1: "clang: command not found"

**Solution:**
```bash
# Windows
# Add LLVM to PATH (see installation steps above)

# Linux
sudo apt-get install clang

# macOS
brew install llvm
```

### Issue 2: "Permission denied"

**Solution:**
```bash
# Linux/macOS
chmod +x /path/to/llvm/bin/*

# Windows
# Run PowerShell as Administrator
```

### Issue 3: "LLVM toolchain not available"

**Check Installation:**
```bash
# Verify each tool
where clang    # Windows
which clang    # Linux/macOS

where opt
where llc
```

**Reinstall if needed:**
```bash
# Windows
choco uninstall llvm
choco install llvm -y

# Linux
sudo apt-get remove clang llvm
sudo apt-get install clang llvm
```

### Issue 4: Version Mismatch

**Check Versions:**
```bash
clang --version
opt --version
llc --version
```

**Ensure all are from the same LLVM version** (e.g., all version 17.x)

### Issue 5: PATH Not Updated

**Windows:**
```powershell
# Check PATH
$env:Path

# Add LLVM manually
$env:Path += ";C:\Program Files\LLVM\bin"

# Restart terminal
```

**Linux/macOS:**
```bash
# Check PATH
echo $PATH

# Add to .bashrc or .zshrc
echo 'export PATH="/usr/local/opt/llvm/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

---

## 📊 Version Compatibility

| LLVM Version | Status | Notes |
|--------------|--------|-------|
| 17.x | ✅ Recommended | Latest stable |
| 16.x | ✅ Supported | Stable |
| 15.x | ✅ Supported | Stable |
| 14.x | ⚠️ Older | May work |
| < 14.x | ❌ Not recommended | Too old |

---

## 🎓 Optional: Obfuscator-LLVM

For advanced obfuscation, you can install Obfuscator-LLVM (O-LLVM):

### Installation

```bash
# Clone O-LLVM
git clone -b llvm-4.0 https://github.com/obfuscator-llvm/obfuscator.git

# Build (requires CMake and build tools)
cd obfuscator
mkdir build && cd build
cmake -DCMAKE_BUILD_TYPE=Release ../
make -j$(nproc)

# Install
sudo make install
```

### Test O-LLVM

```bash
# Test with obfuscation flags
clang -mllvm -fla -mllvm -sub test.c -o test_obf.exe
```

**Note:** O-LLVM is optional. SPECTRE works with standard LLVM.

---

## 📚 Additional Resources

### Official Documentation
- LLVM Homepage: https://llvm.org/
- Getting Started: https://llvm.org/docs/GettingStarted.html
- Clang Documentation: https://clang.llvm.org/docs/

### Downloads
- LLVM Releases: https://releases.llvm.org/
- GitHub: https://github.com/llvm/llvm-project

### Tutorials
- LLVM Tutorial: https://llvm.org/docs/tutorial/
- Clang Tutorial: https://clang.llvm.org/docs/IntroductionToTheClangAST.html

---

## ✅ Installation Checklist

- [ ] LLVM installed
- [ ] `clang` command works
- [ ] `opt` command works
- [ ] `llc` command works
- [ ] PATH updated
- [ ] Test compilation successful
- [ ] SPECTRE backend recognizes LLVM
- [ ] API status check returns `llvm_available: true`

---

## 🎯 Next Steps

Once LLVM is installed:

1. **Start SPECTRE Backend:**
   ```bash
   cd backend
   python wsgi.py
   ```

2. **Open Frontend:**
   - Navigate to `frontend/pages/app.html`
   - Select "LLVM" compiler
   - Upload C/C++ code
   - Start obfuscation

3. **Verify SIH Compliance:**
   - Check logs for "LLVM IR Transformation"
   - Verify "Object-level obfuscation" message
   - Confirm object file size is reported

---

## 💡 Quick Commands Reference

```bash
# Check installation
clang --version

# Compile to IR
clang -S -emit-llvm input.c -o output.ll

# Optimize
opt -O2 input.ll -o output.bc

# Generate object
llc -filetype=obj input.bc -o output.o

# Link
clang output.o -o executable

# Test SPECTRE
python backend/llvm_obfuscator.py

# Check API status
curl http://localhost:5000/api/llvm/status
```

---

**Installation Complete!** 🎉

Your SPECTRE platform is now SIH-compliant with LLVM-based object file obfuscation.

---

*Last Updated: 2025-10-10*  
*SPECTRE Version: 2.0 (LLVM-enabled)*
