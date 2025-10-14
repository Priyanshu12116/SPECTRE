# SPECTRE Testing Guide

## Testing Your Downloaded Obfuscated Files

This guide shows you how to verify that files downloaded from the SPECTRE web interface work correctly.

---

## 🚀 Quick Start

### Step 1: Get Your Files Ready

1. **Original file**: Your source code (e.g., `mycode.c`)
2. **Obfuscated file**: Downloaded from SPECTRE web interface (e.g., `mycode_obfuscated.c`)

### Step 2: Run the Test

```bash
python test_downloaded_file.py mycode.c mycode_obfuscated.c
```

### Step 3: Check Results

- ✅ **PASSED**: Outputs are identical - obfuscation successful!
- ❌ **FAILED**: Outputs differ - check for issues

---

## 📋 Complete Workflow Example

### 1. Create Your Original Code

`calculator.c`:
```c
#include <stdio.h>

int main() {
    int a = 10, b = 5;
    printf("Sum: %d\n", a + b);
    printf("Difference: %d\n", a - b);
    return 0;
}
```

### 2. Use SPECTRE Web Interface

1. Open SPECTRE in browser: `http://localhost:5000`
2. Upload `calculator.c` or paste the code
3. Select obfuscation level (Quick/Balanced/Maximum)
4. Click **"Obfuscate Code"**
5. Wait for processing
6. Click **"Download Obfuscated Code"**
7. Save as `calculator_obfuscated.c`

### 3. Test the Downloaded File

```bash
cd C:\Users\abhis\ProjectSIH\SPECTRE
python test_downloaded_file.py calculator.c calculator_obfuscated.c
```

### 4. Expected Output

```
================================================================================
  TESTING DOWNLOADED OBFUSCATED FILE
================================================================================

Original File: calculator.c
Obfuscated File: calculator_obfuscated.c
Language: C

📊 File Sizes:
  Original:    156 bytes
  Obfuscated:  234 bytes
  Increase:    50.0%

================================================================================
  TESTING ORIGINAL FILE
================================================================================

📝 Compiling with gcc...
✅ Compilation successful!
🚀 Running executable...

📤 Original Output:
--------------------------------------------------------------------------------
Sum: 15
Difference: 5
--------------------------------------------------------------------------------

================================================================================
  TESTING OBFUSCATED FILE
================================================================================

📝 Compiling with gcc...
✅ Compilation successful!
🚀 Running executable...

📤 Obfuscated Output:
--------------------------------------------------------------------------------
Sum: 15
Difference: 5
--------------------------------------------------------------------------------

================================================================================
  VERIFICATION RESULTS
================================================================================

✅ SUCCESS! Outputs are IDENTICAL!

The obfuscated code produces the exact same output as the original.
This confirms that obfuscation preserved the program's functionality.

🎉 VERIFICATION PASSED!
```

---

## 🎯 Different Ways to Run Tests

### Method 1: Command Line with Arguments
```bash
python test_downloaded_file.py original.c obfuscated.c
```

### Method 2: Interactive Mode
```bash
python test_downloaded_file.py
# Then enter file paths when prompted
```

### Method 3: Batch File (Windows)
```cmd
test_downloaded.bat original.c obfuscated.c
```

### Method 4: Drag and Drop (Windows)
Drag both files onto `test_downloaded.bat`

---

## 📝 Testing Different File Types

### C Files
```bash
python test_downloaded_file.py program.c program_obfuscated.c
```

### C++ Files
```bash
python test_downloaded_file.py program.cpp program_obfuscated.cpp
```

The script automatically detects the language based on file extension.

---

## 🔍 What Gets Tested

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Check file existence | Verify both files are present |
| 2 | Show file sizes | Display size increase from obfuscation |
| 3 | Compile original | Ensure original code is valid |
| 4 | Run original | Capture baseline output |
| 5 | Compile obfuscated | Verify obfuscated code compiles |
| 6 | Run obfuscated | Capture obfuscated output |
| 7 | Compare outputs | Check if outputs match exactly |
| 8 | Report results | Show PASS/FAIL status |

---

## ✅ Success Criteria

Your test **PASSES** if:
- ✅ Both files compile without errors
- ✅ Both executables run successfully
- ✅ Outputs are **byte-for-byte identical**
- ✅ No runtime errors occur

Your test **FAILS** if:
- ❌ Compilation errors occur
- ❌ Runtime errors occur
- ❌ Outputs are different
- ❌ Executables crash

---

## 🛠️ Troubleshooting

### Problem: "File not found"

**Cause**: Script can't locate your files

**Solutions**:
- Use full paths: `C:\Users\...\file.c`
- Check file names for typos
- Ensure files are in the correct directory

### Problem: "Compilation failed"

**Cause**: Code has syntax errors or missing dependencies

**Solutions**:
- Test original file first: `gcc original.c -o test.exe`
- Check for syntax errors
- Ensure GCC is installed: `gcc --version`
- Install required libraries

