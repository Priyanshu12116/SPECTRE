# How to Restart the SPECTRE Server

## The server is currently running and needs to be restarted to pick up the C++ linking fix.

### Steps to Restart:

1. **Stop the current server**:
   - Go to the terminal where the server is running
   - Press `Ctrl+C` to stop it

2. **Restart the server**:
   ```bash
   python start_server.py
   ```

3. **Test your C++ code again** in the web interface

---

## What Was Fixed

The LLVM obfuscator now correctly links C++ code using `clang++` or `g++` instead of `clang`/`gcc`, which fixes the "undefined reference to std::cout" error.

### Before (broken):
```python
cmd = ['gcc', obj_file, '-o', exe_name]  # ❌ Won't link C++ stdlib
```

### After (fixed):
```python
if is_cpp:
    cmd = ['g++', obj_file, '-o', exe_name]  # ✅ Links C++ stdlib
else:
    cmd = ['gcc', obj_file, '-o', exe_name]
```

---

## Quick Test

After restarting, try this C++ code:

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello World" << endl;
    return 0;
}
```

It should now obfuscate successfully! ✅
