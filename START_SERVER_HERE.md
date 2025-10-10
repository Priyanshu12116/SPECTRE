# 🚀 Start SPECTRE Server - Simple Instructions

## ⚡ Quick Start (Copy & Paste)

### Option 1: Double-Click Method (Easiest)

1. **Double-click:** `run_server.bat`
2. **Wait:** Server will start in ~3 seconds
3. **Keep window open:** Don't close the black window!
4. **Test:** Open `frontend/pages/app.html` in browser

---

### Option 2: PowerShell Method

**Copy and paste this entire block into PowerShell:**

```powershell
# Navigate to project
cd c:\Users\abhis\ProjectSIH\SPECTRE

# Activate venv
& .venv\Scripts\Activate.ps1

# Add LLVM to PATH
$env:Path += ";C:\Program Files\LLVM\bin"

# Start server (keep this window open!)
python start_server.py
```

**Important:** Keep the PowerShell window open while using SPECTRE!

---

### Option 3: CMD Method

**Copy and paste into Command Prompt:**

```cmd
cd c:\Users\abhis\ProjectSIH\SPECTRE
.venv\Scripts\activate.bat
set PATH=%PATH%;C:\Program Files\LLVM\bin
python start_server.py
```

---

## ✅ How to Know Server is Running

You should see:
```
============================================================
🚀 SPECTRE Backend Server
============================================================
Starting server on http://127.0.0.1:5000
Press Ctrl+C to stop
============================================================
 * Serving Flask app 'server'
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

**Server is ready when you see:** `Running on http://127.0.0.1:5000`

---

## 🧪 Test Server (In New Terminal)

Open a **NEW** PowerShell window and test:

```powershell
curl http://127.0.0.1:5000/api/llvm/status
```

**Expected Response:**
```json
{
  "llvm_available": true,
  "message": "LLVM toolchain is ready",
  "ready": true
}
```

---

## 🎯 Now Use SPECTRE

1. **Keep server running** (don't close the terminal!)
2. **Open:** `frontend/pages/app.html` (double-click)
3. **Upload:** `test_simple.c` or any C file
4. **Click:** "Start Obfuscation"
5. **Watch:** LLVM obfuscation in action!

---

## 🐛 Troubleshooting

### "Cannot connect to server"

**Solution:** Server is not running!
- Go back and start server using one of the methods above
- Keep the server terminal window open

### "LLVM not available"

**Solution:** LLVM not in PATH
```powershell
$env:Path += ";C:\Program Files\LLVM\bin"
clang --version  # Should show version 21.1.3
```
Then restart server.

### Port 5000 already in use

**Solution:** Kill existing process
```powershell
# Find process on port 5000
netstat -ano | findstr :5000

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F
```

---

## 📝 Quick Checklist

Before starting:
- [ ] Virtual environment exists (`.venv` folder)
- [ ] LLVM installed (`clang --version` works)
- [ ] No other process on port 5000

To start:
- [ ] Open terminal
- [ ] Navigate to project folder
- [ ] Activate virtual environment
- [ ] Add LLVM to PATH
- [ ] Run `python start_server.py`
- [ ] **Keep terminal open!**

To test:
- [ ] Server shows "Running on http://127.0.0.1:5000"
- [ ] Open new terminal and curl the status endpoint
- [ ] Open `app.html` in browser
- [ ] Try obfuscation

---

## 💡 Pro Tip

Create a shortcut:
1. Right-click `run_server.bat`
2. "Create shortcut"
3. Move shortcut to desktop
4. Double-click to start server anytime!

---

**Remember:** The server must stay running while you use SPECTRE!

---

*Quick Start Guide - 2025-10-10*
