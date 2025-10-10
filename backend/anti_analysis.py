"""
SPECTRE Advanced Anti-Analysis
Detects and frustrates debuggers, virtual machines, and sandboxes
"""

import random
from typing import Dict, List, Tuple

class AntiAnalysisInjector:
    """
    Injects anti-debugging, anti-VM, and anti-sandbox code
    """
    
    def __init__(self):
        self.checks_injected = []
    
    def inject_all_protections(self, code: str, platform: str = 'windows') -> Tuple[str, Dict]:
        """
        Inject all anti-analysis protections
        
        Args:
            code: Source code
            platform: 'windows' or 'linux'
        
        Returns:
            Tuple of (protected_code, statistics)
        """
        stats = {
            'anti_debug_checks': 0,
            'vm_detection_checks': 0,
            'sandbox_detection_checks': 0,
            'timing_checks': 0,
            'total_protections': 0
        }
        
        protected_code = code
        
        # Add headers
        protected_code = self._add_headers(protected_code, platform)
        
        # Inject anti-debugging
        protected_code, debug_stats = self.inject_anti_debugging(protected_code, platform)
        stats['anti_debug_checks'] = debug_stats['checks_added']
        
        # Inject VM detection
        protected_code, vm_stats = self.inject_vm_detection(protected_code, platform)
        stats['vm_detection_checks'] = vm_stats['checks_added']
        
        # Inject sandbox detection
        protected_code, sandbox_stats = self.inject_sandbox_detection(protected_code, platform)
        stats['sandbox_detection_checks'] = sandbox_stats['checks_added']
        
        # Inject timing checks
        protected_code, timing_stats = self.inject_timing_checks(protected_code)
        stats['timing_checks'] = timing_stats['checks_added']
        
        stats['total_protections'] = sum([
            stats['anti_debug_checks'],
            stats['vm_detection_checks'],
            stats['sandbox_detection_checks'],
            stats['timing_checks']
        ])
        
        return protected_code, stats
    
    def _add_headers(self, code: str, platform: str) -> str:
        """Add necessary headers for anti-analysis"""
        headers = ""
        
        if platform == 'windows':
            headers = """
#ifdef _WIN32
#include <windows.h>
#include <winternl.h>
#include <intrin.h>
#endif
"""
        else:  # linux
            headers = """
#ifdef __linux__
#include <sys/ptrace.h>
#include <unistd.h>
#include <sys/stat.h>
#include <fcntl.h>
#endif
"""
        
        # Add to beginning of code
        return headers + code
    
    def inject_anti_debugging(self, code: str, platform: str) -> Tuple[str, Dict]:
        """Inject anti-debugging checks"""
        stats = {'checks_added': 0}
        
        if platform == 'windows':
            anti_debug_code = """
// Anti-Debugging Checks
int _check_debugger_present() {
#ifdef _WIN32
    // Check 1: IsDebuggerPresent
    if (IsDebuggerPresent()) {
        return 1;
    }
    
    // Check 2: CheckRemoteDebuggerPresent
    BOOL isDebuggerPresent = FALSE;
    CheckRemoteDebuggerPresent(GetCurrentProcess(), &isDebuggerPresent);
    if (isDebuggerPresent) {
        return 1;
    }
    
    // Check 3: PEB check
    BOOL isDebugged = FALSE;
    __try {
        isDebugged = *(BOOL*)((BYTE*)__readgsqword(0x60) + 0x02);
    } __except(EXCEPTION_EXECUTE_HANDLER) {
        isDebugged = FALSE;
    }
    if (isDebugged) {
        return 1;
    }
    
    // Check 4: NtGlobalFlag
    DWORD ntGlobalFlag = *(DWORD*)((BYTE*)__readgsqword(0x60) + 0xBC);
    if (ntGlobalFlag & 0x70) {
        return 1;
    }
#endif
    return 0;
}
"""
            stats['checks_added'] = 4
        else:  # linux
            anti_debug_code = """
// Anti-Debugging Checks (Linux)
int _check_debugger_present() {
#ifdef __linux__
    // Check 1: ptrace self-test
    if (ptrace(PTRACE_TRACEME, 0, 1, 0) < 0) {
        return 1;  // Already being traced
    }
    ptrace(PTRACE_DETACH, 0, 1, 0);
    
    // Check 2: Check /proc/self/status for TracerPid
    FILE* f = fopen("/proc/self/status", "r");
    if (f) {
        char line[256];
        while (fgets(line, sizeof(line), f)) {
            if (strncmp(line, "TracerPid:", 10) == 0) {
                int pid = atoi(line + 10);
                fclose(f);
                if (pid != 0) return 1;
                break;
            }
        }
        fclose(f);
    }
#endif
    return 0;
}
"""
            stats['checks_added'] = 2
        
        # Insert before main function
        protected_code = self._insert_before_main(code, anti_debug_code)
        
        # Add check call in main
        protected_code = self._add_check_in_main(protected_code, 
            "if (_check_debugger_present()) { return -1; }")
        
        return protected_code, stats
    
    def inject_vm_detection(self, code: str, platform: str) -> Tuple[str, Dict]:
        """Inject VM detection checks"""
        stats = {'checks_added': 0}
        
        if platform == 'windows':
            vm_detection_code = """
// VM Detection Checks
int _check_vm_environment() {
#ifdef _WIN32
    // Check 1: CPUID hypervisor bit
    int cpuInfo[4] = {0};
    __cpuid(cpuInfo, 1);
    if ((cpuInfo[2] >> 31) & 1) {
        return 1;  // Hypervisor present
    }
    
    // Check 2: VMware I/O port
    __try {
        __asm {
            push edx
            push ecx
            push ebx
            mov eax, 'VMXh'
            mov ebx, 0
            mov ecx, 10
            mov edx, 'VX'
            in eax, dx
            pop ebx
            pop ecx
            pop edx
        }
        return 1;  // VMware detected
    } __except(EXCEPTION_EXECUTE_HANDLER) {
        // Not VMware
    }
    
    // Check 3: Registry keys for VirtualBox
    HKEY hKey;
    if (RegOpenKeyExA(HKEY_LOCAL_MACHINE, 
        "SOFTWARE\\Oracle\\VirtualBox Guest Additions", 
        0, KEY_READ, &hKey) == ERROR_SUCCESS) {
        RegCloseKey(hKey);
        return 1;  // VirtualBox detected
    }
    
    // Check 4: Check for VM-specific files
    if (GetFileAttributesA("C:\\\\windows\\\\system32\\\\drivers\\\\vmmouse.sys") != INVALID_FILE_ATTRIBUTES) {
        return 1;  // VMware mouse driver
    }
    if (GetFileAttributesA("C:\\\\windows\\\\system32\\\\drivers\\\\vmhgfs.sys") != INVALID_FILE_ATTRIBUTES) {
        return 1;  // VMware HGFS driver
    }
#endif
    return 0;
}
"""
            stats['checks_added'] = 5
        else:  # linux
            vm_detection_code = """
// VM Detection Checks (Linux)
int _check_vm_environment() {
#ifdef __linux__
    // Check 1: DMI information
    FILE* f = fopen("/sys/class/dmi/id/product_name", "r");
    if (f) {
        char product[256];
        if (fgets(product, sizeof(product), f)) {
            if (strstr(product, "VirtualBox") || 
                strstr(product, "VMware") ||
                strstr(product, "QEMU")) {
                fclose(f);
                return 1;
            }
        }
        fclose(f);
    }
    
    // Check 2: Check for hypervisor in /proc/cpuinfo
    f = fopen("/proc/cpuinfo", "r");
    if (f) {
        char line[256];
        while (fgets(line, sizeof(line), f)) {
            if (strstr(line, "hypervisor")) {
                fclose(f);
                return 1;
            }
        }
        fclose(f);
    }
#endif
    return 0;
}
"""
            stats['checks_added'] = 2
        
        protected_code = self._insert_before_main(code, vm_detection_code)
        protected_code = self._add_check_in_main(protected_code,
            "if (_check_vm_environment()) { return -1; }")
        
        return protected_code, stats
    
    def inject_sandbox_detection(self, code: str, platform: str) -> Tuple[str, Dict]:
        """Inject sandbox detection checks"""
        stats = {'checks_added': 0}
        
        if platform == 'windows':
            sandbox_code = """
// Sandbox Detection Checks
int _check_sandbox_environment() {
#ifdef _WIN32
    // Check 1: Low uptime (sandbox often has low uptime)
    DWORD uptime = GetTickCount();
    if (uptime < 600000) {  // Less than 10 minutes
        return 1;
    }
    
    // Check 2: Check number of processors
    SYSTEM_INFO sysInfo;
    GetSystemInfo(&sysInfo);
    if (sysInfo.dwNumberOfProcessors < 2) {
        return 1;  // Sandboxes often have 1 CPU
    }
    
    // Check 3: Check RAM size
    MEMORYSTATUSEX memInfo;
    memInfo.dwLength = sizeof(MEMORYSTATUSEX);
    GlobalMemoryStatusEx(&memInfo);
    if (memInfo.ullTotalPhys < 2ULL * 1024 * 1024 * 1024) {  // Less than 2GB
        return 1;
    }
    
    // Check 4: Check for common sandbox usernames
    char username[256];
    DWORD size = sizeof(username);
    GetUserNameA(username, &size);
    if (strstr(username, "sandbox") || 
        strstr(username, "malware") ||
        strstr(username, "virus")) {
        return 1;
    }
#endif
    return 0;
}
"""
            stats['checks_added'] = 4
        else:  # linux
            sandbox_code = """
// Sandbox Detection Checks (Linux)
int _check_sandbox_environment() {
#ifdef __linux__
    // Check 1: Check for common sandbox paths
    if (access("/usr/bin/cuckoo", F_OK) == 0) {
        return 1;
    }
    
    // Check 2: Check environment variables
    if (getenv("SANDBOX") != NULL) {
        return 1;
    }
#endif
    return 0;
}
"""
            stats['checks_added'] = 2
        
        protected_code = self._insert_before_main(code, sandbox_code)
        protected_code = self._add_check_in_main(protected_code,
            "if (_check_sandbox_environment()) { return -1; }")
        
        return protected_code, stats
    
    def inject_timing_checks(self, code: str) -> Tuple[str, Dict]:
        """Inject timing-based anti-debugging checks"""
        stats = {'checks_added': 0}
        
        timing_code = """
// Timing-based Anti-Debugging
#include <time.h>
int _check_timing_attack() {
    clock_t start = clock();
    
    // Do some dummy work
    volatile int dummy = 0;
    for (int i = 0; i < 1000; i++) {
        dummy += i;
    }
    
    clock_t end = clock();
    double elapsed = ((double)(end - start)) / CLOCKS_PER_SEC;
    
    // If execution took too long, debugger might be present
    if (elapsed > 0.01) {  // 10ms threshold
        return 1;
    }
    
    return 0;
}
"""
        stats['checks_added'] = 1
        
        protected_code = self._insert_before_main(code, timing_code)
        protected_code = self._add_check_in_main(protected_code,
            "if (_check_timing_attack()) { return -1; }")
        
        return protected_code, stats
    
    def _insert_before_main(self, code: str, insertion: str) -> str:
        """Insert code before main function"""
        # Find main function
        main_pattern = r'int\s+main\s*\('
        match = re.search(main_pattern, code)
        
        if match:
            pos = match.start()
            return code[:pos] + insertion + "\n\n" + code[pos:]
        
        return insertion + "\n\n" + code
    
    def _add_check_in_main(self, code: str, check_code: str) -> str:
        """Add check call at the beginning of main"""
        # Find opening brace of main
        main_pattern = r'int\s+main\s*\([^)]*\)\s*\{'
        match = re.search(main_pattern, code)
        
        if match:
            pos = match.end()
            return code[:pos] + "\n    " + check_code + "\n" + code[pos:]
        
        return code


# Example usage
if __name__ == "__main__":
    import re
    
    test_code = """
#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}
"""
    
    print("=" * 70)
    print("Advanced Anti-Analysis - Demo")
    print("=" * 70)
    
    injector = AntiAnalysisInjector()
    
    print("\n🛡️ Injecting Anti-Analysis Protections (Windows)...")
    protected_code, stats = injector.inject_all_protections(test_code, 'windows')
    
    print(f"\n📊 Protection Statistics:")
    print(f"   Anti-Debug Checks: {stats['anti_debug_checks']}")
    print(f"   VM Detection Checks: {stats['vm_detection_checks']}")
    print(f"   Sandbox Detection Checks: {stats['sandbox_detection_checks']}")
    print(f"   Timing Checks: {stats['timing_checks']}")
    print(f"   Total Protections: {stats['total_protections']}")
    
    print("\n✅ Anti-analysis protection complete!")
    print("\n📝 Protected Code Preview:")
    print("-" * 70)
    print(protected_code[:800] + "...")
    print("=" * 70)
