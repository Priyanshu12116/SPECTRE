# 🚀 START HERE - Quick Setup Guide

## ⚡ **Quick Start (2 Steps)**

### **Step 1: Start the Backend Server**

```cmd
cd C:\Users\abhis\ProjectSIH\SPECTRE
python start_server.py
```

**Wait for this message:**
```
Starting SPECTRE Backend Server on http://localhost:5000
 * Running on http://127.0.0.1:5000
```

✅ **Keep this terminal window open!** Don't close it.

---

### **Step 2: Open the Web Interface**

**Option A - Direct File:**
```
file:///C:/Users/abhis/ProjectSIH/SPECTRE/frontend/pages/index.html
```

**Option B - Double-click:**
- Navigate to: `C:\Users\abhis\ProjectSIH\SPECTRE\frontend\pages\`
- Double-click `index.html`

---

## 🎯 **Test the Compile IR Feature**

### **Step 1: Create a Test .ll File**

1. Go to **Tool** page (app.html)
2. Paste this simple code:
   ```cpp
   #include <iostream>
   int main() {
       std::cout << "Hello SPECTRE!" << std::endl;
       return 0;
   }
   ```
3. Select **LLVM** obfuscation
4. Enter password: `test12345`
5. Click **"Obfuscate Code"**
6. Download the file (it will now have `.ll` extension!)

### **Step 2: Compile the .ll File**

1. Go to **Compile IR** page
2. Upload the `.ll` file you just downloaded
3. Enter password: `test12345`
4. Select language: **C++**
5. Click **"Compile to Executable"**
6. The `.exe` will download automatically!

### **Step 3: Run the Executable**

```cmd
cd Downloads
obfuscated_program.exe
```

Should print: `Hello SPECTRE!`

---

## ⚠️ **Troubleshooting**

### **"Failed to fetch" Error**

This means the server isn't running!

**Fix:**
```cmd
# Check if server is running
# You should see a terminal with:
# "Running on http://127.0.0.1:5000"

# If not, start it:
cd C:\Users\abhis\ProjectSIH\SPECTRE
python start_server.py
```

**Test if server is working:**
```
Open browser: http://127.0.0.1:5000/api/status
Should see: {"status": "Server is running", ...}
```

---

### **Server Won't Start**

**Error: "Port already in use"**
```cmd
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill it (replace <PID> with the number from above)
taskkill /PID <PID> /F

# Try starting server again
python start_server.py
```

**Error: "Module not found"**
```cmd
# Install requirements
pip install -r requirements.txt
```

---

### **Page Looks Broken / No Styling**

**Fix:**
- Hard refresh: `Ctrl + Shift + R`
- Clear browser cache
- Make sure CSS files exist in `frontend/css/`

---

## 📋 **Complete Workflow**

```
1. Start server
   └─> python start_server.py
   
2. Open web interface
   └─> frontend/pages/index.html
   
3. Obfuscate code (Tool page)
   └─> Select LLVM
   └─> Enter password
   └─> Download .ll file
   
4. Compile .ll file (Compile IR page)
   └─> Upload .ll file
   └─> Enter same password
   └─> Download .exe
   
5. Run the executable
   └─> Double-click or run from terminal
```

---

## ✅ **Checklist**

Before using the Compile IR feature:

- [ ] Server is running (`python start_server.py`)
- [ ] Terminal shows "Running on http://127.0.0.1:5000"
- [ ] http://127.0.0.1:5000/api/status works in browser
- [ ] Web interface opens (index.html)
- [ ] You have a .ll file to compile
- [ ] You know the Code Vault password used during obfuscation

---

## 🎉 **You're Ready!**

Everything is set up! Now you can:

✅ **Obfuscate code** with LLVM (strongest protection)  
✅ **Download .ll files** (correct extension)  
✅ **Compile .ll to .exe** via web interface  
✅ **Distribute to users** who can compile with password  

---

## 📞 **Quick Help**

| Issue | Solution |
|-------|----------|
| "Failed to fetch" | Start server: `python start_server.py` |
| Port 5000 in use | Kill process: `netstat -ano \| findstr :5000` |
| Module not found | Install: `pip install -r requirements.txt` |
| Page broken | Hard refresh: `Ctrl + Shift + R` |
| Compilation fails | Check server console for errors |

---

**Start with Step 1 above and you'll be up and running in 30 seconds!** 🚀
