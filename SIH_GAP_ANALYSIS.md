# SIH Problem Statement Gap Analysis

## 📋 Problem Statement Requirements

### Core Requirement
> Build an application software which will obfuscate the **object file** (generated from C and C++ code) using **LLVM** and generate the binary for Windows and Linux platform.

### Key Requirements Analysis

---

## ✅ What We Have Implemented

### 1. **Platform Support** ✅
- ✅ Windows binary generation (.exe)
- ✅ Linux binary generation (ELF)
- ✅ Cross-platform compilation with GCC

### 2. **Obfuscation Techniques** ✅
- ✅ String encryption (AES-256)
- ✅ Control flow obfuscation
- ✅ Bogus code insertion
- ✅ Constant encoding
- ✅ Variable renaming
- ✅ Anti-debugging
- ✅ VM detection
- ✅ Opaque predicates

### 3. **Input Parameters** ✅
- ✅ Obfuscation level (1-10)
- ✅ Platform selection (Windows/Linux)
- ✅ Password for encryption
- ✅ Verification toggle
- ✅ Test input for verification
- ✅ Vault creation option

### 4. **Report Generation** ✅
All required report elements are implemented:

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| a. Log input parameters | ✅ | `report['input_params']` |
| b. Output file attributes | ✅ | Size, lines, method logged |
| c. Bogus code information | ✅ | `bogus_code_lines` tracked |
| d. Obfuscation cycles | ✅ | `obfuscation_cycles` tracked |
| e. String obfuscation count | ✅ | `strings_encrypted` tracked |
| f. Fake loops inserted | ✅ | `control_flow_changes` tracked |

### 5. **Additional Features** ✅ (Beyond Requirements)
- ✅ Web-based UI
- ✅ Code review/syntax checking
- ✅ Automatic verification
- ✅ Security scoring (0-100)
- ✅ Password-protected code vault
- ✅ JSON and HTML reports
- ✅ Real-time progress tracking

---

## ❌ Critical Gap: LLVM Integration

### What's Missing

#### **Current Implementation:**
- Uses **source-to-source transformation** (C → Obfuscated C)
- Obfuscates at **source code level**
- Compiles with **GCC** (not LLVM)
- No object file manipulation

#### **Required Implementation:**
- Should use **LLVM compiler infrastructure**
- Should obfuscate at **LLVM IR (Intermediate Representation) level**
- Should manipulate **object files (.o/.obj)**
- Should use **LLVM passes** for obfuscation

---

## 🎯 What Needs to Be Added

### Priority 1: LLVM Integration (CRITICAL)

#### 1.1 LLVM Toolchain Setup
```bash
# Required LLVM tools
- clang (LLVM C/C++ compiler)
- llvm-dis (LLVM disassembler)
- llvm-as (LLVM assembler)
- opt (LLVM optimizer - for custom passes)
- llc (LLVM compiler backend)
```

#### 1.2 LLVM-Based Workflow
```
Source Code (.c/.cpp)
    ↓
[clang] Compile to LLVM IR
    ↓
LLVM Bitcode (.bc)
    ↓
[opt] Apply Obfuscation Passes
    ↓
Obfuscated LLVM IR
    ↓
[llc] Generate Object File
    ↓
Object File (.o/.obj)
    ↓
[linker] Generate Binary
    ↓
Executable (.exe/ELF)
```

#### 1.3 Custom LLVM Obfuscation Passes

**Need to implement:**

1. **Control Flow Flattening Pass**
   ```cpp
   // LLVM Pass to flatten control flow
   class ControlFlowFlatteningPass : public FunctionPass {
       // Flatten if/else, switch statements into state machine
   };
   ```

2. **Instruction Substitution Pass**
   ```cpp
   // Replace simple instructions with complex equivalents
   // Example: x = a + b → x = (a ^ b) + 2 * (a & b)
   ```

3. **Bogus Control Flow Pass**
   ```cpp
   // Insert fake branches that never execute
   ```

4. **String Encryption Pass**
   ```cpp
   // Encrypt string constants in LLVM IR
   ```

5. **Opaque Predicate Pass**
   ```cpp
   // Insert always-true/false predicates
   ```

---

## 📊 Implementation Roadmap

### Phase 1: LLVM Setup (Week 1)
- [ ] Install LLVM toolchain (clang, opt, llc)
- [ ] Test basic LLVM compilation workflow
- [ ] Generate LLVM IR from C/C++ code
- [ ] Verify object file generation

### Phase 2: Basic LLVM Obfuscation (Week 2)
- [ ] Create LLVM pass skeleton
- [ ] Implement instruction substitution pass
- [ ] Implement bogus control flow pass
- [ ] Test with simple programs

### Phase 3: Advanced LLVM Passes (Week 3)
- [ ] Implement control flow flattening
- [ ] Implement string encryption at IR level
- [ ] Implement opaque predicates
- [ ] Add function inlining/outlining

### Phase 4: Integration (Week 4)
- [ ] Integrate LLVM workflow into backend
- [ ] Update UI to support LLVM options
- [ ] Modify report generation for LLVM stats
- [ ] Update verification system

### Phase 5: Testing & Documentation (Week 5)
- [ ] Test with all example programs
- [ ] Compare GCC vs LLVM obfuscation
- [ ] Update documentation
- [ ] Create LLVM usage guide

---

## 🔧 Technical Implementation Details

