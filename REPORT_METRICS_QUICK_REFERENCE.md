# SPECTRE Report Metrics - Quick Reference Guide

## 📊 SIH Requirements Checklist

### ✅ a. Input Parameters Logged
All input parameters are captured and displayed:
- Obfuscation level (quick/balanced/maximum)
- Target platform (Windows/Linux/macOS)
- Compiler used (GCC/LLVM/Advanced)
- Password protection status
- Verification enabled status
- Submission timestamp
- Protection layers count

**Location in Report**: "INPUT PARAMETERS" section

---

### ✅ b. Output File Attributes
Comprehensive output file information:
- Original & obfuscated file sizes (bytes)
- Size increase percentage
- Line counts (original vs obfuscated)
- Lines added during obfuscation
- Object/executable sizes (LLVM mode)
- IR instruction count (LLVM mode)
- Encryption algorithm used
- Control flow method applied
- File format (PE/ELF)
- Compilation time

**Location in Report**: "OUTPUT FILE ATTRIBUTES" section

---

### ✅ c. Bogus Code Information
Detailed fake code generation metrics:
- **Total bogus code lines**: Count of fake code inserted
- **Percentage of total code**: How much is bogus
- **Types included**:
  - Fake function calls
  - Unreachable branches
  - Opaque predicates
  - Dead code paths

**Location in Report**: 
- Highlighted metric box in "OBFUSCATION STATISTICS"
- Dedicated "Bogus Code Generation Summary" section

---

### ✅ d. Obfuscation Cycles
Number of transformation passes:
- **Obfuscation cycles**: Total iterations (1-3 typically)
- **LLVM passes applied**: List of specific passes (LLVM mode)
- **Pass categories**: Optimization vs obfuscation passes

**Location in Report**: 
- Highlighted metric box in "OBFUSCATION STATISTICS"
- "LLVM Passes Applied" subsection (LLVM mode)

---

### ✅ e. String Obfuscation/Encryption
String protection details:
- **Strings encrypted**: Count of encrypted string literals
- **Encryption method**: AES-256-CBC with PBKDF2
- **Protection techniques**:
  - Runtime decryption
  - Base64 encoding
  - IV randomization

**Location in Report**: Highlighted metric box in "OBFUSCATION STATISTICS"

---

### ✅ f. Fake Loops Inserted
Decoy loop structure information:
- **Fake loops inserted**: Count of fake loops
- **Loop types**:
  - Opaque predicate loops (always false)
  - Unreachable loops
  - Control flow flattening loops
- **Purpose**: Complicate control flow analysis

**Location in Report**: 
- Highlighted metric box in "OBFUSCATION STATISTICS"
- Dedicated "Fake Loop Structures Summary" section

---

## 📈 Additional Metrics Available

### Transformation Metrics
| Metric | Description |
|--------|-------------|
| Control Flow Changes | Number of control flow modifications |
| Constants Encoded | Number of constants obfuscated |
| Variables Renamed | Number of variables renamed |
| Functions Virtualized | Functions converted to virtual machine |
| IR Transformations | LLVM IR-level transformations |
| Total Transformations | Sum of all transformations |

### Anti-Analysis Protections
| Metric | Description |
|--------|-------------|
| Anti-Debug Checks | Debugger detection mechanisms |
| VM Detection Checks | Virtual machine detection |
| Sandbox Detection | Sandbox environment detection |
| Timing Checks | Timing-based analysis detection |
| Total Protections | Sum of all landmine protections |

### LLVM-Specific Metrics
| Metric | Description |
|--------|-------------|
| IR Instructions | Number of LLVM IR instructions |
| Basic Blocks Added | Additional basic blocks created |
| Functions Obfuscated | Functions transformed at IR level |
| IR Verification | Whether IR was verified |

---

## 🎨 Visual Guide

### Color Coding in Reports

| Color | Purpose | Example |
|-------|---------|---------|
| 🟢 Green | Success, key metrics | Status: SUCCESS, metric boxes |
| 🔵 Blue | Information | Code vault password, info boxes |
| 🟡 Yellow | Bogus code summary | Fake code generation details |
| 🟣 Purple | Fake loops summary | Loop structure details |
| 🔴 Red | Warnings, protections | Landmine protection warnings |

### Section Layout

