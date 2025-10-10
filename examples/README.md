# SPECTRE Example Programs

This directory contains example C programs to test SPECTRE's obfuscation capabilities.

## Examples

### 1. simple_hello.c
**Difficulty:** Beginner  
**Recommended Level:** Quick (1-3)  
**Features Tested:**
- Basic string encryption
- Simple control flow
- Runtime decryption

**Expected Results:**
- Strings encrypted: 2
- Bogus lines: ~4-6
- Security score: ~30-40

### 2. calculator.c
**Difficulty:** Intermediate  
**Recommended Level:** Balanced (4-7)  
**Features Tested:**
- Variable renaming
- Constant encoding
- Function obfuscation
- Multiple string encryption

**Expected Results:**
- Strings encrypted: 7
- Variables renamed: 2
- Constants encoded: 4-6
- Security score: ~60-75

### 3. password_checker.c
**Difficulty:** Advanced  
**Recommended Level:** Maximum (8-10)  
**Features Tested:**
- Sensitive string protection
- Control flow flattening
- Anti-debugging
- Maximum security

**Expected Results:**
- Strings encrypted: 6
- Control flow changes: 2-3
- Anti-debug checks: 2
- Security score: ~85-95

## How to Use

### Method 1: Web Interface

1. Start backend server:
   ```bash
   cd backend
   python server.py
   ```

2. Open `app.html` in browser

3. Upload one of the example files

4. Configure obfuscation level

5. Click "Start Obfuscation"

6. Download and test results

### Method 2: API

```bash
curl -X POST http://localhost:5000/api/obfuscate/advanced \
  -H "Content-Type: application/json" \
  -d '{
    "code": "...",
    "level": "balanced",
    "platform": "windows",
    "verify": true
  }'
```

## Testing Obfuscated Code

### Compile Original
```bash
gcc simple_hello.c -o original.exe
./original.exe
```

### Compile Obfuscated
```bash
gcc obfuscated_simple_hello.c -o obfuscated.exe
./obfuscated.exe
```

### Compare Outputs
Both should produce identical output!

## What to Look For

### In Obfuscated Code

✅ **Encrypted Strings**
```c
printf(_spectre_decrypt("SGVsbG8gZnJvbSBTUEVDVFJFIQo="));
```

✅ **Encoded Constants**
```c
int num = (5234 ^ 0x1492);  // Was: 50
```

✅ **Renamed Variables**
```c
int _var_a7f3k9x2p1q8 = 25;  // Was: num2
```

✅ **Anti-Debug Checks**
```c
_spectre_anti_tamper();
```

✅ **Opaque Predicates**
```c
if ((_obf_x * _obf_x + _obf_y * _obf_y) >= 0) { }
```

### In Report

- **Status:** SUCCESS
- **Verification:** Verified ✅
- **Security Score:** 60-95 (depending on level)
- **Size Increase:** 300-600%

## Troubleshooting

### Issue: Compilation errors in obfuscated code

**Cause:** Aggressive obfuscation broke syntax  
**Solution:** Use lower obfuscation level

### Issue: Verification failed

**Cause:** Output differs from original  
**Solution:** 
- Check for undefined behavior in original
- Try balanced level instead of maximum
- Disable verification for testing

### Issue: Program crashes when run

**Cause:** Anti-debug check triggered  
**Solution:** Run outside debugger

## Performance Comparison

### simple_hello.c
- Original: ~0.001s
- Quick: ~0.002s (2x)
- Balanced: ~0.003s (3x)
- Maximum: ~0.005s (5x)

### calculator.c
- Original: ~0.002s
- Quick: ~0.003s (1.5x)
- Balanced: ~0.005s (2.5x)
- Maximum: ~0.008s (4x)

### password_checker.c
- Original: ~0.001s + input time
- Quick: ~0.002s + input time
- Balanced: ~0.004s + input time
- Maximum: ~0.007s + input time

## Security Analysis

### Static Analysis Resistance

**Original Code:**
- Strings visible in hex editor: ✅
- Control flow clear: ✅
- Variables meaningful: ✅
- Constants obvious: ✅

**Obfuscated Code:**
- Strings visible in hex editor: ❌
- Control flow clear: ❌
- Variables meaningful: ❌
- Constants obvious: ❌

### Dynamic Analysis Resistance

**Original Code:**
- Debugger works normally: ✅
- Breakpoints work: ✅
- Step-through easy: ✅

**Obfuscated Code:**
- Debugger detected: ✅ (exits)
- Breakpoints confusing: ✅
- Step-through difficult: ✅

## Next Steps

1. ✅ Test all three examples
2. 📊 Compare reports
3. 🔍 Examine obfuscated code
4. 🧪 Try your own programs
5. 📈 Measure performance impact

## Tips

- Start with simple_hello.c to understand basics
- Progress to calculator.c for intermediate features
- Use password_checker.c for maximum security demo
- Always verify obfuscated code works correctly
- Compare security scores across levels

---

**Happy Obfuscating!** 🛡️
