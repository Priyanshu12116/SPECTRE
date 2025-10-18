# 🚀 How to Run SPECTRE

## Quick Start (3 Steps)

### Step 1: Start Backend Server
```bash
cd backend
python server.py
```

**You should see:**
```
Starting SPECTRE Backend Server on http://localhost:5000
Use Ctrl+C to stop the server
```

### Step 2: Open Frontend
**Navigate to:**
```
frontend/pages/index.html
```

**Double-click to open in browser** or right-click → "Open with Live Server"

### Step 3: Start Using SPECTRE
1. Click "Start Obfuscating" or "Tool" in navigation
2. Login with: `admin` / `123`
3. Upload your C/C++ file
4. Configure obfuscation settings
5. Click "Start Obfuscation"
6. Download results!

---

## 📁 File Locations

### Frontend Pages (Open These)
```
frontend/pages/
├── index.html      ← Landing page (START HERE)
├── app.html        ← Main application
├── login.html      ← Login page
└── features.html   ← Features showcase
```

### Backend Server
```
backend/
└── server.py       ← Run this first
```

### Examples to Test
```
examples/
├── simple_hello.c      ← Beginner
├── calculator.c        ← Intermediate
└── password_checker.c  ← Advanced
```

---


## ✅ Verification

### Check if Everything Works:

1. **Backend Running?**
   ```bash
   curl http://localhost:5000/api/status
   ```
   Should return: `{"status": "Server is running", ...}`

2. **Frontend Loading?**
   - Open `frontend/pages/index.html`
   - Should see green theme with SPECTRE logo
   - Navigation menu should work

3. **Styles Working?**
   - Check if page has colors and animations
   - Logo should be visible
   - Buttons should be styled

4. **JavaScript Working?**
   - 3D globe should render on homepage
   - Navigation should be interactive
   - Buttons should respond to clicks

---

## 🔧 Troubleshooting

### Issue: "Backend not responding"
**Solution:**
```bash
cd backend
python server.py
```
Wait for "Server is running" message

### Issue: "Styles or JavaScript not loading"
**Solution:**
- Check browser console for errors (F12)
- Verify files are in correct directories
- Ensure all dependencies are loaded

---

## 📊 Testing Workflow

### Test the Complete Flow:

1. **Start Backend**
   ```bash
   cd backend
   python server.py
   ```

2. **Open Frontend**
   - Navigate to `frontend/pages/`
   - Double-click `index.html`

3. **Navigate to Tool**
   - Click "Tool" in navigation
   - Or click "Start Obfuscating" button

4. **Login**
   - Username: `admin`
   - Password: `123`

5. **Upload Example**
   - Go to `examples/` folder
   - Upload `simple_hello.c`

6. **Configure**
   - Set level: 5 (Balanced)
   - Platform: Windows
   - Check all options

7. **Obfuscate**
   - Click "Start Obfuscation"
   - Watch progress bar
   - Wait for completion

8. **Download**
   - Download obfuscated code
   - Download report (JSON/HTML)
   - Review results

---

## 🎓 Example Session

```bash
# Terminal 1: Start Backend
cd backend
python server.py

# Browser: Open Frontend
# Navigate to: frontend/pages/index.html
# Click: "Start Obfuscating"
# Login: admin / 123
# Upload: examples/simple_hello.c
# Configure: Level 5, Windows
# Click: "Start Obfuscation"
# Wait: ~10 seconds
# Download: obfuscated_code.c + report.html
```

---

## 📚 Documentation

- **README.md** - Project overview
- **QUICK_REFERENCE.md** - Quick commands
- **LLVM_INSTALLATION_GUIDE.md** - LLVM setup
- **GCC_INSTALLATION_GUIDE.md** - GCC setup

---

## 🎉 Success Indicators

### You'll Know It's Working When:

✅ Backend console shows "Server is running"  
✅ Frontend loads with green/dark theme  
✅ SPECTRE logo appears in navbar  
✅ 3D graphics render (globe/shield)  
✅ File upload accepts .c files  
✅ Obfuscation completes successfully  
✅ Reports download correctly  

---

## 💡 Pro Tips

1. **Keep Backend Running** - Don't close the terminal
2. **Use Chrome/Edge** - Best compatibility
3. **Check Console** - F12 for debugging
4. **Test Examples First** - Use provided samples
5. **Read Reports** - Review security scores

---

**Ready to protect your code!** 🛡️
