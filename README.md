# SPECTRE: Stealthy Polymorphic Evasion & Countermeasure Toolkit for Resilient Executables

## 🎯 Overview

**SPECTRE** is a comprehensive C/C++ code obfuscation platform that implements enterprise-grade protection techniques. It provides multiple layers of security including AES-256 encryption, control flow flattening, anti-debugging, and runtime deobfuscation to protect your code against reverse engineering and static analysis attacks.

### 🚀 Quick Start

```bash
# 1. Install dependencies
cd backend
pip install -r requirements.txt

# 2. Install LLVM (for SIH compliance)
# Windows: choco install llvm
# Linux: sudo apt-get install clang llvm

# 3. Start server
python wsgi.py

# 4. Open app.html in browser and start obfuscating!
```

📖 **New to SPECTRE?** Start with [QUICK_START.md](QUICK_START.md)  
🔧 **Installing LLVM?** See [LLVM_INSTALLATION_GUIDE.md](LLVM_INSTALLATION_GUIDE.md)

## ✨ Key Features

### 🛡️ Advanced Protection Layers

#### Source-Level Obfuscation (GCC)
- **AES-256 String Encryption** - All strings encrypted with PBKDF2 key derivation
- **Control Flow Flattening** - Switch-based state machine transformation
- **Bogus Control Flow** - Opaque predicates and fake branches
- **Constant Encoding** - XOR and arithmetic obfuscation
- **Variable Renaming** - Random 12-character identifiers
- **Anti-Debugging** - Timing-based debugger detection
- **VM Detection** - Heuristic-based virtual machine detection
- **Runtime Decryption** - Dynamic string deobfuscation
- **Data Scrambling** - Structure field reordering

#### IR-Level Obfuscation (LLVM) - **SIH Compliant**
- **LLVM IR Transformation** - Obfuscation at intermediate representation level
- **Object File Manipulation** - Direct object file (.o/.obj) obfuscation
- **LLVM Optimization Passes** - Instruction-level transformations
- **Cross-Platform Object Generation** - Windows (.obj) and Linux (.o) support

### 🎚️ Three Protection Levels

| Level | Cycles | Techniques | Use Case | Overhead |
|-------|--------|-----------|----------|----------|
| **Quick (1-3)** | 1 | Basic | Development | ~5-10% |
| **Balanced (4-7)** | 2 | Moderate | Production | ~15-25% |
| **Maximum (8-10)** | 3 | Heavy | High-Security | ~30-50% |

### 📊 Comprehensive Reporting

- Input parameters logging
- Output file attributes (size, lines)
- Obfuscation statistics (10+ metrics)
- Security score (0-100)
- Verification status
- JSON and HTML report formats

### ✅ Automatic Verification

- Compiles original and obfuscated code
- Runs both with test inputs
- Compares outputs automatically
- Ensures functionality preserved

### 🌐 Cross-Platform Support

- **Windows** - .exe binaries with GCC/MinGW
- **Linux** - ELF binaries with GCC
- Single interface for both platforms

### 🖥️ User-Friendly Interface

- Modern web-based UI
- Drag-and-drop file upload
- Real-time progress tracking
- Code review integration
- One-click downloads

## 📁 Project Structure

```
SPECTRE/
├── 📄 README.md                          # Main documentation (you are here)
├── 📄 PROJECT_STRUCTURE.md               # Organization guide
│
├── 📂 backend/                           # Backend server & obfuscation
│   ├── server.py                         # Flask API server
│   ├── obfuscator.py                     # Basic obfuscator
│   ├── advanced_obfuscator.py            # Advanced obfuscation engine
│   └── requirements.txt                  # Python dependencies
│
├── 📂 examples/                          # Example C/C++ programs
│   ├── simple_hello.c                    # Beginner example
│   ├── calculator.c                      # Intermediate example
│   ├── password_checker.c                # Advanced example
│   └── README.md                         # Examples guide
│
├── 📂 Frontend Files (Root Level)        # Web interface files
│   ├── index.html                        # Landing page
│   ├── app.html                          # Main application
│   ├── login.html                        # Login page
│   ├── features.html                     # Features showcase
│   ├── style.css, style-home.css         # Stylesheets
│   ├── script.js, home.js, auth.js       # JavaScript files
│   └── *.jpg, *.png                      # Images
│
└── 📂 Documentation (Root Level)         # Guides & docs
    ├── QUICK_START.md                    # 5-minute getting started
    ├── ADVANCED_OBFUSCATION_GUIDE.md     # Technical documentation
    ├── OBFUSCATION_GUIDE.md              # Implementation details
    ├── IMPLEMENTATION_SUMMARY.md         # Complete summary
    └── DEPLOYMENT_SUMMARY.md             # Deployment guide
```

> 📌 **Note:** See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for recommended organization and migration guide.

## 🔄 The 8-Phase Workflow

```
1. Upload Code → 2. Create Vault → 3. Baseline Run → 4. Transform
       ↓                ↓                 ↓                ↓
5. Add Protection → 6. Runtime Engine → 7. Verify → 8. Report
```

