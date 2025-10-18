# 🛡️ SPECTRE: Stealthy Polymorphic Evasion & Countermeasure Toolkit for Resilient Executables

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![LLVM](https://img.shields.io/badge/LLVM-14.0+-orange.svg)](https://llvm.org/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux-lightgrey.svg)](https://github.com/Priyanshu12116/SPECTRE)

## 🎯 Overview

**SPECTRE** is an enterprise-grade C/C++ code obfuscation platform with **52+ advanced protection techniques**. It combines LLVM IR-level transformations, object file obfuscation, polymorphic engines, and password-protected code vaults to provide military-grade protection against reverse engineering, static analysis, and dynamic analysis attacks.


### 🏆 Key Highlights
- ✅ **52+ Protection Techniques** - Most comprehensive open-source obfuscator
- ✅ **LLVM IR Obfuscation** - compliant object-level protection
- ✅ **Auto-Generated Passwords** - Secure vault protection with HTML reports
- ✅ **Polymorphic Engine** - Code morphs on every execution
- ✅ **Anti-Analysis Suite** - 20+ anti-debugging/VM/sandbox techniques
- ✅ **Smart Performance** - AI-driven optimization balancing
- ✅ **Modern Web Interface** - User authentication, profile management, history tracking
- ✅ **Production Ready** - Docker support, WSGI server, enterprise-grade

### 🚀 Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Priyanshu12116/SPECTRE.git
cd SPECTRE

# 2. Install dependencies
cd backend
pip install -r requirements.txt

# 3. Install LLVM 
# Windows: choco install llvm
# Linux: sudo apt-get install clang llvm

# 4. Start server
python start_server.py
# Or use: python backend/wsgi.py

# 5. Open browser and navigate to:
# http://localhost:5000
```

📖 **New to SPECTRE?** Start with [docs/HOW_TO_RUN.md](docs/HOW_TO_RUN.md)  
🔧 **Installing LLVM?** See [docs/LLVM_INSTALLATION_GUIDE.md](docs/LLVM_INSTALLATION_GUIDE.md)  
📚 **All Documentation:** See [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)

### 🐳 Docker Quick Start

```bash
# Build and run with Docker
docker-compose up --build

# Access at http://localhost:5000
```

## ✨ Complete Feature Set (52+ Techniques)

### 🔐 **Phase 1: Core Obfuscation (MVP)**
1. **String Encryption** - AES-256 with PBKDF2 key derivation
2. **Control Flow Flattening** - Switch-based state machine transformation
3. **Variable Renaming** - Cryptographically random 12-character identifiers
4. **Constant Encoding** - XOR and arithmetic obfuscation
5. **Bogus Control Flow** - Opaque predicates and dead code insertion

### 🧠 **Phase 2: Intelligence Layer**
6. **Smart Obfuscator** - Performance-aware adaptive protection
7. **Polymorphic Engine** - Code morphs on every execution
8. **Security Analyzer (SAST)** - Automated vulnerability scanning
9. **Security Scorecard** - 0-100 protection rating

### 🚀 **Phase 3: Advanced Techniques**
10. **LLVM IR Obfuscation** - Intermediate representation transformation
11. **Object File Obfuscation** - Direct .o/.obj manipulation
12. **Advanced Control Flow** - Multi-layer flattening
13. **Opaque Predicates** - Always-true/false conditions
14. **Function Splitting** - Break functions into fragments
15. **Bogus Code Injection** - Realistic fake operations

### 🔒 **Phase 4: Data Protection**
16. **String Encryption** - Runtime decryption
17. **Constant Encoding** - Multiple encoding schemes
18. **Data Structure Scrambling** - Field reordering
19. **Array Obfuscation** - Index transformation
20. **Pointer Arithmetic** - Complex pointer operations

### 🛡️ **Phase 5: Anti-Analysis (20+ Techniques)**

**Anti-Debugging (7 techniques):**
21. Timing-based detection
22. Hardware breakpoint detection
23. Software breakpoint detection
24. Debugger process detection
25. Parent process checking
26. Debug flags inspection
27. Exception-based detection

**VM Detection (7 techniques):**
28. CPU instruction detection
29. Timing discrepancies
30. Hardware fingerprinting
31. Registry/file checks
32. Process detection
33. Memory patterns
34. Hypervisor detection

**Sandbox Detection (6 techniques):**
35. Environment checks
36. User interaction detection
37. File system analysis
38. Network connectivity
39. Sleep acceleration detection
40. Resource limitations

### 🔐 **Phase 6: Code Vault**
41. **Password-Protected Vault** - PBKDF2-HMAC-SHA256 encryption
42. **Auto-Generated Passwords** - 16-character secure passwords
43. **HTML Password Reports** - Professional password delivery
44. **Runtime Deobfuscation** - On-demand code decryption
45. **Memory Protection** - Secure cleanup after execution

### 🎯 **Phase 7: Expert Features**
46. **Expert Mode UI** - Granular control over all techniques
47. **Performance Budgeting** - Set acceptable slowdown limits
48. **Custom Configurations** - Save/load protection profiles
49. **Batch Processing** - Multiple file obfuscation
50. **API Access** - Programmatic integration

### 📊 **Phase 8: Reporting & Analysis**
51. **Comprehensive Reports** - JSON and HTML formats
52. **Security Metrics** - 15+ statistical measurements
53. **Verification System** - Automatic correctness testing
54. **Code Review** - Integrated syntax and security analysis

### 🎚️ Three Protection Levels

| Level | Cycles | Techniques | Use Case | Overhead |
|-------|--------|-----------|----------|----------|
| **Quick (1-3)** | 1 | Basic | Development | ~5-10% |
| **Balanced (4-7)** | 2 | Moderate | Production | ~15-25% |
| **Maximum (8-10)** | 3 | Heavy | High-Security | ~30-50% |

### 📊 Comprehensive Reporting

**HTML Reports Include:**
- 🔑 **Auto-Generated Password** - Secure 16-character password prominently displayed
- 📊 **Obfuscation Statistics** - 15+ metrics (strings encrypted, control flow changes, etc.)
- 🛡️ **Security Score** - 0-100 rating with breakdown
- ✅ **Verification Status** - Automatic correctness testing results
- 📈 **Performance Impact** - Size increase, execution overhead
- 🔧 **Input Parameters** - All configuration settings logged
- 📄 **Output Attributes** - File sizes, line counts, method used

**Report Formats:**
- **HTML** - Beautiful, professional reports with password section
- **JSON** - Machine-readable for automation

### ✅ Automatic Verification

- Compiles original and obfuscated code
- Runs both with test inputs
- Compares outputs automatically
- Ensures functionality preserved

### 🌐 Cross-Platform Support

- **Windows** - .exe binaries with GCC/MinGW
- **Linux** - ELF binaries with GCC
- Single interface for both platforms

### 🖥️ Modern User Interface

**Landing Page:**
- 🌍 Interactive 3D globe with world map texture
- ⭐ Animated starfield background
- 🎨 Glass-morphism design
- 📱 Fully responsive layout

**Authentication:**
- 🛡️ 3D animated shield with particle effects
- 🔐 Secure login system
- ✨ Interactive animations

**Main Application:**
- 🎯 Clean, professional interface matching home page design
- 📤 Drag-and-drop file upload
- ⚙️ Intuitive configuration controls
- 📊 Real-time progress tracking
- 🔍 Integrated code review
- 🛡️ Security analysis dashboard
- 💾 One-click downloads
- 🎨 Consistent design language throughout

**User Management:**
- 👤 **User Authentication** - Secure login/signup system
- 🔐 **Google OAuth Integration** - One-click Google sign-in
- 📧 **Email & Password Auth** - Traditional authentication
- 🖼️ **Profile Management** - Upload custom profile photos
- ✏️ **Edit Profile** - Update username, email, and password
- 📊 **User Dashboard** - Personal statistics and activity tracking

**History & Analytics:**
- 📜 **Obfuscation History** - Track all your obfuscation jobs
- 🔍 **Search & Filter** - Find files by name or obfuscation level
- 📈 **Statistics Dashboard** - Total files, success rate, last activity
- 🎯 **Level Badges** - Color-coded badges (Source/Intermediate/Binary)
- 💾 **Download History** - Re-download previous obfuscations
- 🗑️ **History Management** - Delete individual items or clear all

**Results Page:**
- 📊 **Comprehensive Results** - View all obfuscation results
- 🎨 **Visual Cards** - Beautiful card-based layout
- 🔍 **Detailed Logs** - Expandable log viewer
- ⚡ **Quick Actions** - Download, view, or delete results
- 📈 **Success Tracking** - Visual status indicators

## 📁 Project Structure

```
SPECTRE/
├── 📄 README.md                          # Main documentation (you are here)
├── 📄 start_server.py                    # Quick start server script
├── 📄 Dockerfile                         # Docker configuration
├── 📄 docker-compose.yml                 # Docker Compose setup
│
├── 📂 backend/                           # Backend server & obfuscation engines
│   ├── server.py                         # Flask API server
│   ├── obfuscator.py                     # Basic obfuscator
│   ├── advanced_obfuscator.py            # Advanced obfuscation engine
│   ├── llvm_obfuscator.py                # LLVM IR obfuscator
│   ├── security_analyzer.py              # Security analysis & SAST
│   ├── polymorphic_engine.py             # Polymorphic code generation
│   ├── smart_obfuscator.py               # Performance-aware obfuscation
│   ├── advanced_control_flow.py          # Control flow transformations
│   ├── data_scrambler.py                 # Data structure obfuscation
│   ├── anti_analysis.py                  # Anti-debug/VM/sandbox techniques
│   ├── code_vault.py                     # Password-protected vaults
│   ├── runtime_deobfuscator.py           # Runtime decryption
│   ├── wsgi.py                           # Production WSGI server
│   └── requirements.txt                  # Python dependencies
│
├── 📂 frontend/                          # Modern web interface
│   ├── pages/
│   │   ├── index.html                    # Landing page with 3D globe
│   │   ├── login.html                    # Login page with Google OAuth
│   │   ├── signup.html                   # User registration page
│   │   ├── app.html                      # Main obfuscation tool
│   │   ├── features.html                 # Features showcase
│   │   ├── results.html                  # Results & history page
│   │   └── profile.html                  # User profile & dashboard
│   ├── css/
│   │   ├── style.css                     # App styles
│   │   ├── style-home.css                # Home page styles
│   │   ├── profile.css                   # Profile page styles
│   │   ├── results.css                   # Results page styles
│   │   └── nav-profile.css               # Navigation profile styles
│   └── js/
│       ├── script.js                     # Main application logic
│       ├── home.js                       # 3D globe animation
│       ├── auth.js                       # Authentication logic
│       ├── signup.js                     # Registration logic
│       ├── profile.js                    # Profile management
│       ├── results.js                    # Results page logic
│       └── pdf-report.js                 # PDF report generation
│
├── 📂 assets/                            # Static assets
│   └── images/
│       ├── spectrelogo.jpg               # SPECTRE logo
│       ├── worldmap.jpg                  # Globe texture
│       └── shield.png                    # Shield texture
│
├── 📂 examples/                          # Example C/C++ programs
│   ├── simple_hello.c                    # Beginner example
│   ├── calculator.c                      # Intermediate example
│   ├── password_checker.c                # Advanced example
│   ├── hello_cpp.cpp                     # C++ example
│   └── README.md                         # Examples guide
│
└── 📂 docs/                              # Documentation
    ├── DOCUMENTATION.md                  # Documentation index
    ├── HOW_TO_RUN.md                     # Usage guide
    ├── LLVM_INSTALLATION_GUIDE.md        # LLVM setup
    ├── INSTALL_LLVM_WINDOWS.md           # Windows LLVM guide
    ├── GCC_INSTALLATION_GUIDE.md         # GCC setup
    ├── CPP_SUPPORT.md                    # C++ support details
    ├── QUICK_REFERENCE.md                # Quick commands
    └── PRODUCTION_SERVER_UPGRADE.md      # Production deployment
```

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

1. **Start the server:**
   
   **Quick Start (Recommended):**
   ```bash
   python start_server.py
   ```
   
   **Or manually:**
   ```bash
   cd backend
   pip install -r requirements.txt
   python wsgi.py
   ```

2. **Open your browser:**
   ```
   http://localhost:5000
   ```

3. **Navigate the interface:**
   - **Home Page** - View features and documentation
   - **Login** - Authenticate (demo: admin/123)
   - **Tool** - Main obfuscation interface

4. **Upload your C/C++ file:**
   - Drag & drop or click to browse
   - Supports: .c, .cpp, .cc, .cxx, .h, .hpp

5. **Configure obfuscation:**
   - **Obfuscation Level:** 1-10 (Quick/Balanced/Maximum)
   - **Compiler:** LLVM/Clang
   - **Platform:** Windows or Linux
   - **Mode:** Simple or Expert
   - **Techniques:** Select protection methods

6. **Run obfuscation:**
   - **Review Code** - Syntax validation
   - **Security Scan** - Vulnerability analysis
   - **Start Obfuscation** - Apply protection

7. **Download results:**
   - Obfuscated code (.c)
   - Comprehensive report (HTML/JSON)
   - Password (if vault enabled)

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

## 📚 Documentation

- **[docs/HOW_TO_RUN.md](docs/HOW_TO_RUN.md)** - Complete usage guide
- **[docs/LLVM_INSTALLATION_GUIDE.md](docs/LLVM_INSTALLATION_GUIDE.md)** - LLVM setup instructions
- **[docs/GCC_INSTALLATION_GUIDE.md](docs/GCC_INSTALLATION_GUIDE.md)** - GCC compiler setup
- **[docs/CPP_SUPPORT.md](docs/CPP_SUPPORT.md)** - C++ language support
- **[docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md)** - Quick command reference
- **[docs/PRODUCTION_SERVER_UPGRADE.md](docs/PRODUCTION_SERVER_UPGRADE.md)** - Production deployment
- **[examples/README.md](examples/README.md)** - Example programs guide
- **[docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)** - Complete documentation index

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
| **Techniques** | ~10 | ~15 | ~20 | **52+** ✅ |
| **LLVM IR Obfuscation** | ✅ | ❌ | ❌ | ✅ |
| **Object File Obfuscation** | ❌ | ❌ | ✅ | ✅ |
| **Control Flow Flattening** | ✅ | ✅ | ✅ | ✅ |
| **String Encryption** | ✅ | ✅ | ✅ | ✅ (AES-256) |
| **Anti-Debug/VM/Sandbox** | ❌ | ⚠️ | ✅ | ✅ (20+) |
| **Polymorphic Engine** | ❌ | ⚠️ | ✅ | ✅ |
| **Password-Protected Vault** | ❌ | ❌ | ✅ | ✅ |
| **Auto-Generated Passwords** | ❌ | ❌ | ❌ | ✅ |
| **Web Interface** | ❌ | ❌ | ❌ | ✅ |
| **Auto Verification** | ❌ | ❌ | ❌ | ✅ |
| **HTML Reports** | ❌ | ❌ | ⚠️ | ✅ |
| **Security Scoring** | ❌ | ❌ | ❌ | ✅ |
| **Expert Mode** | ⚠️ | ⚠️ | ✅ | ✅ |
| **Docker Support** | ⚠️ | ❌ | ❌ | ✅ |
| **Cost** | Free | Free | $$$$ | **Free** |

## 🏆 Key Innovations

1. **52+ Protection Techniques** - Most comprehensive open-source obfuscator
2. **Auto-Generated Passwords** - Unique secure passwords with HTML reports
3. **Polymorphic Engine** - Code morphs on every execution
4. **Smart Performance Balancing** - AI-driven optimization
5. **20+ Anti-Analysis Techniques** - Anti-debug, VM, sandbox detection
6. **Modern Web Interface** - 3D animations, glass-morphism design
7. **Auto-Verification** - Ensures correctness automatically
8. **Security Scoring** - Quantifiable 0-100 protection level
9. **Expert Mode** - Granular control over all techniques
10. **Docker Support** - Production-ready containerization
11. **Comprehensive Reports** - HTML with passwords, JSON for automation

## 🎨 Recent Updates & Improvements

### **v2.0 - Profile & User Management (Latest)**

**New Features:**
- 👤 **Complete User System** - Login, signup, and profile management
- 🔐 **Google OAuth Integration** - One-click sign-in with Google
- 🖼️ **Profile Photo Upload** - Custom avatars with Base64 storage
- ✏️ **Profile Editing** - Update username, email, and password
- 📊 **User Dashboard** - Personal statistics and activity tracking
- 📜 **Obfuscation History** - Track all your obfuscation jobs with search/filter
- 🎯 **Level Badges** - Color-coded badges (Cyan/Purple/Orange)
- 📈 **Results Page** - Comprehensive results viewer with visual cards

**Bug Fixes:**
- ✅ Fixed username not updating in navbar after profile edit
- ✅ Removed demo user auto-login from app.html
- ✅ Fixed obfuscation history sync between results and profile pages
- ✅ Fixed features page navbar missing container wrapper
- ✅ Fixed dropdown showing all options expanded
- ✅ Fixed level badges not visible in profile history
- ✅ Added proper user data isolation (per-user history)
- ✅ Improved session management

**Technical Improvements:**
- ✅ User-specific history filtering
- ✅ Automatic page reload after profile updates
- ✅ Enhanced CSS with proper dropdown styling
- ✅ Better localStorage management
- ✅ Consistent navbar across all pages
- ✅ Added username and level to history items

### **v1.5 - UI/UX Enhancements**

**Landing Page:**
- 🌍 Interactive 3D globe with real-world map texture
- ⭐ Animated starfield background with mouse tracking
- 🎨 Modern glass-morphism card design
- 📱 Fully responsive and mobile-friendly

**Authentication:**
- 🛡️ 3D animated shield with particle effects
- ✨ Interactive mouse-tracking animations
- 🔐 Secure login system

**Main Application:**
- 🎯 Complete UI redesign matching home page aesthetics
- 📤 Improved file upload with better visual feedback
- ⚙️ Clean configuration interface with icons
- 📊 Professional progress tracking
- 🎨 Consistent design language across all pages
- 💾 Streamlined download experience

**Code Quality:**
- ✅ Fixed all 40+ linting issues
- ✅ Moved inline styles to external CSS
- ✅ Added Safari compatibility (-webkit-backdrop-filter)
- ✅ Improved accessibility (ARIA labels)
- ✅ Fixed Docker configuration
- ✅ Corrected all image paths
- ✅ JavaScript error handling improved

## ✅ SIH 2025 Compliance

**SPECTRE meets all Smart India Hackathon 2025 requirements:**
- ✅ **Object File Obfuscation** - Direct .o/.obj manipulation
- ✅ **LLVM IR Transformation** - Intermediate representation obfuscation
- ✅ **52+ Techniques** - Exceeds minimum requirements
- ✅ **Comprehensive Reporting** - All metrics tracked
- ✅ **Production Ready** - Docker, WSGI, enterprise-grade
- ✅ **Open Source** - Fully documented and accessible

## 🔮 Roadmap (Already Implemented!)

- ✅ LLVM IR-based transformations
- ✅ Object file obfuscation
- ✅ Polymorphic engine
- ✅ Password-protected vaults
- ✅ Docker containerization
- ✅ Expert mode UI
- ✅ Anti-analysis suite
- ✅ Smart performance optimization


**Repository:** [https://github.com/Priyanshu12116/SPECTRE](https://github.com/Priyanshu12116/SPECTRE)

## 📚 Documentation

**Core Documentation:**
- 📖 [Complete Usage Guide](docs/HOW_TO_RUN.md)
- 🔧 [LLVM Installation](docs/LLVM_INSTALLATION_GUIDE.md)
- 📚 [All Documentation](docs/DOCUMENTATION.md)
- ⚡ [Quick Reference](docs/QUICK_REFERENCE.md)
- 🚀 [Production Setup](docs/PRODUCTION_SERVER_UPGRADE.md)

**Feature Guides:**
- 🔐 [Google OAuth Setup](frontend/GOOGLE_AUTH_SETUP.md)
- 👤 [Profile Page Guide](frontend/PROFILE_PAGE_GUIDE.md)
- 🐛 [Bug Fixes Summary](BUG_FIXES_SUMMARY.md)
- 🧹 [Cleanup Summary](CLEANUP_SUMMARY.md)

**Examples:**
- 💡 [Example Programs](examples/README.md)
- 🎯 Simple, Intermediate, and Advanced examples included

---

**Made with ❤️ by AlgorixMind**  
**SPECTRE - Enterprise-Grade Code Protection Made Simple** 🛡️

*Protecting your intellectual property, one obfuscation at a time.*