```
┌─────────────────────────────────────┐
│  SPECTRE Obfuscation Report         │ ← Header (Green)
├─────────────────────────────────────┤
│  Executive Summary                  │
│  • Quick stats                      │
│  • Timestamp                        │
├─────────────────────────────────────┤
│  Code Vault Password (if enabled)   │ ← Blue box
├─────────────────────────────────────┤
│  INPUT PARAMETERS                   │ ← Requirement a
│  • All input settings logged        │
├─────────────────────────────────────┤
│  OUTPUT FILE ATTRIBUTES             │ ← Requirement b
│  • Size, method, compilation info   │
├─────────────────────────────────────┤
│  OBFUSCATION STATISTICS & METRICS   │
│  ┌───────────────────────────────┐  │
│  │ Obfuscation Cycles: 3         │  │ ← Requirement d
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ Strings Encrypted: 12         │  │ ← Requirement e
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ Bogus Code Lines: 45 (35%)    │  │ ← Requirement c
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │ Fake Loops Inserted: 8        │  │ ← Requirement f
│  └───────────────────────────────┘  │
│                                     │
│  Additional Transformation Details  │
│  • Control flow changes             │
│  • Constants encoded                │
│  • Variables renamed                │
├─────────────────────────────────────┤
│  Bogus Code Generation Summary      │ ← Yellow box
│  Detailed explanation of fake code  │
├─────────────────────────────────────┤
│  Fake Loop Structures Summary       │ ← Purple box
│  Detailed explanation of fake loops │
├─────────────────────────────────────┤
│  LANDMINE PROTECTION (if enabled)   │ ← Red box
│  Anti-analysis protection details   │
├─────────────────────────────────────┤
│  Verification Results               │
│  • Output comparison                │
├─────────────────────────────────────┤
│  Footer: Page numbers, Report ID    │
└─────────────────────────────────────┘
```

---

## 🔍 How to Find Specific Information

### "How many obfuscation passes were done?"
→ Look for **"Obfuscation Cycles"** in the green highlighted box

### "How much fake code was added?"
→ Look for **"Bogus Code Lines"** in the green highlighted box  
→ Read the yellow **"Bogus Code Generation Summary"** box

### "Were my strings encrypted?"
→ Look for **"Strings Encrypted"** in the green highlighted box

### "How many fake loops were inserted?"
→ Look for **"Fake Loops Inserted"** in the green highlighted box  
→ Read the purple **"Fake Loop Structures Summary"** box

### "What was the file size increase?"
→ Look in **"OUTPUT FILE ATTRIBUTES"** section  
→ Find **"Size Increase"** percentage

### "What compiler was used?"
→ Look in **"INPUT PARAMETERS"** section  
→ Find **"Compiler"** field

### "How long did compilation take?"
→ Look in **"OUTPUT FILE ATTRIBUTES"** section  
→ Find **"Compilation Time"** field

---

## 💡 Tips for Reading Reports

1. **Start with Executive Summary** - Get the big picture first
2. **Check Status** - Ensure obfuscation succeeded
3. **Review Key Metrics** - Focus on the 4 green highlighted boxes
4. **Read Detailed Sections** - Dive into colored summary boxes
5. **Verify Results** - Check verification section at the end
6. **Save the Password** - If vault was created, note the password

---

## 📥 Downloading Reports

1. Complete obfuscation in the SPECTRE tool
2. Click **"Download Report (PDF)"** button
3. Report saves as: `SPECTRE_Obfuscation_Report_YYYY-MM-DD.pdf`
4. Open with any PDF reader

---

## ⚠️ Important Notes

- **Save the Code Vault Password**: You'll need it to run the protected executable
- **Keep Reports Secure**: They contain detailed information about your obfuscation
- **Compare Reports**: Track improvements across different obfuscation runs
- **Check Verification**: Always verify that obfuscated code works correctly

---

## 📞 Need Help?

If you can't find a specific metric:
1. Check the **"Additional Transformation Details"** section
2. Look for LLVM-specific metrics (if using LLVM mode)
3. Review the **ENHANCED_REPORT_DOCUMENTATION.md** for full details
4. Contact SPECTRE support team

---

**Quick Reference Version**: 1.0  
**Compatible with**: SPECTRE v1.0+  
**Last Updated**: October 14, 2025