### Problem: "Outputs are DIFFERENT"

**Cause**: Obfuscation may have introduced issues OR code uses non-deterministic features

**Solutions**:
- Check if code uses `rand()` without fixed seed
- Check if code uses timestamps or system time
- Verify obfuscation completed successfully
- Check SPECTRE logs for errors
- Try re-obfuscating

### Problem: "Execution timeout"

**Cause**: Program takes too long to run

**Solutions**:
- Check for infinite loops
- Reduce input data size
- Increase timeout in script (edit `timeout=10` to higher value)

---

## 📊 Sample Test Results

### Example 1: Simple Program ✅

**Original**: 
```c
int main() { printf("Hello\n"); return 0; }
```

**Result**: 
- Original output: `Hello`
- Obfuscated output: `Hello`
- **Status**: ✅ PASSED

### Example 2: Calculator ✅

**Original**:
```c
int main() {
    printf("5 + 3 = %d\n", 5 + 3);
    return 0;
}
```

**Result**:
- Original output: `5 + 3 = 8`
- Obfuscated output: `5 + 3 = 8`
- **Status**: ✅ PASSED

### Example 3: Complex Logic ✅

**Original**:
```c
int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n-1);
}
int main() {
    printf("5! = %d\n", factorial(5));
    return 0;
}
```

**Result**:
- Original output: `5! = 120`
- Obfuscated output: `5! = 120`
- **Status**: ✅ PASSED

---

## 🎓 Understanding the Results

### File Size Increase

Obfuscated files are larger because they include:
- Bogus code (decoy instructions)
- Opaque predicates (always-true/false conditions)
- Anti-analysis checks
- Control flow modifications

**Typical increases**:
- Quick level: 15-25%
- Balanced level: 25-40%
- Maximum level: 40-60%

### Compilation Time

Obfuscated code may take slightly longer to compile due to:
- More code to process
- Complex control flow
- Additional transformations

### Runtime Performance

Obfuscated code may run slightly slower due to:
- Extra checks and conditions
- Modified control flow
- Anti-analysis protections

**Note**: Performance impact is usually minimal (<5% for most programs)

---

## 🔬 Advanced Testing

### Testing with Input Files

If your program reads input:

```bash
# Create test input
echo "test data" > input.txt

# Test original
gcc original.c -o orig.exe
orig.exe < input.txt > output1.txt

# Test obfuscated
gcc obfuscated.c -o obf.exe
obf.exe < input.txt > output2.txt

# Compare
fc output1.txt output2.txt
```

### Testing with Command-Line Arguments

Modify `test_downloaded_file.py` to pass arguments:

```python
# In the run_result section, add:
run_result = subprocess.run(
    [exe_name, "arg1", "arg2"],  # Add your arguments here
    capture_output=True,
    text=True,
    timeout=10
)
```

### Batch Testing Multiple Files

Create `test_all.py`:
```python
import subprocess
import sys

tests = [
    ("test1.c", "test1_obf.c"),
    ("test2.c", "test2_obf.c"),
    ("test3.c", "test3_obf.c"),
]

passed = 0
failed = 0

for orig, obf in tests:
    result = subprocess.run(
        ["python", "test_downloaded_file.py", orig, obf],
        capture_output=True
    )
    if result.returncode == 0:
        passed += 1
        print(f"✅ {orig}: PASSED")
    else:
        failed += 1
        print(f"❌ {orig}: FAILED")

print(f"\nTotal: {passed} passed, {failed} failed")
sys.exit(0 if failed == 0 else 1)
```

---

## 📚 Additional Resources

- **Full Documentation**: `ENHANCED_REPORT_DOCUMENTATION.md`
- **Verification Results**: `VERIFICATION_TEST_RESULTS.md`
- **How to Run**: `HOW_TO_RUN.md`
- **Testing Guide**: `HOW_TO_TEST_DOWNLOADED_FILE.md`

---

## ❓ FAQ

**Q: Do I need to test every obfuscated file?**  
A: It's recommended for critical applications. For testing/learning, spot checks are fine.

**Q: Can I use this for production code?**  
A: Yes! This test ensures your obfuscated code works correctly before deployment.

**Q: What if I'm using LLVM obfuscation?**  
A: LLVM produces executables directly. You can test them the same way.

**Q: How do I test code with user input?**  
A: See "Advanced Testing" section above for input file testing.

**Q: Is it normal for obfuscated code to be larger?**  
A: Yes! Obfuscation adds protective code, which increases file size.

---

## 🎉 Summary

This testing tool ensures:
- ✅ Downloaded obfuscated code compiles correctly
- ✅ It produces identical output to original
- ✅ Obfuscation preserved functionality
- ✅ You can confidently deploy obfuscated code

**Remember**: Obfuscation makes code harder to reverse engineer while maintaining identical behavior. This test proves it!

---

**Need Help?**  
Check the documentation or run: `python test_downloaded_file.py --help`
