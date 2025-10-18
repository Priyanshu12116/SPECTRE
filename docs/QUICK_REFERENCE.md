# SPECTRE - Quick Reference Card

## 🚀 Quick Start

### Run SPECTRE
```bash
# Start backend
cd backend
python wsgi.py

# Open frontend
# Double-click: frontend/pages/index.html
```

### Test Obfuscation
```bash
# Use example files
examples/simple_hello.c
examples/calculator.c
examples/password_checker.c
```

---

## 📁 Key Files

### Implementation
- `backend/server.py` - Main API
- `backend/advanced_obfuscator.py` - Current obfuscator
- `backend/llvm_obfuscator.py` - **TO CREATE**

### Documentation
- `README.md` - Main docs
- `HOW_TO_RUN.md` - Usage guide
- `LLVM_INSTALLATION_GUIDE.md` - LLVM setup
- `GCC_INSTALLATION_GUIDE.md` - GCC setup

### Frontend
- `frontend/pages/app.html` - Main UI
- `frontend/js/script.js` - Logic

---

## 📊 Obfuscation Techniques

1. AES-256 string encryption
2. Control flow flattening
3. Bogus control flow
4. Constant encoding
5. Variable renaming
6. Anti-debugging
7. VM detection
8. Opaque predicates
9. Data scrambling
10. Runtime deobfuscation

---

## 📞 Resources

### Documentation
- All docs in project root
- See `README.md` for overview

### LLVM Resources
- Install: https://releases.llvm.org/
- Docs: https://llvm.org/docs/

---

## ⚡ Commands Cheat Sheet

### Start Server
```bash
python backend/wsgi.py
```

### Test LLVM (Once installed)
```bash
clang -S -emit-llvm test.c -o test.ll
llc -filetype=obj test.ll -o test.o
clang test.o -o test.exe
```

### Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

---

*Quick Reference for SPECTRE Code Obfuscator*
