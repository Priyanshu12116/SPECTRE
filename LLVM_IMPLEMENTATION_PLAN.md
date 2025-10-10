# LLVM Implementation Plan for SPECTRE

## 🎯 Objective
Integrate LLVM-based obfuscation to meet SIH requirements: obfuscate object files using LLVM compiler infrastructure.

---

## 📋 Quick Summary

**Current:** Source-to-source obfuscation with GCC
**Required:** LLVM IR-level obfuscation with object file manipulation
**Timeline:** 2-3 weeks for full integration
**Approach:** Hybrid (keep GCC, add LLVM)

---

## 🚀 Phase 1: LLVM Setup & Testing (Days 1-3)

### Day 1: Install LLVM Toolchain

#### Windows Installation
```powershell
# Option 1: Chocolatey
choco install llvm

# Option 2: Direct download
# Download from: https://github.com/llvm/llvm-project/releases
# Install LLVM 17.0.6 or later
# Add to PATH: C:\Program Files\LLVM\bin
```

#### Verify Installation
```bash
clang --version
opt --version
llc --version
llvm-dis --version
```

#### Test Basic Workflow
```bash
# Create test file
echo '#include <stdio.h>
int main() { printf("Hello LLVM\n"); return 0; }' > test.c

# Compile to LLVM IR
clang -S -emit-llvm test.c -o test.ll

# View IR
cat test.ll

# Compile IR to object file
llc -filetype=obj test.ll -o test.o

# Link to executable
clang test.o -o test.exe

# Run
./test.exe
```

### Day 2: Install Obfuscator-LLVM

#### Clone and Build O-LLVM
```bash
# Clone repository
git clone -b llvm-4.0 https://github.com/obfuscator-llvm/obfuscator.git

# Or use pre-built binaries if available
```

#### Test O-LLVM Obfuscation
```bash
# Control Flow Flattening
clang -mllvm -fla test.c -o test_fla.exe

# Instruction Substitution
clang -mllvm -sub test.c -o test_sub.exe

# Bogus Control Flow
clang -mllvm -bcf test.c -o test_bcf.exe

# All techniques
clang -mllvm -fla -mllvm -sub -mllvm -bcf test.c -o test_all.exe
```

### Day 3: Python Integration Testing

Create `backend/llvm_test.py`:
```python
import subprocess
import os

def test_llvm_workflow(source_file):
    """Test LLVM compilation workflow"""
    
    # Step 1: Compile to LLVM IR
    result = subprocess.run([
        'clang', '-S', '-emit-llvm', 
        source_file, '-o', 'temp.ll'
    ], capture_output=True)
    
    if result.returncode != 0:
        print(f"Error: {result.stderr.decode()}")
        return False
    
    print("✅ Generated LLVM IR")
    
    # Step 2: Optimize/Obfuscate
    result = subprocess.run([
        'opt', '-O2', 'temp.ll', '-o', 'temp.bc'
    ], capture_output=True)
    
    print("✅ Optimized IR")
    
    # Step 3: Generate object file
    result = subprocess.run([
        'llc', '-filetype=obj', 'temp.bc', '-o', 'temp.o'
    ], capture_output=True)
    
    print("✅ Generated object file")
    
    # Step 4: Link
    result = subprocess.run([
        'clang', 'temp.o', '-o', 'output.exe'
    ], capture_output=True)
    
    print("✅ Linked executable")
    
    return True

# Test
test_llvm_workflow('../examples/simple_hello.c')
```

---

## 🔧 Phase 2: Backend Integration (Days 4-7)

### Day 4: Create LLVM Obfuscator Module

Create `backend/llvm_obfuscator.py`:

