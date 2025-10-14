# How to Test Your Downloaded Obfuscated File

This guide explains how to verify that your downloaded obfuscated code produces the same output as your original code.

## Quick Start

### Method 1: Using the Test Script (Recommended)

1. **Prepare your files**:
   - Have your original C/C++ file ready (e.g., `my_program.c`)
   - Download the obfuscated code from SPECTRE web interface
   - Save it with a different name (e.g., `my_program_obfuscated.c`)

2. **Run the test**:
   ```bash
   python test_downloaded_file.py original.c obfuscated_code.c
   ```

3. **View results**:
   - The script will compile both files
   - Run both executables
   - Compare the outputs
   - Show you if they match ✅ or differ ❌

### Method 2: Using Batch File (Windows)

Simply drag and drop your files onto `test_downloaded.bat` or run:
```cmd
test_downloaded.bat original.c obfuscated_code.c
```

### Method 3: Interactive Mode

If you don't provide file paths, the script will ask you:
```bash
python test_downloaded_file.py
```

Then enter the paths when prompted:
```
Enter path to ORIGINAL file: C:\path\to\original.c
Enter path to OBFUSCATED file (downloaded): C:\Downloads\obfuscated_code.c
```

---

## Step-by-Step Example

### Step 1: Create Original Code

Create a file `test.c`:
```c
#include <stdio.h>

int main() {
    int a = 10;
    int b = 20;
    printf("Sum: %d\n", a + b);
    printf("Product: %d\n", a * b);
    return 0;
}
```

### Step 2: Obfuscate Using SPECTRE Web Interface

1. Open SPECTRE in your browser
2. Upload or paste `test.c`
3. Click "Obfuscate Code"
4. Click "Download Obfuscated Code"
5. Save as `test_obfuscated.c`

### Step 3: Run Verification Test

```bash
cd C:\Users\abhis\ProjectSIH\SPECTRE
python test_downloaded_file.py test.c test_obfuscated.c
```

### Step 4: Check Results

You should see output like:

```
================================================================================
  TESTING DOWNLOADED OBFUSCATED FILE
================================================================================

Original File: test.c
Obfuscated File: test_obfuscated.c
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
Sum: 30
Product: 200
--------------------------------------------------------------------------------

================================================================================
  TESTING OBFUSCATED FILE
================================================================================

📝 Compiling with gcc...
✅ Compilation successful!
🚀 Running executable...

📤 Obfuscated Output:
--------------------------------------------------------------------------------
Sum: 30
Product: 200
--------------------------------------------------------------------------------

================================================================================
  VERIFICATION RESULTS
================================================================================

✅ SUCCESS! Outputs are IDENTICAL!

The obfuscated code produces the exact same output as the original.
This confirms that obfuscation preserved the program's functionality.

================================================================================

🎉 VERIFICATION PASSED!

Your downloaded obfuscated code works correctly!
```

---

## What the Test Does

1. **Checks File Existence**: Verifies both files exist
2. **Shows File Sizes**: Displays original vs obfuscated size
3. **Compiles Original**: Compiles your original code with gcc/g++
4. **Runs Original**: Executes and captures output
5. **Compiles Obfuscated**: Compiles the downloaded obfuscated code
6. **Runs Obfuscated**: Executes and captures output
7. **Compares Outputs**: Checks if outputs are identical
8. **Reports Results**: Shows ✅ PASS or ❌ FAIL

---

## Troubleshooting

### "File not found" Error

**Problem**: The script can't find your files.

**Solution**: 
- Use full paths: `C:\Users\...\file.c`
- Or navigate to the directory first: `cd C:\path\to\files`
- Make sure file names are correct

### "Compilation failed" Error

**Problem**: The code won't compile.

**Solution**:
- Check if GCC is installed: `gcc --version`
- Make sure the original code compiles: `gcc original.c -o test.exe`
- Check for syntax errors in the original code

### "Outputs are DIFFERENT" Error

**Problem**: Original and obfuscated outputs don't match.

**Solution**:
- Check if your code uses random numbers or timestamps
- Verify the obfuscation completed successfully
- Try re-obfuscating with a different level
- Check the SPECTRE logs for errors

### "Execution timeout" Error

**Problem**: The program takes too long to run.

**Solution**:
- Check for infinite loops in your code
- Reduce input size if testing with large data
- Increase timeout in the script (edit line with `timeout=10`)

---

## Testing C++ Files

The script automatically detects C++ files. Just use `.cpp` extension:

```bash
python test_downloaded_file.py original.cpp obfuscated_code.cpp
```

---

## Testing with Input

If your program requires input, you can modify the script or test manually:

### Manual Testing:

1. **Compile both files**:
   ```bash
   gcc original.c -o original.exe
   gcc obfuscated.c -o obfuscated.exe
   ```

2. **Run with same input**:
   ```bash
   echo "test input" | original.exe > output1.txt
   echo "test input" | obfuscated.exe > output2.txt
   ```

3. **Compare outputs**:
   ```bash
   fc output1.txt output2.txt
   ```

---

## Advanced Usage

### Test Multiple Files

Create a batch script `test_all.bat`:
```batch
@echo off
python test_downloaded_file.py test1.c test1_obf.c
python test_downloaded_file.py test2.c test2_obf.c
python test_downloaded_file.py test3.c test3_obf.c
pause
```

### Automated Testing

For CI/CD integration:
```bash
python test_downloaded_file.py original.c obfuscated.c
if %ERRORLEVEL% EQU 0 (
    echo Test passed!
) else (
    echo Test failed!
    exit /b 1
)
```

---

## Expected Results

### ✅ Successful Test

- Both files compile without errors
- Both executables run successfully
- Outputs are **byte-for-byte identical**
- Exit code: 0

### ❌ Failed Test

- Compilation errors
- Runtime errors
- Different outputs
- Exit code: 1

---

## FAQ

**Q: Why is the obfuscated file larger?**  
A: Obfuscation adds bogus code, opaque predicates, and anti-analysis checks, which increase file size. This is normal and expected.

**Q: Will the obfuscated code run slower?**  
A: Slightly, due to additional checks and transformations. The performance impact is usually minimal for most applications.

**Q: Can I test LLVM-obfuscated files?**  
A: Yes! The LLVM obfuscator produces executable files. You can test them the same way.

**Q: What if my program uses random numbers?**  
A: Use a fixed seed (`srand(42)`) in your code before testing, or test with deterministic inputs.

**Q: Can I test files with command-line arguments?**  
A: You'll need to modify the script to pass arguments to the executables. See the "Advanced Usage" section.

---

## Summary

This testing tool ensures that:
- ✅ Your downloaded obfuscated code compiles correctly
- ✅ It produces the same output as the original
- ✅ Obfuscation preserved program functionality
- ✅ You can confidently use the obfuscated version

**Remember**: The goal of obfuscation is to make code harder to reverse engineer while maintaining identical functionality. This test confirms that goal is achieved!

---

**Need Help?**  
If you encounter issues, check the SPECTRE documentation or contact support.
