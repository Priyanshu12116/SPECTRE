# 🔧 Compile IR Feature - Debugging Guide

## ✅ **Backend Logic Fixed!**

I've improved the backend with:
- ✅ Better error handling
- ✅ More detailed logging
- ✅ Proper file management
- ✅ Timeout handling
- ✅ Tool detection

---

## 🚀 **How to Test**

### **Method 1: Quick Test with Script**

```cmd
# 1. Make sure server is running
cd C:\Users\abhis\ProjectSIH\SPECTRE
python start_server.py

# 2. In another terminal, run test script
python test_compile_endpoint.py
```

This will:
- ✅ Send a simple LLVM IR to the endpoint
- ✅ Show detailed output
- ✅ Save the executable as `test_output.exe`
- ✅ Tell you if it worked!

---

### **Method 2: Test via Web Interface**

```cmd
# 1. Start server
python start_server.py

# 2. Open browser
file:///C:/Users/abhis/ProjectSIH/SPECTRE/frontend/pages/compile.html

# 3. Upload a .ll file and try compiling
```

---

## 🔍 **Common Errors and Fixes**

### **Error: "Failed to fetch"**

**Cause:** Server not running or wrong URL

**Fix:**
```cmd
# Check if server is running
# You should see: "Running on http://127.0.0.1:5000"

# If not running:
cd C:\Users\abhis\ProjectSIH\SPECTRE
python start_server.py
```

**Verify server is accessible:**
```
Open in browser: http://127.0.0.1:5000/api/status
Should see: {"status": "Server is running", "timestamp": "..."}
```

---

### **Error: "No data provided"**

**Cause:** Request body is empty or not JSON

**Fix:**
- Check browser console (F12)
- Ensure file is being read correctly
- Verify Content-Type is `application/json`

**Debug in browser console:**
```javascript
// Check what's being sent
console.log(JSON.stringify({
    llvm_ir: fileContent,
    password: password,
    is_cpp: true
}));
```

---

### **Error: "Password must be at least 8 characters"**

**Cause:** Password too short

**Fix:**
- Use a password with 8+ characters
- Example: `test12345` or `MyPassword123`

---

### **Error: "Required compilation tools (clang/gcc) not found"**

**Cause:** LLVM/Clang or GCC not installed

**Fix:**
```cmd
# Check if tools are available
clang --version
gcc --version

# If not found, install MinGW or LLVM
```

**Install MinGW:**
- Download from: https://sourceforge.net/projects/mingw-w64/
- Add to PATH

---

### **Error: "Failed to compile LLVM IR to object file"**

**Cause:** Invalid LLVM IR or compilation error

**Check server console for details:**
```
INFO: Compiling LLVM IR to executable...
INFO: IR size: 1234 bytes
ERROR: <detailed error message>
```

**Fix:**
- Ensure .ll file is valid LLVM IR
- Check if it starts with `; ModuleID =`
- Try re-generating the .ll file

---

### **Error: "Failed to link executable"**

**Cause:** Linking error (missing libraries, wrong linker)

**Check:**
- Is it C or C++ code? (Select correct language)
- Are standard libraries available?
- Check server console for linker errors

**Fix:**
- Try switching between C and C++ in the dropdown
- Ensure g++/gcc is properly installed
- Check for missing dependencies

---

### **Error: "Compilation timeout"**

**Cause:** Compilation took > 30 seconds

**Fix:**
- File might be too large
- System might be slow
- Increase timeout in `server.py` if needed

---

## 📊 **What to Check in Server Console**

When you compile, you should see:

```
INFO: Compiling LLVM IR to executable...
INFO: IR size: 1234 bytes
INFO: Language: C++
INFO: Temp directory: C:\Users\...\Temp\spectre_compile_abc123
INFO: LLVM IR saved to: C:\Users\...\Temp\spectre_compile_abc123\input.ll
INFO: Object file created: C:\Users\...\Temp\spectre_compile_abc123\output.o
INFO: Executable created: C:\Users\...\Temp\spectre_compile_abc123\output.exe
INFO: Executable size: 12345 bytes
INFO: Copied to persistent location: C:\Users\...\Temp\spectre_output_1234.exe
```