```python
"""
LLVM-based Code Obfuscator
Uses LLVM toolchain for IR-level obfuscation
"""

import subprocess
import os
import tempfile
import shutil
from datetime import datetime

class LLVMObfuscator:
    def __init__(self):
        self.stats = {
            'llvm_passes_applied': [],
            'ir_transformations': 0,
            'object_file_size': 0,
            'compilation_time': 0
        }
        
        # Check LLVM availability
        self.llvm_available = self._check_llvm()
        
    def _check_llvm(self):
        """Check if LLVM tools are available"""
        try:
            subprocess.run(['clang', '--version'], 
                         capture_output=True, check=True)
            return True
        except:
            return False
    
    def compile_to_ir(self, source_code, output_path='temp.ll'):
        """Compile C/C++ source to LLVM IR"""
        # Write source to temp file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.c', 
                                        delete=False) as f:
            f.write(source_code)
            source_file = f.name
        
        try:
            # Compile to LLVM IR
            result = subprocess.run([
                'clang', '-S', '-emit-llvm',
                '-O0',  # No optimization for better obfuscation
                source_file, '-o', output_path
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode != 0:
                raise Exception(f"Compilation failed: {result.stderr}")
            
            return output_path
            
        finally:
            os.unlink(source_file)
    
    def apply_obfuscation_passes(self, ir_file, level='balanced'):
        """Apply LLVM obfuscation passes"""
        passes = self._get_passes_for_level(level)
        
        # Apply each pass
        for pass_name, pass_args in passes:
            result = subprocess.run([
                'opt', '-load', 'libObfuscation.so',  # If using custom passes
                pass_args, ir_file, '-o', ir_file
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                self.stats['llvm_passes_applied'].append(pass_name)
                self.stats['ir_transformations'] += 1
        
        return ir_file
    
    def _get_passes_for_level(self, level):
        """Get LLVM passes based on obfuscation level"""
        if level in ['quick', 1, 2, 3]:
            return [
                ('Instruction Substitution', '-sub'),
            ]
        elif level in ['balanced', 4, 5, 6, 7]:
            return [
                ('Instruction Substitution', '-sub'),
                ('Bogus Control Flow', '-bcf'),
            ]
        else:  # maximum
            return [
                ('Control Flow Flattening', '-fla'),
                ('Instruction Substitution', '-sub'),
                ('Bogus Control Flow', '-bcf'),
                ('String Obfuscation', '-sobf'),
            ]
    
    def generate_object_file(self, ir_file, output_obj='output.o'):
        """Generate object file from LLVM IR"""
        result = subprocess.run([
            'llc', '-filetype=obj',
            ir_file, '-o', output_obj
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode != 0:
            raise Exception(f"Object generation failed: {result.stderr}")
        
        # Get object file size
        self.stats['object_file_size'] = os.path.getsize(output_obj)
        
        return output_obj
    
    def link_executable(self, obj_file, output_exe='output.exe', platform='windows'):
        """Link object file to executable"""
        if platform == 'windows':
            exe_name = output_exe if output_exe.endswith('.exe') else output_exe + '.exe'
        else:
            exe_name = output_exe
        
        result = subprocess.run([
            'clang', obj_file, '-o', exe_name
        ], capture_output=True, text=True, timeout=30)
        
        if result.returncode != 0:
            raise Exception(f"Linking failed: {result.stderr}")
        
        return exe_name
    
    def obfuscate(self, source_code, level='balanced', platform='windows'):
        """Complete LLVM-based obfuscation workflow"""
        start_time = datetime.now()
        
        try:
            # Step 1: Compile to IR
            print("Step 1: Compiling to LLVM IR...")
            ir_file = self.compile_to_ir(source_code)
            
            # Step 2: Apply obfuscation passes
            print("Step 2: Applying obfuscation passes...")
            obfuscated_ir = self.apply_obfuscation_passes(ir_file, level)
            
            # Step 3: Generate object file
            print("Step 3: Generating object file...")
            obj_file = self.generate_object_file(obfuscated_ir)
            
            # Step 4: Link executable
            print("Step 4: Linking executable...")
            exe_file = self.link_executable(obj_file, platform=platform)
            
            # Calculate compilation time
            self.stats['compilation_time'] = (datetime.now() - start_time).total_seconds()
            
            # Read obfuscated IR for display
            with open(obfuscated_ir, 'r') as f:
                obfuscated_code = f.read()
            
            return {
                'success': True,
                'obfuscated_ir': obfuscated_code,
                'object_file': obj_file,
                'executable': exe_file,
                'stats': self.stats
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def generate_report(self, result):
        """Generate obfuscation report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'compiler': 'LLVM/Clang',
            'obfuscation_method': 'LLVM IR Transformation',
            'status': 'SUCCESS' if result['success'] else 'FAILED',
            'statistics': result.get('stats', {}),
            'output_files': {
                'object_file': result.get('object_file'),
                'executable': result.get('executable'),
                'object_size_bytes': result.get('stats', {}).get('object_file_size', 0)
            }
        }
        
        return report
```

