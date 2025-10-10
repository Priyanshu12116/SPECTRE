# Quick LLVM Installation for Windows (No Chocolatey Required)

## Method 1: Direct Download (Recommended)

### Step 1: Download LLVM

**Download Link:** https://github.com/llvm/llvm-project/releases/download/llvmorg-17.0.6/LLVM-17.0.6-win64.exe

Or visit: https://github.com/llvm/llvm-project/releases/latest

### Step 2: Run Installer

1. Double-click the downloaded `.exe` file
2. Follow the installation wizard
3. **IMPORTANT:** Check "Add LLVM to system PATH" during installation
4. Complete the installation

### Step 3: Verify Installation

Open a **NEW** PowerShell window and run:
```powershell
clang --version
opt --version
llc --version
```

If you see version information, LLVM is installed correctly!

---

## Method 2: Using WinGet (Windows Package Manager)

If you have Windows 10/11 with WinGet:

```powershell
winget install -e --id LLVM.LLVM
```

Then restart your terminal and verify:
```powershell
clang --version
```

---

## Method 3: Manual Installation

### Download Pre-built Binaries

1. Visit: https://releases.llvm.org/download.html
2. Download: **LLVM 17.0.6 Windows (64-bit)** pre-built binaries
3. Extract to: `C:\LLVM`

### Add to PATH Manually

```powershell
# Run PowerShell as Administrator
$env:Path += ";C:\Program Files\LLVM\bin"

# Make it permanent
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "Machine") + ";C:\Program Files\LLVM\bin",
    "Machine"
)
```

### Verify
```powershell
# Close and reopen PowerShell
clang --version
```

---

## Troubleshooting

### "clang not found" after installation

**Solution 1: Restart Terminal**
- Close all PowerShell/CMD windows
- Open a new terminal
- Try `clang --version` again

**Solution 2: Check PATH**
```powershell
$env:Path -split ';' | Select-String -Pattern "LLVM"
```

If nothing shows, add manually:
```powershell
$env:Path += ";C:\Program Files\LLVM\bin"
```

**Solution 3: Find LLVM Installation**
```powershell
Get-ChildItem "C:\Program Files" -Filter "clang.exe" -Recurse -ErrorAction SilentlyContinue
```

---

## Quick Test After Installation

Create `test.c`:
```c
#include <stdio.h>
int main() {
    printf("LLVM works!\n");
    return 0;
}
```

Compile and run:
```powershell
clang test.c -o test.exe
.\test.exe
```

Expected output: `LLVM works!`

---

## Next Steps

Once LLVM is installed:

1. **Test SPECTRE LLVM Integration:**
   ```powershell
   cd backend
   python llvm_obfuscator.py
   ```

2. **Start SPECTRE Server:**
   ```powershell
   python wsgi.py
   ```

3. **Check LLVM Status:**
   ```powershell
   curl http://localhost:5000/api/llvm/status
   ```

---

## Alternative: Use GCC for Now

If LLVM installation is taking time, you can still use SPECTRE with GCC:

1. Start server: `python backend/wsgi.py`
2. Open `frontend/pages/app.html`
3. Select **"GCC (Fast - Source Level)"** compiler
4. Continue obfuscating

You can add LLVM later for full SIH compliance.

---

**Need Help?** Check the full guide: `LLVM_INSTALLATION_GUIDE.md`
