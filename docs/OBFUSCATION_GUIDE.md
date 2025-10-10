# SPECTRE Obfuscation System

## Overview
SPECTRE now includes a comprehensive code obfuscation system with AES-based encryption, automatic verification, and detailed reporting.

## Features Implemented

### 🔐 Obfuscation Techniques
1. **String Encryption (AES-256)**
   - All string literals encrypted using AES-256
   - Password-based key derivation (PBKDF2)
   - Runtime decryption engine injected into code

2. **Constant Encoding**
   - Numerical constants encoded using XOR operations
   - Makes reverse engineering harder

3. **Bogus Control Flow**
   - Opaque predicates inserted
   - Fake control structures added
   - Anti-analysis code injection

4. **Password-Protected Code Vault**
   - Original source code archived in encrypted ZIP
   - Secure backup before obfuscation

### ✅ Verification System
- **Baseline Execution**: Runs original code to capture expected output
- **Post-Obfuscation Test**: Runs obfuscated code with same input
- **Output Comparison**: Verifies functionality is preserved
- **Automated Testing**: Ensures no bugs introduced

### 📊 Comprehensive Reporting
Reports include all SIH-required metrics:
- (a) Input parameters (level, password protection, etc.)
- (b) Output attributes (file sizes, size increase %)
- (c) Bogus code lines generated
- (d) Number of obfuscation cycles
- (e) String encryptions performed
- (f) Control flow structures inserted
- **PLUS**: Verification status and detailed statistics

## How to Use

### 1. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

This installs:
- Flask (web server)
- Flask-CORS (cross-origin support)
- pycryptodome (AES encryption)

### 2. Start Backend Server
```bash
python backend/server.py
```

Server starts on `http://localhost:5000`

### 3. Use the Web Interface

#### Step 1: Upload Code
- Open `app.html` in browser
- Upload your C/C++ source file

#### Step 2: Configure Obfuscation
- **Obfuscation Level** (1-10):
  - 1-3: Quick (1 cycle, basic protection)
  - 4-7: Balanced (2 cycles, moderate protection)
  - 8-10: Maximum (3 cycles, heavy protection)

#### Step 3: Start Obfuscation
- Click **"Start Obfuscation"** button
- Watch real-time progress:
  - Creating code vault
  - Running baseline verification
  - Applying transformations
  - Verifying output
  - Generating report

#### Step 4: Download Results
After completion, download:
- **Obfuscated Code** (.c file)
- **Report** (JSON format)
- **Report** (HTML format - beautifully formatted)

## Obfuscation Process Flow

```
1. Upload Code
   ↓
2. Create Password-Protected Vault (original code backup)
   ↓
3. Run Baseline (capture expected output)
   ↓
4. Apply Obfuscation Transformations:
   - String encryption (AES-256)
   - Constant encoding (XOR)
   - Bogus control flow insertion
   - Anti-analysis code injection
   ↓
5. Inject Runtime Decryption Engine
   ↓
6. Verify Obfuscated Code (run and compare output)
   ↓
7. Generate Comprehensive Report
   ↓
8. Download Results
```

## Example: Before & After

### Original Code
```c
#include <stdio.h>

int main() {
    char name[50];
    printf("Enter your name: ");
    scanf("%s", name);
    printf("Hello, %s!\n", name);
    return 0;
}
```

### Obfuscated Code (Simplified Example)
```c
// SPECTRE Runtime Decryption Engine
#include <string.h>
#include <stdlib.h>

char* decrypt_str(const char* encrypted) {
    // AES decryption logic here
    static char buffer[1024];
    // ... decryption code ...
    return buffer;
}

#include <stdio.h>

int main() {
    // Opaque predicate for anti-analysis
    volatile int _obf_check = (rand() % 2 == 0 || rand() % 2 == 1);
    if (_obf_check) { /* continue */ }
    
    char name[50];
    printf(decrypt_str("U2FsdGVkX1..."), ""); // Encrypted string
    scanf(decrypt_str("U2FsdGVkX2..."), name);
    printf(decrypt_str("U2FsdGVkX3..."), name);
    return (0 ^ 0xDEADBEEF); // Encoded constant
}
```