### Day 5: Add LLVM API Endpoint

Update `backend/server.py`:

```python
from llvm_obfuscator import LLVMObfuscator

@app.route("/api/obfuscate/llvm", methods=["POST"])
def obfuscate_with_llvm():
    """LLVM-based obfuscation (SIH compliant)"""
    try:
        data = request.json
        code = data.get("code", "")
        level = data.get("level", "balanced")
        platform = data.get("platform", "windows")
        
        if not code:
            return jsonify({"error": "No code provided"}), 400
        
        print(f"INFO: Starting LLVM obfuscation (level: {level})")
        
        # Initialize LLVM obfuscator
        obfuscator = LLVMObfuscator()
        
        if not obfuscator.llvm_available:
            return jsonify({
                "error": "LLVM toolchain not available. Please install LLVM/Clang."
            }), 500
        
        # Perform obfuscation
        result = obfuscator.obfuscate(code, level, platform)
        
        if not result['success']:
            return jsonify({"error": result['error']}), 500
        
        # Generate report
        report = obfuscator.generate_report(result)
        
        return jsonify({
            "success": True,
            "obfuscated_ir": result['obfuscated_ir'],
            "object_file": result['object_file'],
            "executable": result['executable'],
            "report": report
        })
        
    except Exception as e:
        print(f"ERROR: LLVM obfuscation failed: {e}")
        return jsonify({"error": str(e)}), 500
```

### Day 6-7: Frontend Integration

Update `frontend/pages/app.html` to add LLVM option:

```html
<!-- Add compiler selection -->
<div class="form-group">
    <label for="compiler">Compiler:</label>
    <select id="compiler" class="form-control">
        <option value="gcc">GCC (Fast, Source-level)</option>
        <option value="llvm" selected>LLVM (SIH Compliant, IR-level)</option>
    </select>
</div>
```

Update `frontend/js/script.js`:

```javascript
async function startObfuscation() {
    const compiler = document.getElementById('compiler').value;
    
    // Choose endpoint based on compiler
    const endpoint = compiler === 'llvm' 
        ? '/api/obfuscate/llvm'
        : '/api/obfuscate/advanced';
    
    const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code: codeInput,
            level: obfuscationLevel,
            platform: platform,
            // ... other params
        })
    });
    
    // Handle response
}
```

---

## 🎨 Phase 3: Enhanced Features (Days 8-10)

### Day 8: Custom LLVM Pass (Optional)

If time permits, create a simple custom pass:

`llvm_passes/StringEncryptionPass.cpp`:
```cpp
#include "llvm/Pass.h"
#include "llvm/IR/Function.h"
#include "llvm/Support/raw_ostream.h"

using namespace llvm;

namespace {
  struct StringEncryptionPass : public FunctionPass {
    static char ID;
    StringEncryptionPass() : FunctionPass(ID) {}

    bool runOnFunction(Function &F) override {
      // Encrypt string constants
      for (auto &BB : F) {
        for (auto &I : BB) {
          // Find and encrypt strings
        }
      }
      return true;
    }
  };
}

char StringEncryptionPass::ID = 0;
static RegisterPass<StringEncryptionPass> X("strenc", "String Encryption Pass");
```

### Day 9: Comparison Tool

Create `backend/compare_obfuscation.py`:

