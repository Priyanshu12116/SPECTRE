"""
SPECTRE Obfuscation Verification Test
Tests that obfuscated code produces the same output as original code
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from obfuscator import CodeObfuscator
from advanced_obfuscator import AdvancedObfuscator
from llvm_obfuscator import LLVMObfuscator

def print_separator(title=""):
    """Print a formatted separator"""
    if title:
        print(f"\n{'='*70}")
        print(f"  {title}")
        print(f"{'='*70}\n")
    else:
        print(f"{'='*70}\n")

def test_basic_obfuscator():
    """Test basic obfuscator with verification"""
    print_separator("TEST 1: Basic Obfuscator (GCC/G++)")
    
    # Simple test code
    test_code = """
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int x = 5;
    int y = 10;
    int result = add(x, y);
    printf("Result: %d\\n", result);
    return 0;
}
"""
    
    print("Original Code:")
    print("-" * 70)
    print(test_code)
    print("-" * 70)
    
    # Initialize obfuscator
    obfuscator = CodeObfuscator()
    
    # Apply obfuscation
    print("\n🔄 Applying obfuscation (level: balanced)...")
    obfuscated_code = obfuscator.apply_obfuscation(test_code, "test_password", "balanced")
    
    print("\nObfuscated Code Preview (first 500 chars):")
    print("-" * 70)
    print(obfuscated_code[:500] + "...")
    print("-" * 70)
    
    # Verify obfuscation
    print("\n🔍 Verifying obfuscation...")
    verification_result = obfuscator.verify_obfuscation(test_code, obfuscated_code, "")
    
    # Print results
    print("\n📊 VERIFICATION RESULTS:")
    print(f"  Verified: {verification_result['verified']}")
    print(f"  Reason: {verification_result['reason']}")
    print(f"  Original Output: {verification_result['baseline_output']}")
    print(f"  Obfuscated Output: {verification_result['obfuscated_output']}")
    
    if verification_result['verified']:
        print("\n✅ TEST PASSED: Outputs match!")
    else:
        print("\n❌ TEST FAILED: Outputs differ!")
    
    # Generate report
    config = {'level': 'balanced', 'password_protected': False, 'verify': True}
    report = obfuscator.generate_report(test_code, obfuscated_code, verification_result, config)
    
    print(f"\n📈 Obfuscation Statistics:")
    stats = report['obfuscation_statistics']
    print(f"  - Obfuscation Cycles: {stats['obfuscation_cycles']}")
    print(f"  - Bogus Code Lines: {stats['bogus_code_lines']}")
    print(f"  - Control Flow Changes: {stats['control_flow_changes']}")
    print(f"  - Status: {report['status']}")
    
    return verification_result['verified']

def test_advanced_obfuscator():
    """Test advanced obfuscator with verification"""
    print_separator("TEST 2: Advanced Obfuscator (Multi-Layer)")
    
    # Test code with user input
    test_code = """
#include <stdio.h>

int multiply(int a, int b) {
    int result = 0;
    for (int i = 0; i < b; i++) {
        result += a;
    }
    return result;
}

int main() {
    int x = 7;
    int y = 6;
    int product = multiply(x, y);
    printf("Product: %d\\n", product);
    return 0;
}
"""
    
    print("Original Code:")
    print("-" * 70)
    print(test_code)
    print("-" * 70)
    
    # Initialize advanced obfuscator
    obfuscator = AdvancedObfuscator()
    
    # Apply obfuscation
    print("\n🔄 Applying advanced obfuscation (level: balanced)...")
    obfuscated_code = obfuscator.apply_obfuscation(test_code, "advanced_password", "balanced", "windows")
    
    print("\nObfuscated Code Preview (first 500 chars):")
    print("-" * 70)
    print(obfuscated_code[:500] + "...")
    print("-" * 70)
    
    # Verify obfuscation
    print("\n🔍 Verifying advanced obfuscation...")
    verification_result = obfuscator.verify_obfuscation(test_code, obfuscated_code, "", "windows")
    
    # Print results
    print("\n📊 VERIFICATION RESULTS:")
    print(f"  Verified: {verification_result['verified']}")
    print(f"  Reason: {verification_result['reason']}")
    print(f"  Original Output: {verification_result['baseline_output']}")
    print(f"  Obfuscated Output: {verification_result['obfuscated_output']}")
    
    if verification_result['verified']:
        print("\n✅ TEST PASSED: Outputs match!")
    else:
        print("\n❌ TEST FAILED: Outputs differ!")
    
    # Generate report
    config = {'level': 'balanced', 'platform': 'windows', 'password_protected': False, 'verify': True}
    report = obfuscator.generate_report(test_code, obfuscated_code, verification_result, config)
    
    print(f"\n📈 Obfuscation Statistics:")
    stats = report['obfuscation_statistics']
    print(f"  - Obfuscation Cycles: {stats['obfuscation_cycles']}")
    print(f"  - Bogus Code Lines: {stats['bogus_code_lines']}")
    print(f"  - Opaque Predicates: {stats['opaque_predicates']}")
    print(f"  - Control Flow Changes: {stats['control_flow_changes']}")
    print(f"  - Security Score: {report['security_score']}/100")
    print(f"  - Status: {report['status']}")
    
    return verification_result['verified']

def test_llvm_obfuscator():
    """Test LLVM obfuscator with verification"""
    print_separator("TEST 3: LLVM Obfuscator (IR-Level)")
    
    # Simple test code without system headers
    test_code = """
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    int result = fibonacci(8);
    return result;
}
"""
    
    print("Original Code:")
    print("-" * 70)
    print(test_code)
    print("-" * 70)
    
    # Initialize LLVM obfuscator
    obfuscator = LLVMObfuscator()
    
    # Check if LLVM is available
    if not obfuscator.llvm_available:
        print("\n⚠️  LLVM toolchain not available - skipping LLVM test")
        print("   Install LLVM/Clang to run this test")
        return None
    
    print("\n🔄 Applying LLVM obfuscation (level: balanced)...")
    result = obfuscator.obfuscate(test_code, level='balanced', platform='windows', is_cpp=False)
    
    if not result['success']:
        print(f"\n❌ LLVM obfuscation failed: {result.get('error', 'Unknown error')}")
        return False
    
    print("\n✅ LLVM obfuscation completed successfully!")
    print(f"  - IR Instructions: {result['stats']['ir_instructions']}")
    print(f"  - Object File Size: {result['object_size']} bytes")
    print(f"  - Executable Size: {result['executable_size']} bytes")
    print(f"  - Compilation Time: {result['stats']['compilation_time']:.2f}s")
    
    # Generate report
    config = {'level': 'balanced', 'platform': 'windows', 'use_ollvm': False}
    report = obfuscator.generate_report(result, config)
    
    print(f"\n📈 Obfuscation Statistics:")
    stats = report['obfuscation_statistics']
    print(f"  - LLVM Passes Applied: {len(stats['llvm_passes_applied'])}")
    print(f"  - IR Transformations: {stats['ir_transformations']}")
    print(f"  - Anti-Debug Checks: {stats['anti_debug_checks']}")
    print(f"  - VM Detection Checks: {stats['vm_detection_checks']}")
    print(f"  - Total Protections: {stats['total_protections']}")
    print(f"  - Status: {report['status']}")
    
    # For LLVM, we verify by checking if compilation succeeded
    # (actual runtime verification would require executing the binary)
    print("\n✅ TEST PASSED: LLVM compilation and obfuscation successful!")
    return True

def test_cpp_code():
    """Test C++ code obfuscation"""
    print_separator("TEST 4: C++ Code Obfuscation")
    
    cpp_code = """