**If you see errors instead:**
- Read the error message carefully
- Check which step failed
- Look for tool-specific errors (clang, gcc, llc)

---

## 🎯 **Step-by-Step Debugging**

### **Step 1: Verify Server is Running**

```cmd
# Terminal should show:
Starting SPECTRE Backend Server on http://localhost:5000
Use Ctrl+C to stop the server
 * Serving Flask app 'server'
 * Running on http://127.0.0.1:5000
```

### **Step 2: Test Server Status**

```cmd
# In browser or curl:
http://127.0.0.1:5000/api/status

# Should return:
{"status": "Server is running", "timestamp": "2025-01-14T21:50:00"}
```

### **Step 3: Test with Simple LLVM IR**

```cmd
python test_compile_endpoint.py
```

**Expected output:**
```
================================================================================
Testing /api/llvm/compile endpoint
================================================================================
URL: http://127.0.0.1:5000/api/llvm/compile
Payload size: 1234 bytes
LLVM IR size: 567 bytes

Sending request...
Status Code: 200
Response size: 12345 bytes
✅ SUCCESS!
✅ Executable saved to: test_output.exe

You can now run it:
  test_output.exe
```

### **Step 4: Run the Test Executable**

```cmd
test_output.exe

# Should print:
Hello World!
```

### **Step 5: Test via Web Interface**

1. Open `compile.html`
2. Upload a `.ll` file
3. Enter password (8+ chars)
4. Click "Compile"
5. Check browser console (F12) for errors
6. Check server console for logs

---

## 🛠️ **Advanced Debugging**

### **Enable Verbose Logging**

In `server.py`, the endpoint already has detailed logging. Check the terminal for:
- Request details
- File paths
- Command outputs
- Error traces

### **Check Browser Network Tab**

1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Try compiling
4. Look for the `/api/llvm/compile` request
5. Check:
   - Request payload
   - Response status
   - Response body
   - Timing

### **Manual Test with curl**

```cmd
curl -X POST http://127.0.0.1:5000/api/llvm/compile ^
  -H "Content-Type: application/json" ^
  -d "{\"llvm_ir\": \"; test\", \"password\": \"test12345\", \"is_cpp\": true}" ^
  --output test.exe
```

---

## 📋 **Checklist Before Reporting Issues**

- [ ] Server is running (`python start_server.py`)
- [ ] Server shows "Running on http://127.0.0.1:5000"
- [ ] `/api/status` endpoint works
- [ ] Test script (`test_compile_endpoint.py`) passes
- [ ] LLVM/Clang or GCC is installed
- [ ] `.ll` file is valid LLVM IR
- [ ] Password is 8+ characters
- [ ] Browser console shows no errors
- [ ] Server console shows detailed logs

---

## 🎉 **Success Indicators**

✅ **Server Console:**
```
INFO: Compiling LLVM IR to executable...
INFO: Executable created: ...
INFO: Executable size: 12345 bytes
```

✅ **Browser:**
```
Status: Compilation successful! Executable downloaded.
```

✅ **File System:**
- `.exe` file downloaded to Downloads folder
- File size > 0 bytes
- File runs without errors

---

## 📞 **Still Having Issues?**

1. **Run the test script:**
   ```cmd
   python test_compile_endpoint.py
   ```

2. **Check server console** for detailed error messages

3. **Check browser console** (F12) for JavaScript errors

4. **Verify tools are installed:**
   ```cmd
   clang --version
   gcc --version
   llc --version
   ```

5. **Try a simple test:**
   - Use the provided test LLVM IR
   - Use a simple password like `test12345`
   - Check if it works

---

**The backend logic is now robust and should work! Try the test script first!** 🚀