**Detailed workflow:**
1. **Input & Preparation** - Upload code, validate syntax
2. **Intelligent Analysis** - Profile code, plan strategy
3. **Transformation** - Apply obfuscation techniques (1-3 cycles)
4. **Protection Injection** - Add anti-analysis checks
5. **Code Vault** - Create password-protected backup
6. **Verification** - Compile and test obfuscated code
7. **Reporting** - Generate comprehensive metrics
8. **Delivery** - Package and enable downloads

## 🚀 Usage

### Web Interface

1. Start the backend server:
   
   **Development Mode:**
   ```bash
   cd backend
   python server.py
   ```
   
   **Production Mode (Recommended):**
   ```bash
   cd backend
   pip install -r requirements.txt  # Install dependencies including Waitress
   python wsgi.py
   ```

2. Open `app.html` in your browser

3. Upload your C/C++ file

4. Configure obfuscation:
   - Set level (1-10)
   - Choose platform (Windows/Linux)
   - Enable protection methods

5. Click "Start Obfuscation"

6. Download results:
   - Obfuscated code (.c)
   - Report (JSON/HTML)

### API Usage

```python
import requests

response = requests.post('http://localhost:5000/api/obfuscate/advanced', json={
    'code': open('program.c').read(),
    'level': 'balanced',
    'platform': 'windows',
    'password': 'SecurePass123',
    'verify': True,
    'create_vault': True
})

result = response.json()
print(f"Status: {result['report']['status']}")
print(f"Security Score: {result['report']['security_score']}/100")
```

## 📊 Example Results

### Before Obfuscation
```c
#include <stdio.h>

int main() {
    int age = 25;
    printf("Age: %d\n", age);
    return 0;
}
```

### After Obfuscation (Simplified)
```c
#include <stdio.h>
#include <time.h>

int _spectre_check_debugger() {
    clock_t start = clock();
    volatile int x = 0;
    for(int i = 0; i < 100; i++) x++;
    if ((clock() - start) > 1000) return 1;
    return 0;
}

char* _spectre_decrypt(const char* encrypted) {
    static char buffer[2048];
    // Decryption logic
    return buffer;
}

int main() {
    if (_spectre_check_debugger()) exit(1);
    
    volatile int _obf_x = rand() % 100;
    if ((_obf_x * _obf_x) >= 0) { }
    
    int _var_a7f3k9 = (125 - 100);
    printf(_spectre_decrypt("QWdlOiAlZAo="), _var_a7f3k9);
    return (0 ^ 0xDEADBEEF);
}
```

**Report Highlights:**
- Strings encrypted: 1
- Bogus lines: 6
- Anti-debug checks: 1
- Security score: 65/100
- Size increase: 450%
- Verification: ✅ PASSED

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[ADVANCED_OBFUSCATION_GUIDE.md](ADVANCED_OBFUSCATION_GUIDE.md)** - Complete technical reference
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Comprehensive overview
- **[examples/README.md](examples/README.md)** - Example programs guide

## 🔧 Requirements

### System
- Python 3.7+
- GCC compiler
- 2GB RAM minimum
- Modern web browser

### Python Dependencies
```
flask==2.3.3
flask-cors==4.0.0
pycryptodome==3.19.0
waitress==2.1.2  # Production WSGI server
```

Install: `pip install -r backend/requirements.txt`

## 🎓 Examples

Try the provided examples to learn SPECTRE:

1. **simple_hello.c** - Basic obfuscation (Quick level)
2. **calculator.c** - Intermediate features (Balanced level)
3. **password_checker.c** - Maximum security (Maximum level)

See [examples/README.md](examples/README.md) for details.

## 🔍 Comparison with Industry Tools

| Feature | O-LLVM | Tigress | VMProtect | SPECTRE |
|---------|--------|---------|-----------|---------|
| Control Flow Flattening | ✅ | ✅ | ✅ | ✅ |
| String Encryption | ✅ | ✅ | ✅ | ✅ (AES-256) |
| Anti-Debug | ❌ | ✅ | ✅ | ✅ |
| Web Interface | ❌ | ❌ | ❌ | ✅ |
| Auto Verification | ❌ | ❌ | ❌ | ✅ |
| Reporting | ❌ | ⚠️ | ⚠️ | ✅ |
| Cost | Free | Free | $$$$ | Free |

## 🏆 Key Innovations

1. **Web-Based** - No complex toolchain setup
2. **Auto-Verification** - Ensures correctness
3. **Security Scoring** - Quantifiable protection level
4. **Flexible Levels** - Balance security/performance
5. **Comprehensive Reports** - Detailed metrics
6. **Code Review** - Integrated syntax/security analysis

## 🔮 Future Enhancements

- LLVM IR-based transformations
- Function virtualization
- Multi-file project support
- Docker containerization
- CI/CD integration
- Machine learning optimization

## 🤝 Contributing

This project is part of Smart India Hackathon 2025.

## 📄 License

Smart India Hackathon 2025 - National Technical Research Organisation

## 🆘 Support

- Check documentation files
- Review examples
- Test with provided samples
- Verify GCC installation

---

**SPECTRE** - Enterprise-Grade Code Protection Made Simple 🛡️

*Protecting your intellectual property, one obfuscation at a time.*