## Report Example

### JSON Report
```json
{
  "timestamp": "2025-10-10T17:30:00",
  "input_parameters": {
    "obfuscation_level": "balanced",
    "password_protected": true,
    "verification_enabled": true
  },
  "output_attributes": {
    "original_size_bytes": 156,
    "obfuscated_size_bytes": 892,
    "size_increase_percent": 471.79
  },
  "obfuscation_statistics": {
    "strings_encrypted": 3,
    "bogus_code_lines": 6,
    "control_flow_changes": 2,
    "constants_encoded": 1,
    "obfuscation_cycles": 2
  },
  "verification": {
    "verified": true,
    "reason": "Outputs match"
  },
  "status": "SUCCESS"
}
```

### HTML Report
Beautiful, formatted report with:
- Status badge (SUCCESS/FAILED)
- Input parameters table
- Output attributes table
- Obfuscation statistics table
- Verification results

## API Endpoints

### POST /api/obfuscate
Obfuscate code with verification.

**Request:**
```json
{
  "code": "C/C++ source code",
  "password": "vault_password",
  "level": "balanced",
  "test_input": "",
  "verify": true,
  "create_vault": true
}
```

**Response:**
```json
{
  "success": true,
  "obfuscated_code": "...",
  "report": { ... },
  "vault_created": true
}
```

## Security Features

### 1. AES-256 Encryption
- Industry-standard encryption for strings
- PBKDF2 key derivation (100,000 iterations)
- Unique IV for each encryption

### 2. Password-Protected Vault
- Original code stored in encrypted ZIP
- Password required to extract
- Secure backup before obfuscation

### 3. Anti-Analysis
- Opaque predicates (always true but hard to analyze)
- Bogus control flow structures
- Makes static analysis difficult

### 4. Verification
- Ensures obfuscated code works correctly
- Compares outputs automatically
- Prevents broken code deployment

## Obfuscation Levels

| Level | Name | Cycles | Features |
|-------|------|--------|----------|
| 1-3 | Quick | 1 | Basic control flow obfuscation |
| 4-7 | Balanced | 2 | + String encryption |
| 8-10 | Maximum | 3 | + Constant encoding, heavy protection |

## Requirements

### System Requirements
- Python 3.7+
- GCC compiler (for verification)
- Modern web browser

### Python Dependencies
- flask==2.3.3
- flask-cors==4.0.0
- pycryptodome==3.19.0

## Troubleshooting

### "Compilation failed" Error
- Ensure GCC is installed: `gcc --version`
- Check code syntax before obfuscation
- Use "Review Code" feature first

### "Verification failed" Error
- Obfuscated code output differs from original
- Check if code has runtime dependencies
- Try lower obfuscation level

### Backend Not Responding
```bash
# Check if server is running
curl http://localhost:5000/api/status

# Restart server
python backend/server.py
```

## Advanced Usage

### Custom Password
Modify `script.js` line 130:
```javascript
password: 'YOUR_CUSTOM_PASSWORD',
```

### Disable Verification
For faster obfuscation (not recommended):
```javascript
verify: false,
```

### Skip Code Vault
```javascript
create_vault: false,
```

## Future Enhancements

Planned features:
- [ ] Multiple encryption algorithms (RSA, ChaCha20)
- [ ] LLVM-based control flow flattening
- [ ] Data structure scrambling
- [ ] Anti-debugging techniques
- [ ] Cross-platform binary generation
- [ ] Docker containerization

## License & Credits

Part of the SPECTRE platform for Smart India Hackathon 2025.

**Obfuscation Techniques:**
- AES-256 encryption (pycryptodome)
- Opaque predicates
- Control flow obfuscation
- Runtime decryption

---

**Ready to obfuscate your code securely!** 🛡️