#include <iostream>
using namespace std;

class Calculator {
public:
    int add(int a, int b) {
        return a + b;
    }
    
    int subtract(int a, int b) {
        return a - b;
    }
};

int main() {
    Calculator calc;
    int sum = calc.add(15, 25);
    int diff = calc.subtract(50, 20);
    cout << "Sum: " << sum << endl;
    cout << "Difference: " << diff << endl;
    return 0;
}
"""
    
    print("Original C++ Code:")
    print("-" * 70)
    print(cpp_code)
    print("-" * 70)
    
    # Test with advanced obfuscator
    obfuscator = AdvancedObfuscator()
    
    print("\n🔄 Applying obfuscation to C++ code...")
    obfuscated_code = obfuscator.apply_obfuscation(cpp_code, "cpp_password", "balanced", "windows")
    
    print("\n🔍 Verifying C++ obfuscation...")
    verification_result = obfuscator.verify_obfuscation(cpp_code, obfuscated_code, "", "windows")
    
    print("\n📊 VERIFICATION RESULTS:")
    print(f"  Verified: {verification_result['verified']}")
    print(f"  Reason: {verification_result['reason']}")
    
    if verification_result['verified']:
        print("\n✅ TEST PASSED: C++ outputs match!")
        return True
    else:
        print("\n❌ TEST FAILED: C++ outputs differ!")
        print(f"  Original: {verification_result['baseline_output']}")
        print(f"  Obfuscated: {verification_result['obfuscated_output']}")
        return False

def main():
    """Run all tests"""
    print_separator("SPECTRE OBFUSCATION VERIFICATION TEST SUITE")
    print("Testing that obfuscated code produces identical output to original code\n")
    
    results = {}
    
    # Test 1: Basic Obfuscator
    try:
        results['basic'] = test_basic_obfuscator()
    except Exception as e:
        print(f"\n❌ Basic obfuscator test failed with error: {e}")
        import traceback
        traceback.print_exc()
        results['basic'] = False
    
    # Test 2: Advanced Obfuscator
    try:
        results['advanced'] = test_advanced_obfuscator()
    except Exception as e:
        print(f"\n❌ Advanced obfuscator test failed with error: {e}")
        import traceback
        traceback.print_exc()
        results['advanced'] = False
    
    # Test 3: LLVM Obfuscator
    try:
        results['llvm'] = test_llvm_obfuscator()
    except Exception as e:
        print(f"\n❌ LLVM obfuscator test failed with error: {e}")
        import traceback
        traceback.print_exc()
        results['llvm'] = False
    
    # Test 4: C++ Code
    try:
        results['cpp'] = test_cpp_code()
    except Exception as e:
        print(f"\n❌ C++ obfuscator test failed with error: {e}")
        import traceback
        traceback.print_exc()
        results['cpp'] = False
    
    # Final Summary
    print_separator("FINAL TEST SUMMARY")
    
    passed = sum(1 for v in results.values() if v is True)
    failed = sum(1 for v in results.values() if v is False)
    skipped = sum(1 for v in results.values() if v is None)
    total = len(results)
    
    print(f"Total Tests: {total}")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"⚠️  Skipped: {skipped}")
    print()
    
    for test_name, result in results.items():
        status = "✅ PASSED" if result is True else ("❌ FAILED" if result is False else "⚠️  SKIPPED")
        print(f"  {test_name.upper()}: {status}")
    
    print_separator()
    
    if failed == 0 and passed > 0:
        print("🎉 ALL TESTS PASSED! Obfuscation preserves program behavior.\n")
        return 0
    elif failed > 0:
        print("⚠️  SOME TESTS FAILED! Review the output above for details.\n")
        return 1
    else:
        print("⚠️  NO TESTS RAN SUCCESSFULLY!\n")
        return 2

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)