### Option 1: LLVM Pass Plugin (Recommended)
```python
# Backend integration
def obfuscate_with_llvm(source_code, level):
    # Step 1: Compile to LLVM IR
    subprocess.run(['clang', '-S', '-emit-llvm', 'input.c', '-o', 'input.ll'])
    
    # Step 2: Apply obfuscation passes
    passes = get_obfuscation_passes(level)
    subprocess.run(['opt', '-load', 'libObfuscation.so'] + passes + 
                   ['input.ll', '-o', 'obfuscated.bc'])
    
    # Step 3: Generate object file
    subprocess.run(['llc', '-filetype=obj', 'obfuscated.bc', '-o', 'output.o'])
    
    # Step 4: Link to executable
    subprocess.run(['clang', 'output.o', '-o', 'output.exe'])
```

### Option 2: Use Existing LLVM Obfuscator (O-LLVM)
```bash
# Use Obfuscator-LLVM (O-LLVM) - open source
git clone https://github.com/obfuscator-llvm/obfuscator.git
cd obfuscator
mkdir build && cd build
cmake ..
make -j4

# Use it in backend
clang -mllvm -fla -mllvm -sub -mllvm -bcf input.c -o output.exe
```

---

## 📈 Comparison: Current vs Required

| Aspect | Current (GCC) | Required (LLVM) |
|--------|---------------|-----------------|
| **Compiler** | GCC | Clang/LLVM |
| **Obfuscation Level** | Source code | LLVM IR / Object file |
| **Techniques** | Text manipulation | IR transformation |
| **Reversibility** | Medium | Hard |
| **Performance** | Good | Better (optimized) |
| **Customization** | Limited | Extensive (passes) |
| **SIH Compliance** | ❌ Partial | ✅ Full |

---

## 🎯 Recommended Action Plan

### Immediate Actions (This Week)

1. **Install LLVM Toolchain**
   ```bash
   # Windows
   choco install llvm
   
   # Or download from https://releases.llvm.org/
   ```

2. **Test LLVM Workflow**
   ```bash
   clang -S -emit-llvm hello.c -o hello.ll
   opt -O2 hello.ll -o hello.bc
   llc -filetype=obj hello.bc -o hello.o
   clang hello.o -o hello.exe
   ```

3. **Evaluate O-LLVM**
   - Download and test Obfuscator-LLVM
   - Check if it meets SIH requirements
   - Integrate if suitable

### Short-term (Next 2 Weeks)

1. **Hybrid Approach**
   - Keep current source-level obfuscation
   - Add LLVM-based obfuscation as "Advanced Mode"
   - Let users choose: GCC (fast) or LLVM (secure)

2. **Update UI**
   - Add "Compiler" dropdown: GCC / LLVM
   - Add "LLVM Passes" selection
   - Update reports to show LLVM stats

### Long-term (Before Final Submission)

1. **Full LLVM Integration**
   - Make LLVM the default
   - Implement custom passes
   - Achieve maximum obfuscation

2. **Documentation**
   - LLVM setup guide
   - Custom pass development guide
   - Comparison benchmarks

---

## 💡 Quick Win: Hybrid Solution

### Implement Both Approaches

```python
# In backend/server.py
@app.route("/api/obfuscate/llvm", methods=["POST"])
def obfuscate_with_llvm():
    """LLVM-based obfuscation (SIH compliant)"""
    # Use LLVM toolchain
    pass

@app.route("/api/obfuscate/gcc", methods=["POST"])  
def obfuscate_with_gcc():
    """GCC-based obfuscation (current implementation)"""
    # Use current method
    pass
```

**Benefits:**
- ✅ Meets SIH requirement (LLVM)
- ✅ Keeps working implementation (GCC)
- ✅ Allows comparison
- ✅ Demonstrates technical depth

---

## 📚 Resources for LLVM Implementation

### Official Documentation
- [LLVM Getting Started](https://llvm.org/docs/GettingStarted.html)
- [Writing LLVM Pass](https://llvm.org/docs/WritingAnLLVMPass.html)
- [LLVM Language Reference](https://llvm.org/docs/LangRef.html)

### Existing Projects
- [Obfuscator-LLVM](https://github.com/obfuscator-llvm/obfuscator)
- [Hikari LLVM Obfuscator](https://github.com/HikariObfuscator/Hikari)
- [OLLVM Passes](https://github.com/obfuscator-llvm/obfuscator/wiki)

### Tutorials
- [LLVM Pass Tutorial](https://www.cs.cornell.edu/~asampson/blog/llvm.html)
- [Building LLVM Passes](https://github.com/abenkhadra/llvm-pass-tutorial)

---

## ✅ Summary

### Current Status: 85% Complete

**What's Working:**
- ✅ All obfuscation techniques
- ✅ Complete reporting system
- ✅ Platform support (Windows/Linux)
- ✅ Web interface
- ✅ Verification system

**Critical Gap:**
- ❌ **LLVM integration** (15% of project)
- ❌ Object file manipulation
- ❌ LLVM IR-level obfuscation

### Recommendation

**Option A: Quick Integration (1 week)**
- Use Obfuscator-LLVM (O-LLVM) as backend
- Wrap it with Python subprocess calls
- Update UI to show LLVM is being used
- ✅ Meets SIH requirement quickly

**Option B: Custom Implementation (4-5 weeks)**
- Write custom LLVM passes
- Full control over obfuscation
- Better for learning and customization
- ⚠️ Time-intensive

**Best Approach: Start with Option A, enhance with Option B**

---

## 🚀 Next Steps

1. **Install LLVM** (Today)
2. **Test O-LLVM** (This week)
3. **Integrate with backend** (Next week)
4. **Update documentation** (Ongoing)
5. **Prepare demo** (Before SIH)

---

*Analysis Date: 2025-10-10*
*Project: SPECTRE - SIH 2025*
