# 🔧 Troubleshooting File Upload

## 🎯 Common Issues & Solutions

### Issue 1: File Doesn't Show After Upload

**Symptoms:**
- Click "Browse" or drag file
- Nothing appears in file list
- No error message

**Solutions:**

1. **Check Browser Console**
   - Press `F12` in browser
   - Click "Console" tab
   - Look for any red errors
   - Share the error message

2. **Try Different File**
   - Use `test_upload.c` (I just created it in project root)
   - Or use `test_simple.c`
   - Make sure it's a `.c` file

3. **Hard Refresh Browser**
   - Press `Ctrl + Shift + R`
   - This clears cache

---

### Issue 2: "Start Obfuscation" Button Not Working

**Symptoms:**
- File uploaded successfully
- Click button but nothing happens

**Solutions:**

1. **Check if Server is Running**
   ```powershell
   curl http://127.0.0.1:5000/api/status
   ```
   Should return: `"status": "Server is running"`

2. **Check Browser Console**
   - Press `F12`
   - Look for errors
   - Common: "Failed to fetch" = Server not running

3. **Restart Server**
   - Stop: `Ctrl + C`
   - Start: `python start_server.py`
   - Look for: `✅ Added LLVM to PATH`

---

### Issue 3: Error 500 During Obfuscation

**Symptoms:**
- Obfuscation starts
- Shows progress
- Then: `[ERROR] Error: Server error: 500`

**Solution:**
- **Server needs restart with LLVM PATH fix**
- Stop server: `Ctrl + C`
- Restart: `python start_server.py`
- Must see: `✅ Added LLVM to PATH: C:\Program Files\LLVM\bin`

---

## 🧪 Step-by-Step Test

### Test 1: Check Server

```powershell
curl http://127.0.0.1:5000/api/llvm/status
```

**Expected:**
```json
{
  "llvm_available": true,
  "message": "LLVM toolchain is ready"
}
```

**If fails:** Server not running or needs restart

---

### Test 2: Check File Upload

1. Open `app.html` in browser
2. Click the upload area or "Browse"
3. Select `test_upload.c`
4. **Should see:** File name and size appear below upload area

**If doesn't appear:**
- Open browser console (F12)
- Look for JavaScript errors
- Make sure `script.js` is loading

---

### Test 3: Check Obfuscation

1. File uploaded ✅
2. Click "Start Obfuscation"
3. **Should see in logs:**
   ```
   [INFO] Starting obfuscation process...
   [INFO] Compiler: LLVM | Platform: windows | Level: 5
   [INFO] Checking LLVM toolchain...
   [SUCCESS] ✅ LLVM toolchain ready
   ```

**If stops at "LLVM toolchain ready":**
- Server needs restart
- Must have LLVM in PATH

---

## 🎯 Complete Checklist

### Before Testing:
- [ ] Server is running
- [ ] Server shows: `✅ Added LLVM to PATH`
- [ ] Browser is open to `app.html`
- [ ] Test file ready (`test_upload.c`)

### During Test:
- [ ] File uploads and shows in list
- [ ] "Start Obfuscation" button is clickable
- [ ] Progress bar starts moving
- [ ] Logs show in real-time

### Success Indicators:
- [ ] No red errors in browser console
- [ ] Progress reaches 100%
- [ ] Shows: `✅ Obfuscation complete!`
- [ ] Shows: `🔧 Method: LLVM IR Transformation`
- [ ] Shows: `✅ SIH Compliant`

---

## 🐛 Debug Mode

### Enable Detailed Logging

Add this to browser console (F12):
```javascript
localStorage.setItem('debug', 'true');
location.reload();
```

### Check Network Requests

1. Press `F12`
2. Click "Network" tab
3. Click "Start Obfuscation"
4. Look for request to `/api/obfuscate/llvm`
5. Click on it to see:
   - Request payload
   - Response
   - Status code

---

## 📊 What Should Happen (Step by Step)

### 1. Upload File
```
User clicks upload → File dialog opens → User selects .c file
→ File appears in list with name and size
```

### 2. Start Obfuscation
```
User clicks "Start Obfuscation" → JavaScript reads file
→ Sends to server → Server compiles with LLVM
→ Returns result → Shows in UI
```

### 3. Success
```
Progress bar: 100%
Logs show: ✅ Obfuscation complete!
Download buttons appear
```

---

## 🆘 Quick Fixes

### Fix 1: Server Not Responding
```powershell
# Kill any Python processes
Get-Process python | Stop-Process -Force

# Restart server
cd c:\Users\abhis\ProjectSIH\SPECTRE
& .venv\Scripts\Activate.ps1
python start_server.py
```

### Fix 2: Browser Cache Issues
```
Press: Ctrl + Shift + Delete
Select: Cached images and files
Click: Clear data
Reload: F5
```

### Fix 3: JavaScript Not Loading
```
1. Open app.html
2. Press F12
3. Go to "Sources" tab
4. Check if script.js is listed
5. If not, check file path in app.html
```

---

## 📞 What to Share If Still Not Working

1. **Browser Console Errors**
   - Press F12 → Console tab
   - Copy any red errors

2. **Server Terminal Output**
   - Copy the last 20 lines from server

3. **Network Tab**
   - F12 → Network tab
   - Try obfuscation
   - Screenshot the failed request

4. **What Happens**
   - Does file upload show?
   - Does button click do anything?
   - Where does it stop?

---

## ✅ Known Working Configuration

```
Server: Running on 127.0.0.1:5000
LLVM: Version 21.1.3 in PATH
Browser: Chrome/Edge (latest)
File: test_upload.c (provided)
Expected time: 3-5 seconds
Expected result: SUCCESS with object file size
```

---

*Troubleshooting Guide - 2025-10-10 21:40 IST*
