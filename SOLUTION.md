# ✅ SOLUTION: "Cannot connect to server" Error

## 🎯 The Problem

The error `"Cannot connect to server"` means the Flask server is not running.

## ✅ The Solution

**You need to start the server in a separate terminal and KEEP IT RUNNING.**

---

## 🚀 Step-by-Step Solution

### Step 1: Open PowerShell

Press `Win + X` → Select "Windows PowerShell"

### Step 2: Copy & Paste This

```powershell
cd c:\Users\abhis\ProjectSIH\SPECTRE
& .venv\Scripts\Activate.ps1
$env:Path += ";C:\Program Files\LLVM\bin"
python start_server.py
```

### Step 3: Wait for Server to Start

You'll see:
```
============================================================
🚀 SPECTRE Backend Server
============================================================
Starting server on http://127.0.0.1:5000
Press Ctrl+C to stop
============================================================
 * Running on http://127.0.0.1:5000
```

### Step 4: **KEEP THIS WINDOW OPEN!**

⚠️ **IMPORTANT:** Do NOT close this PowerShell window!

### Step 5: Open Frontend

In File Explorer:
1. Navigate to: `c:\Users\abhis\ProjectSIH\SPECTRE\frontend\pages`
2. Double-click: `app.html`
3. Browser will open with SPECTRE

### Step 6: Test Obfuscation

1. Upload `test_simple.c`
2. Click "Start Obfuscation"
3. Should work now! ✅

---

## 🎬 Alternative: Use Batch File

### Easiest Method:

1. **Double-click:** `run_server.bat` (in project root)
2. **Keep window open**
3. **Open:** `app.html` in browser
4. **Done!**

---

## 🧪 Verify Server is Running

Open a **NEW** PowerShell window (keep server running in first one):

```powershell
curl http://127.0.0.1:5000/api/status
```

**Should return:** `"status": "Server is running"`

---

## 📊 Visual Guide

```
Terminal 1 (Server)          Browser (Frontend)
┌─────────────────┐         ┌──────────────────┐
│ $ python        │         │  SPECTRE         │
│   start_server  │ ◄─────► │  Upload file     │
│                 │         │  Obfuscate       │
│ Server running  │         │  Download result │
│ Port: 5000      │         └──────────────────┘
│                 │
│ KEEP OPEN! ⚠️   │
└─────────────────┘
```

---

## ❌ Common Mistakes

### Mistake 1: Closing Server Window
**Problem:** Server stops when you close the terminal  
**Solution:** Keep the server terminal open!

### Mistake 2: Not Activating Virtual Environment
**Problem:** Python can't find Flask  
**Solution:** Run `& .venv\Scripts\Activate.ps1` first

### Mistake 3: LLVM Not in PATH
**Problem:** Server can't find clang  
**Solution:** Run `$env:Path += ";C:\Program Files\LLVM\bin"`

---

## 🎯 Quick Test Script

Save this as `test_server.ps1` and run it:

```powershell
Write-Host "Testing SPECTRE Server..." -ForegroundColor Green

# Test if server is running
try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/status" -TimeoutSec 2
    Write-Host "✅ Server is running!" -ForegroundColor Green
    Write-Host "Response: $($response.status)" -ForegroundColor Cyan
    
    # Test LLVM status
    $llvm = Invoke-RestMethod -Uri "http://127.0.0.1:5000/api/llvm/status"
    if ($llvm.llvm_available) {
        Write-Host "✅ LLVM is available!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ LLVM not available" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Server is NOT running!" -ForegroundColor Red
    Write-Host "Please start the server first:" -ForegroundColor Yellow
    Write-Host "  1. Open PowerShell" -ForegroundColor Cyan
    Write-Host "  2. cd c:\Users\abhis\ProjectSIH\SPECTRE" -ForegroundColor Cyan
    Write-Host "  3. & .venv\Scripts\Activate.ps1" -ForegroundColor Cyan
    Write-Host "  4. python start_server.py" -ForegroundColor Cyan
}
```

---

## 📋 Complete Checklist

### Before Starting:
- [ ] Virtual environment exists
- [ ] LLVM installed
- [ ] Port 5000 is free

### To Start Server:
- [ ] Open PowerShell
- [ ] Navigate to project
- [ ] Activate venv
- [ ] Add LLVM to PATH
- [ ] Run start_server.py
- [ ] **Keep terminal open!** ⚠️

### To Use SPECTRE:
- [ ] Server running (check above)
- [ ] Open app.html in browser
- [ ] Upload C file
- [ ] Start obfuscation
- [ ] Download result

---

## 🎉 Success Indicators

### Server Terminal Shows:
```
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

### Browser Shows:
```
[INFO] Starting obfuscation process...
[INFO] Compiler: LLVM | Platform: windows | Level: 5
[INFO] Checking LLVM toolchain...
[SUCCESS] ✅ LLVM toolchain ready
```

---

## 🆘 Still Not Working?

### Try This:

1. **Kill any existing Python processes:**
   ```powershell
   Get-Process python | Stop-Process -Force
   ```

2. **Check port 5000:**
   ```powershell
   netstat -ano | findstr :5000
   ```
   If something is there, kill it:
   ```powershell
   taskkill /PID <PID> /F
   ```

3. **Restart from scratch:**
   ```powershell
   cd c:\Users\abhis\ProjectSIH\SPECTRE
   & .venv\Scripts\Activate.ps1
   $env:Path += ";C:\Program Files\LLVM\bin"
   python start_server.py
   ```

4. **Hard refresh browser:**
   Press `Ctrl + Shift + R` in browser

---

## 📞 Need Help?

Check these files:
- `START_SERVER_HERE.md` - Detailed instructions
- `FIXES_APPLIED.md` - What was fixed
- `READY_FOR_DEMO.md` - Complete guide

---

**Bottom Line:** Start the server, keep it running, then use the frontend!

---

*Solution Guide - 2025-10-10 21:30 IST*
