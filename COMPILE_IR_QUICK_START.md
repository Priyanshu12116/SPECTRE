# 🚀 Compile IR - Quick Start Guide

## ✅ **Fixed!**

The compile.html page now has proper CSS files linked and should work correctly.

---

## 🎯 **How to Test It**

### **Step 1: Restart the Server**

```cmd
# Stop the current server (Ctrl+C in the terminal)
cd C:\Users\abhis\ProjectSIH\SPECTRE
python start_server.py
```

### **Step 2: Open the Compile Page**

**Option A - Direct File Access:**
```
file:///C:/Users/abhis/ProjectSIH/SPECTRE/frontend/pages/compile.html
```

**Option B - Through Navigation:**
1. Open `index.html`
2. Click "Tool" in navigation
3. Click "Compile IR" in navigation

### **Step 3: Test the Feature**

1. **Get a .ll file:**
   - Use LLVM obfuscation in the Tool page
   - Download the obfuscated code (it will now have .ll extension)

2. **Upload the .ll file:**
   - Drag and drop onto the upload area
   - Or click to browse

3. **Enter password:**
   - Use the same Code Vault password from obfuscation

4. **Click "Compile to Executable"**
   - Wait 5-10 seconds
   - The .exe will download automatically!

---

## 📋 **What Was Fixed**

### **CSS Files Added:**
```html
<!-- Before (missing) -->
<link rel="stylesheet" href="../css/styles.css">

<!-- After (correct) -->
<link rel="stylesheet" href="../css/style-home.css">
<link rel="stylesheet" href="../css/style.css">
<link rel="stylesheet" href="../css/nav-profile.css">
```

### **Navigation Structure:**
- Changed from `<nav class="navbar">` to `<nav>` (matches other pages)
- Added background canvas (`matrix-bg`)
- Added proper auth container

### **Scripts Added:**
- `home.js` - For background animation
- `auth.js` - For authentication handling

---

## 🎨 **What You Should See**

### **Visual Elements:**
- ✅ Animated matrix background
- ✅ Proper navigation bar with logo
- ✅ Gradient title "Compile LLVM IR"
- ✅ Drag-and-drop upload area
- ✅ Password input field
- ✅ Language selector (C++ / C)
- ✅ Compile button
- ✅ Info box with instructions

### **Functionality:**
- ✅ File drag-and-drop works
- ✅ File browse works
- ✅ Shows file info after upload
- ✅ Password validation
- ✅ Compile button enabled after file upload
- ✅ Status messages (success/error)
- ✅ Automatic .exe download

---

## 🔧 **Complete Test Workflow**

### **Test 1: Basic Compilation**

```
1. Open Tool page (app.html)
2. Paste this simple C++ code:
   
   #include <iostream>
   int main() {
       std::cout << "Hello from SPECTRE!" << std::endl;
       return 0;
   }

3. Select "LLVM" obfuscation
4. Enter password: "test12345"
5. Click "Obfuscate Code"
6. Download the .ll file (should now have .ll extension!)
7. Go to "Compile IR" page
8. Upload the .ll file
9. Enter password: "test12345"
10. Click "Compile to Executable"
11. Download should start automatically
12. Run the .exe - should print "Hello from SPECTRE!"
```

### **Test 2: Wrong Password**

```
1. Upload a .ll file
2. Enter wrong password: "wrongpass"
3. Click "Compile"
4. Should show error: "Invalid Code Vault password"
```

### **Test 3: Invalid File**

```
1. Try to upload a .cpp or .txt file
2. Should show error: "Please select a valid .ll file"
```

---

## ⚠️ **Troubleshooting**

### **Page looks broken / no styling**

**Check:**
- CSS files exist in `frontend/css/` folder
- File paths are correct
- Browser console for errors (F12)

**Fix:**
- Hard refresh: Ctrl + Shift + R
- Clear browser cache

### **Background animation not working**

**Check:**
- `home.js` is loaded
- Console for JavaScript errors

**Fix:**
- Ensure `home.js` exists in `frontend/js/`
- Check script path is correct

### **Upload not working**

**Check:**
- File is .ll extension
- File size not too large (< 50 MB)

**Fix:**
- Try clicking instead of drag-drop
- Check browser console for errors

### **Compilation fails**

**Check:**
- Server is running
- Password is correct
- LLVM/Clang is installed

**Fix:**
- Check server console for errors
- Verify password matches obfuscation password
- Ensure g++ is available as fallback

---

## 📊 **Expected Behavior**

| Action | Expected Result |
|--------|----------------|
| Open page | See animated background, navigation, upload area |
| Drag .ll file | Upload area highlights, file info shows |
| Enter password | Input accepts text |
| Click compile | Button shows "Compiling...", then download starts |
| Download .exe | File saves to Downloads folder |
| Run .exe | Program executes correctly |

---

## 🎉 **Success Criteria**

✅ Page loads with proper styling  
✅ Navigation works  
✅ File upload works (drag-drop and browse)  
✅ Password input works  
✅ Compile button becomes enabled after file upload  
✅ Compilation succeeds with correct password  
✅ .exe downloads automatically  
✅ .exe runs and produces correct output  

---

## 📝 **Next Steps**

After testing:

1. **If everything works:**
   - ✅ Feature is ready to use!
   - Share with users
   - Update main documentation

2. **If issues found:**
   - Check server console for errors
   - Check browser console (F12)
   - Verify file paths
   - Ensure LLVM tools are installed

---

**Ready to test! Open the page and try it out!** 🚀
