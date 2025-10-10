# SPECTRE Code Review System

## Overview
The SPECTRE platform includes a comprehensive code analysis system that checks uploaded C/C++ code for **syntax errors** and **security vulnerabilities**.

## Features

### 🔍 Syntax Analysis
- Balanced braces, brackets, parentheses
- Missing semicolons
- Unclosed strings and comments
- Missing main() function

### 🔒 Security Analysis
- Buffer overflow vulnerabilities
- Command injection risks
- Memory leaks
- Unsafe function usage

## Quick Start

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 2. (Optional) Set API Key
```bash
# Windows
set HUGGINGFACE_API_KEY=your_key_here

# Linux/Mac
export HUGGINGFACE_API_KEY=your_key_here
```

**Note:** The system uses a built-in rule-based analyzer, so the API key is optional.

### 3. Start Backend Server
```bash
# Windows
python backend\server.py

# Linux/Mac
python backend/server.py
```

Server will start on `http://localhost:5000`

### 4. Use the Frontend
1. Open `app.html` in your browser
2. Upload a C/C++ file
3. Click "Review Code" button
4. View comprehensive analysis report

## Example Report

```
# 📋 SPECTRE Code Analysis Report

---

## 🔍 Syntax Analysis

**Status:** ✅ PASSED - No syntax errors detected

---

## 🔒 Security Analysis

Found 2 potential issue(s):

1. ⚠️ gets() detected: Buffer overflow vulnerability
2. ℹ️ Fixed-size buffer detected - ensure bounds checking

**Recommendations:**
- Review and fix the issues above
- Use compiler warnings (-Wall -Wextra)
- Consider using static analysis tools
```

## Security Note

⚠️ **Never commit API keys to the repository!**
- Use environment variables
- Use `.env` files (which are gitignored)
- Never hardcode sensitive credentials

## Files

- `backend/server.py` - Flask backend with syntax & security analysis
- `backend/requirements.txt` - Python dependencies
- `script.js` - Frontend code review integration
- `app.html` - Main application UI
- `.env.example` - Example environment configuration
- `.gitignore` - Git ignore rules

## Support

For issues or questions, please open an issue on GitHub.
