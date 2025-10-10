# SPECTRE Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Start Backend Server

```bash
python server.py
```

You should see:
```
Starting SPECTRE Backend Server on http://localhost:5000
Use Ctrl+C to stop the server
```

### Step 3: Open Web Interface

1. Open `app.html` in your web browser
2. Login with any credentials (demo mode)

### Step 4: Upload Code

Create a test file `test.c`:

```c
#include <stdio.h>

int main() {
    printf("Hello from SPECTRE!\n");
    return 0;
}
```

Upload this file to SPECTRE.

### Step 5: Configure & Obfuscate

1. Set **Obfuscation Level**: 5 (Balanced)
2. Select **Target Platform**: Windows
3. Click **"Start Obfuscation"**

### Step 6: Download Results

After processing completes:
- Download obfuscated code (.c file)
- Download report (JSON or HTML)

## 🎯 What Happens During Obfuscation?

### The 8-Phase Workflow

```
1. Upload Code → 2. Create Vault → 3. Baseline Run → 4. Transform Code
    ↓                    ↓                 ↓                  ↓
5. Add Protection → 6. Inject Runtime → 7. Verify → 8. Generate Report
```

### Protection Applied (Balanced Level)

✅ **String Encryption** - All strings encrypted with AES-256  
✅ **Bogus Control Flow** - Fake branches added  
✅ **Constant Encoding** - Numbers hidden with XOR  
✅ **Anti-Analysis** - Debugger detection added  
✅ **Runtime Engine** - Decryption code injected  
✅ **Code Vault** - Original code backed up  

## 📊 Understanding the Report

### Key Metrics

**Input Parameters**
- Level: balanced
- Platform: windows
- Verification: enabled

**Output Attributes**
- Original: 156 bytes
- Obfuscated: 892 bytes
- Increase: 471.79%

**Statistics**
- Strings encrypted: 3
- Bogus lines: 6
- Control flow changes: 2
- Cycles: 2

**Security Score: 75/100** 🛡️

## 🔧 Obfuscation Levels Explained

### 🟢 Quick (1-3)
**Use for:** Development, testing  
**Features:** Basic protection  
**Overhead:** ~5-10%  
**Time:** Fast

### 🟡 Balanced (4-7)
**Use for:** Production releases  
**Features:** Moderate protection  
**Overhead:** ~15-25%  
**Time:** Medium

### 🔴 Maximum (8-10)
**Use for:** High-security apps  
**Features:** Heavy protection  
**Overhead:** ~30-50%  
**Time:** Slower

## 💡 Tips & Best Practices

### ✅ Do's

1. **Review code first** - Use "Review Code" button
2. **Start with Quick** - Test before heavy obfuscation
3. **Enable verification** - Ensure code still works
4. **Backup originals** - Keep unobfuscated version
5. **Test thoroughly** - Run obfuscated code extensively

### ❌ Don'ts

1. **Don't skip syntax check** - Fix errors first
2. **Don't use Maximum for everything** - Balance security/performance
3. **Don't lose vault password** - Store it securely
4. **Don't obfuscate debug builds** - Keep dev builds readable
5. **Don't expect 100% protection** - Obfuscation slows attackers, doesn't stop them

## 🐛 Common Issues & Solutions

### Issue: "Backend not responding"

**Solution:**
```bash
# Check if server is running
curl http://localhost:5000/api/status

# If not, start it
cd backend
python server.py
```

### Issue: "Compilation failed"

**Solution:**
- Install GCC: `gcc --version`
- Windows: Install MinGW or TDM-GCC
- Linux: `sudo apt install gcc`

### Issue: "Verification failed"

**Solution:**
- Try lower obfuscation level
- Check if code has external dependencies
- Disable verification temporarily for testing

### Issue: "File upload not working"

**Solution:**
- Check file extension (.c or .cpp)
- Ensure file size < 1MB
- Try different browser

## 📝 Example: Before & After

### Before (Original)
```c
#include <stdio.h>

int main() {
    int count = 100;
    printf("Count: %d\n", count);
    return 0;
}
```

### After (Obfuscated - Simplified)
```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

// Anti-Analysis Protection
int _spectre_check_debugger() {
    clock_t start = clock();
    volatile int x = 0;
    for(int i = 0; i < 100; i++) x++;
    clock_t end = clock();
    if ((end - start) > 1000) return 1;
    return 0;
}

void _spectre_anti_tamper() {
    if (_spectre_check_debugger()) exit(1);
}

// Runtime Decryption
char* _spectre_decrypt(const char* encrypted) {
    static char buffer[2048];
    // Decryption logic
    return buffer;
}

int main() {
    _spectre_anti_tamper();
    
    // Opaque predicate
    volatile int _obf_x = rand() % 100;
    volatile int _obf_y = rand() % 100;
    if ((_obf_x * _obf_x + _obf_y * _obf_y) >= 0) { }
    
    int _var_a7f3k9 = (200 - 100);
    printf(_spectre_decrypt("Q291bnQ6ICVkCg=="), _var_a7f3k9);
    return (0 ^ 0xDEADBEEF);
}
```

## 🎓 Learning Path

### Beginner
1. Read this Quick Start
2. Try Quick level obfuscation
3. Review generated reports
4. Understand basic techniques

### Intermediate
1. Read ADVANCED_OBFUSCATION_GUIDE.md
2. Try Balanced level
3. Experiment with different options
4. Compare security scores

### Advanced
1. Study obfuscator source code
2. Use Maximum level
3. Customize protection techniques
4. Integrate into build pipeline

## 🔗 Additional Resources

- **ADVANCED_OBFUSCATION_GUIDE.md** - Detailed technical documentation
- **OBFUSCATION_GUIDE.md** - Original obfuscation guide
- **README.md** - Project overview
- **backend/advanced_obfuscator.py** - Source code

## 🎯 Next Steps

1. ✅ Complete this quick start
2. 📖 Read advanced guide
3. 🧪 Test with your own code
4. 🚀 Deploy to production
5. 📊 Monitor performance impact

## 🆘 Need Help?

1. Check documentation files
2. Review server console logs
3. Test with provided examples
4. Verify GCC installation

## 🏆 Success Checklist

- [ ] Backend server running
- [ ] Web interface accessible
- [ ] Test file obfuscated successfully
- [ ] Report downloaded and reviewed
- [ ] Obfuscated code compiles
- [ ] Verification passed
- [ ] Original code backed up

**Congratulations! You're ready to use SPECTRE!** 🎉

---

**SPECTRE** - Stealthy Polymorphic Evasion & Countermeasure Toolkit for Resilient Executables
