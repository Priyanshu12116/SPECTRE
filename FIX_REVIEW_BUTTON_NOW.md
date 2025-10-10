# 🔧 Fix Review Button - Complete Guide

## ⚠️ Current Issue

The Review button shows "Cannot reach backend" because **the server is not running**.

---

## ✅ SOLUTION: Start the Server

### Step 1: Open a New Terminal

1. Open PowerShell or Command Prompt
2. Navigate to project directory:
   ```powershell
   cd c:\Users\abhis\ProjectSIH\SPECTRE
   ```

### Step 2: Activate Virtual Environment

```powershell
.venv\Scripts\Activate.ps1
```

You should see `(.venv)` in your prompt.

### Step 3: Start the Server

```powershell
python start_server.py
```

**Expected Output:**
```
✅ Added LLVM to PATH: C:\Program Files\LLVM\bin
============================================================
🚀 SPECTRE Backend Server
============================================================
Starting server on http://127.0.0.1:5000
Press Ctrl+C to stop
============================================================
 * Serving Flask app 'server'
 * Running on http://127.0.0.1:5000
```

### Step 4: Keep This Terminal Open

⚠️ **IMPORTANT:** Do NOT close this terminal! The server must keep running.

---

## 🧪 Test the Server

### Open Another Terminal and Test:

```powershell
curl http://127.0.0.1:5000/api/status
```

**Expected Response:**
```json
{"status": "Server is running", "timestamp": "..."}
```

### Test Review Endpoint:

```powershell
curl http://127.0.0.1:5000/api/review -X POST -H "Content-Type: application/json" -d "{\"code\":\"int main(){}\"}"
```

**Should return:** Code review response ✅

---

## 🌐 Test in Browser

### Step 1: Refresh Browser
```
Press: Ctrl + Shift + R (hard refresh)
```

### Step 2: Test Review Button
1. Open `frontend/pages/app.html`
2. Upload `test_simple.c`
3. Click "Review Code"
4. **Should work now!** ✅

### Step 3: Test All Features
1. **Review Code** - Should show code analysis ✅
2. **🛡️ Security Scan** - Should show security report ✅
3. **Start Obfuscation** - Should obfuscate code ✅

---

## 🐛 Troubleshooting

### Issue 1: "Port 5000 already in use"

**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Restart server
python start_server.py
```

### Issue 2: "Module not found"

**Solution:**
```powershell
# Make sure virtual environment is activated
.venv\Scripts\Activate.ps1

# Install dependencies
pip install flask flask-cors requests cryptography

# Restart server
python start_server.py
```

### Issue 3: "LLVM not found"

**Solution:**
```powershell
# Check if LLVM is installed
clang --version

# If not installed, follow LLVM_INSTALLATION_GUIDE.md
```

### Issue 4: Still getting "Failed to fetch"

**Solution:**
```powershell
# 1. Make sure server is running (check terminal)
# 2. Hard refresh browser (Ctrl + Shift + R)
# 3. Clear browser cache
# 4. Try in incognito/private mode
```

---

## 📋 Complete Checklist

### Before Testing:
- [ ] Virtual environment activated
- [ ] Server started with `python start_server.py`
- [ ] Server terminal shows "Running on http://127.0.0.1:5000"
- [ ] Server terminal is still open (not closed)

### Test Server:
- [ ] `curl http://127.0.0.1:5000/api/status` works
- [ ] Returns `{"status": "Server is running"}`

### Test Browser:
- [ ] Browser refreshed (Ctrl + Shift + R)
- [ ] File uploaded
- [ ] Review button clicked
- [ ] Code analysis appears

### Success Indicators:
- [ ] No "Failed to fetch" errors
- [ ] Review shows code analysis
- [ ] Security scan works
- [ ] Obfuscation works

---

## 🎯 Quick Start (Copy-Paste)

### Terminal 1 (Server):
```powershell
cd c:\Users\abhis\ProjectSIH\SPECTRE
.venv\Scripts\Activate.ps1
python start_server.py
```

### Terminal 2 (Test):
```powershell
curl http://127.0.0.1:5000/api/status
```

### Browser:
```
1. Ctrl + Shift + R (refresh)
2. Open: frontend/pages/app.html
3. Upload: test_simple.c
4. Click: "Review Code"
5. See: Code analysis ✅
```

---

## 💡 Pro Tips

### Keep Server Running:
- Don't close the server terminal
- If you need to stop: Press `Ctrl + C`
- To restart: Run `python start_server.py` again

### Multiple Features:
Once server is running, ALL features work:
- ✅ Review Code
- ✅ Security Scan
- ✅ Obfuscation
- ✅ All API endpoints

### For Development:
Keep server running in one terminal while working in another.

---

## 🚀 Expected Behavior (After Fix)

### Review Code Button:
1. Click "Review Code"
2. See: "Analyzing your code..."
3. Wait: 2-5 seconds
4. See: Complete code analysis with:
   - Syntax check results
   - Security review
   - Recommendations
   - Code quality score

### Security Scan Button:
1. Click "🛡️ Security Scan"
2. See: Security score (0-100)
3. See: Vulnerabilities list
4. See: Recommendations

### Obfuscation:
1. Click "Start Obfuscation"
2. See: Progress bar
3. See: LLVM working
4. See: Success message
5. Download: Obfuscated code

---

## ✅ Final Verification

### All Working:
```
✅ Server running on http://127.0.0.1:5000
✅ API status endpoint responding
✅ Review endpoint responding
✅ Security endpoint responding
✅ Obfuscation endpoint responding
✅ Browser can connect
✅ All buttons working
```

---

## 📞 Quick Commands Reference

```powershell
# Start server
cd c:\Users\abhis\ProjectSIH\SPECTRE
.venv\Scripts\Activate.ps1
python start_server.py

# Test server (in another terminal)
curl http://127.0.0.1:5000/api/status

# Stop server
# In server terminal: Ctrl + C

# Restart server
python start_server.py
```

---

## 🎉 Success!

Once the server is running:
- ✅ Review Code button will work
- ✅ Security Scan will work
- ✅ Obfuscation will work
- ✅ All features fully functional

**Just start the server and everything works!** 🚀

---

*Complete Fix Guide - 2025-10-10 23:00 IST*
*Status: Server must be running for all features to work*
*Action Required: Start server with `python start_server.py`*
