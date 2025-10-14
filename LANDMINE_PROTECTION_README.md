# 🔥 SPECTRE Landmine Protection System

## Overview
SPECTRE now includes **aggressive anti-analysis landmines** that protect your obfuscated code from reverse engineering attempts in VMs, sandboxes, and debuggers.

## ⚠️ WARNING - AGGRESSIVE COUNTERMEASURES ACTIVE

When the obfuscated code detects it's running in a VM, sandbox, or debugger, it will:

### 1. **Device Banning** 🚫
- Records hardware fingerprint (HWID/Machine ID)
- Writes ban marker to system registry/filesystem
- Permanently marks the device as banned

### 2. **System Crash** 💥
- **Windows**: Triggers BSOD using `NtRaiseHardError`
- **Linux**: Attempts kernel panic via `reboot()` syscall
- **Fallback**: Fork bomb (resource exhaustion)
- **Extreme**: Disk space filling attack

### 3. **Memory Corruption** 🧨
- Null pointer dereference
- Critical memory region overwrite
- Segmentation fault trigger

## 🛡️ Protection Layers

### Anti-Debugging (4-5 checks)
- `IsDebuggerPresent()` API check
- `CheckRemoteDebuggerPresent()` check
- PEB (Process Environment Block) inspection
- NtGlobalFlag detection
- ptrace self-test (Linux)
- TracerPid monitoring (Linux)

### VM Detection (5-7 checks)
- CPUID hypervisor bit check
- VMware I/O port detection
- VirtualBox registry keys
- VM-specific driver files (vmmouse.sys, vmhgfs.sys)
- DMI product name inspection (Linux)
- /proc/cpuinfo hypervisor flag (Linux)

### Sandbox Detection (4-6 checks)
- System uptime check (<10 minutes = sandbox)
- CPU count check (sandboxes often have 1 CPU)
- RAM size check (<2GB = sandbox)
- Username pattern matching (sandbox/malware/virus)
- Cuckoo sandbox detection (Linux)
- Environment variable checks

### Timing-Based Detection (1 check)
- Execution timing analysis
- Detects debugger slowdown (>10ms threshold)

## 📊 Integration Status

✅ **Fully Integrated** into LLVM obfuscation pipeline:
- `anti_analysis.py` - Enhanced with aggressive countermeasures
- `llvm_obfuscator.py` - Integrated as Step 0/5
- `pdf-report.js` - Shows landmine statistics in PDF report

## 🎯 How It Works

```
User uploads code → SPECTRE obfuscates
         ↓
Step 0: Inject Landmines
         ↓
Step 1: Compile to LLVM IR
         ↓
Step 2: Apply obfuscation passes
         ↓
Step 3: Generate object file
         ↓
Step 4: Link executable
         ↓
Step 5: Finalize protection
         ↓
Protected executable with landmines
```

## 📝 PDF Report Features

The PDF report now includes:
- **Landmine Protection Summary** (red box)
- Anti-debug check count
- VM detection check count
- Sandbox detection check count
- Timing check count
- Total landmine protections

## 🔧 Technical Details

### Windows Landmines
```c
// Device banning via registry
HKEY_LOCAL_MACHINE\SOFTWARE\SPECTRE_BANNED
  - BannedDevice: <HWID>
  - Reason: VM_SANDBOX_DETECTED

// System crash via BSOD
NtRaiseHardError(0xC0000022, ...)

// Fork bomb
while(1) CreateProcess("cmd.exe /c start", ...)
```

### Linux Landmines
```c
// Device banning via file
/tmp/.spectre_banned
  - Machine ID from /etc/machine-id
  - Reason: VM_SANDBOX_DETECTED

// System crash
reboot(LINUX_REBOOT_CMD_RESTART)

// Fork bomb
while(1) fork()
```

## ⚖️ Legal Disclaimer

**IMPORTANT**: These aggressive countermeasures are designed for legitimate software protection only. Use responsibly and ensure:

1. ✅ You have legal right to protect the software
2. ✅ End users are properly informed about protection mechanisms
3. ✅ You comply with local laws regarding anti-tampering measures
4. ✅ You have proper EULA/Terms of Service

**Misuse of these features may have legal consequences.**

## 🚀 Usage

The landmine protection is **automatically enabled** when you obfuscate code through SPECTRE. No additional configuration needed!

### To Disable (if needed)
Edit `llvm_obfuscator.py`:
```python
# Change aggressive_mode to False
anti_analysis = AntiAnalysisInjector(aggressive_mode=False)
```

## 📈 Statistics Tracked

- `anti_debug_checks`: Number of anti-debugging checks
- `vm_detection_checks`: Number of VM detection checks
- `sandbox_detection_checks`: Number of sandbox detection checks
- `timing_checks`: Number of timing-based checks
- `total_protections`: Total landmine protections injected

## 🎓 For SIH Judges

This landmine protection system demonstrates:
- ✅ Advanced anti-reverse engineering techniques
- ✅ Multi-layered security approach
- ✅ Platform-specific implementations (Windows/Linux)
- ✅ Real-world threat mitigation
- ✅ Comprehensive reporting and transparency

---

**SPECTRE - Securing Code Through Persistent Reverse Engineering Countermeasures**
