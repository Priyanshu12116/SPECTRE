# 🚀 START HERE - Quick Launch Guide

## ✅ Everything is Ready!

Your SPECTRE platform is fully configured. Follow these simple steps:

---

## 🎯 **How to Start SPECTRE (2 Steps)**

### **Step 1: Start Backend Server**

**Option A - Double-click this file:**
```
start_backend.bat
```

**Option B - Run PowerShell script:**
```powershell
.\start_backend.ps1
```

**Option C - Manual (Production Server):**
```bash
cd backend
python wsgi.py
```

**Option D - Development Server:**
```bash
cd backend
python server.py
```

**✅ You should see:**
```
🚀 SPECTRE Backend - Production Server
Server: Waitress (Production WSGI)
Host: 127.0.0.1
Port: 5000
URL: http://127.0.0.1:5000
Press Ctrl+C to stop the server
```

### **Step 2: Open Frontend**

**Double-click this file:**
```
frontend/pages/index.html
```

Or navigate to:
```
frontend/pages/app.html
```

---

## 🎮 **Using SPECTRE**

### 1. **Login**
- Username: `admin`
- Password: `123`

### 2. **Upload Code**
Try one of the examples:
- `examples/simple_hello.c` (Beginner)
- `examples/calculator.c` (Intermediate)
- `examples/password_checker.c` (Advanced)

### 3. **Configure**
- **Obfuscation Level:** 1-10 (5 is balanced)
- **Platform:** Windows or Linux
- **Methods:** Check all for maximum protection

### 4. **Obfuscate**
Click "Start Obfuscation" and wait ~10-20 seconds

### 5. **Download**
- Obfuscated code (.c file)
- Report (JSON or HTML)

---

## ✅ **What's Working**

| Feature | Status |
|---------|--------|
| Backend Server | ✅ Running |
| GCC Compiler | ✅ Installed |
| Code Obfuscation | ✅ Working |
| Verification | ✅ Enabled |
| Code Vault | ✅ Enabled |
| Security Scoring | ✅ Working |
| All 10+ Techniques | ✅ Active |

---

## 🔧 **If Something Doesn't Work**

### Backend Won't Start?
```bash
# Check if Python is installed
python --version

# Install dependencies
cd backend
pip install -r requirements.txt
```

### GCC Not Found?
```bash
# Check GCC
gcc --version

# If not found, run setup again
.\setup_gcc_path.ps1
```

### Frontend Not Loading?
- Make sure you're opening files from `frontend/pages/`
- Check browser console (F12) for errors
- Try a different browser (Chrome/Edge)

### Verification Fails?
1. Make sure backend is running
2. Check GCC with `gcc --version`
3. Use the startup scripts (they add GCC to PATH)

---

## 📊 **Expected Results**

### After Obfuscation:
```
✅ Obfuscation complete!
Status: SUCCESS
Strings encrypted: 2
Bogus code lines: 6
Control flow changes: 2
Obfuscation cycles: 2
✅ Verification: Output matches original
🛡️ Security Score: 65/100
```

### Downloads Available:
- `obfuscated_code.c` - Protected code
- `obfuscation_report.json` - Detailed metrics
- `obfuscation_report.html` - Beautiful report

---

## 📚 **Documentation**

- **SETUP_COMPLETE.md** - Complete setup guide
- **HOW_TO_RUN.md** - Detailed usage instructions
- **QUICK_START.md** - 5-minute getting started
- **ADVANCED_OBFUSCATION_GUIDE.md** - Technical details
- **GCC_INSTALLATION_GUIDE.md** - GCC setup help

---

## 🎯 **Quick Test**

### Test 1: Backend
```bash
curl http://localhost:5000/api/status
```
Should return: `{"status":"Server is running"}`

### Test 2: GCC
```bash
gcc --version
```
Should show: `gcc.exe (tdm64-1) 10.3.0`

### Test 3: Compilation
```bash
cd examples
gcc simple_hello.c -o test.exe
test.exe
```
Should print: `Hello from SPECTRE!`

---

## 🎉 **You're Ready!**

### Start Now:
1. ✅ Run `start_backend.bat`
2. ✅ Open `frontend/pages/index.html`
3. ✅ Login and start obfuscating!

### Features Available:
- ✅ 10+ obfuscation techniques
- ✅ Automatic verification
- ✅ Code vault protection
- ✅ Security scoring
- ✅ Cross-platform support
- ✅ Comprehensive reporting

---

## 💡 **Pro Tips**

1. **Always start backend first** before opening frontend
2. **Use startup scripts** - they handle GCC PATH automatically
3. **Start with examples** - test with provided samples first
4. **Check security scores** - aim for 60+ for production
5. **Read reports** - they show what was protected

---

## 🆘 **Need Help?**

1. Check **SETUP_COMPLETE.md** for troubleshooting
2. Review **HOW_TO_RUN.md** for detailed steps
3. Read **GCC_INSTALLATION_GUIDE.md** if GCC issues
4. Check backend terminal for error messages
5. Check browser console (F12) for frontend errors

---

## 📞 **Quick Commands**

```bash
# Start backend (with GCC)
.\start_backend.bat

# Check status
curl http://localhost:5000/api/status

# Test GCC
gcc --version

# Test compilation
gcc examples/simple_hello.c -o test.exe
```

---

**🎉 SPECTRE is ready for Smart India Hackathon 2025!**

*Your complete code obfuscation platform with enterprise-grade protection.*

---

## 🏆 **Success Checklist**

- [ ] Backend running (`start_backend.bat`)
- [ ] Frontend opened (`frontend/pages/index.html`)
- [ ] Logged in (admin/123)
- [ ] Example uploaded
- [ ] Obfuscation completed
- [ ] Verification passed
- [ ] Files downloaded
- [ ] Reports reviewed

**All checked? You're a SPECTRE expert!** 🛡️