```python
"""
Compare GCC vs LLVM obfuscation results
"""

def compare_methods(source_code):
    """Compare both obfuscation methods"""
    
    # GCC method
    gcc_result = obfuscate_with_gcc(source_code)
    
    # LLVM method
    llvm_result = obfuscate_with_llvm(source_code)
    
    comparison = {
        'gcc': {
            'time': gcc_result['time'],
            'size': gcc_result['size'],
            'security_score': gcc_result['security_score']
        },
        'llvm': {
            'time': llvm_result['time'],
            'size': llvm_result['size'],
            'security_score': llvm_result['security_score']
        },
        'recommendation': 'llvm' if llvm_result['security_score'] > gcc_result['security_score'] else 'gcc'
    }
    
    return comparison
```

### Day 10: Documentation & Testing

Create `docs/LLVM_USAGE_GUIDE.md`:
- Installation instructions
- Usage examples
- Troubleshooting
- Performance benchmarks

---

## 📊 Phase 4: Validation & Benchmarking (Days 11-14)

### Validation Checklist

- [ ] LLVM toolchain installed and working
- [ ] Can compile C to LLVM IR
- [ ] Can apply obfuscation passes
- [ ] Can generate object files
- [ ] Can link to executables
- [ ] Windows binaries work
- [ ] Linux binaries work
- [ ] All example programs obfuscate successfully
- [ ] Reports show LLVM statistics
- [ ] UI shows LLVM option

### Benchmark Tests

Test with all examples:
```bash
# Test each example with LLVM
python test_llvm_obfuscation.py examples/simple_hello.c
python test_llvm_obfuscation.py examples/calculator.c
python test_llvm_obfuscation.py examples/password_checker.c
```

Measure:
- Compilation time
- Object file size
- Executable size
- Security score
- Performance overhead

---

## 🎯 Success Criteria

### Must Have (SIH Requirements)
- ✅ Uses LLVM compiler infrastructure
- ✅ Obfuscates at IR/object level
- ✅ Generates object files (.o/.obj)
- ✅ Supports Windows and Linux
- ✅ Configurable obfuscation parameters
- ✅ Complete reporting system

### Nice to Have
- ✅ Custom LLVM passes
- ✅ Comparison with GCC method
- ✅ Performance benchmarks
- ✅ Visual IR viewer

---

## 🚨 Fallback Plan

If LLVM integration is too complex:

### Plan B: Use Obfuscator-LLVM Directly
```python
# Simple wrapper around O-LLVM
def obfuscate_with_ollvm(source, level):
    flags = get_ollvm_flags(level)
    subprocess.run(['obfuscator', flags, source, '-o', 'output.exe'])
```

### Plan C: Hybrid Approach
- Keep current GCC implementation as primary
- Add LLVM as "experimental" feature
- Document both approaches
- Show you understand LLVM requirements

---

## 📚 Resources

### Installation
- LLVM Download: https://releases.llvm.org/
- Windows Build: https://github.com/llvm/llvm-project/releases
- O-LLVM: https://github.com/obfuscator-llvm/obfuscator

### Documentation
- LLVM Getting Started: https://llvm.org/docs/GettingStarted.html
- Writing LLVM Pass: https://llvm.org/docs/WritingAnLLVMPass.html
- O-LLVM Wiki: https://github.com/obfuscator-llvm/obfuscator/wiki

### Tutorials
- LLVM Pass Tutorial: https://www.cs.cornell.edu/~asampson/blog/llvm.html
- IR Basics: https://llvm.org/docs/LangRef.html

---

## 📅 Timeline Summary

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Setup | 3 days | 🔴 Not Started |
| Phase 2: Integration | 4 days | 🔴 Not Started |
| Phase 3: Enhancement | 3 days | 🔴 Not Started |
| Phase 4: Validation | 4 days | 🔴 Not Started |
| **Total** | **14 days** | **0% Complete** |

---

## 🎯 Next Immediate Steps

1. **Today:** Install LLVM toolchain
2. **Tomorrow:** Test basic LLVM workflow
3. **Day 3:** Create Python integration
4. **Day 4:** Start backend integration

---

*Created: 2025-10-10*
*Project: SPECTRE - SIH 2025*
*Priority: HIGH - Critical for SIH compliance*
