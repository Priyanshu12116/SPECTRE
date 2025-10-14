"""
Quick Obfuscation Verification Test
Simple test to verify obfuscated code produces same output
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from obfuscator import CodeObfuscator
from advanced_obfuscator import AdvancedObfuscator

print("=" * 80)
print("SPECTRE OBFUSCATION VERIFICATION TEST")
print("=" * 80)
print()

# Test Code
test_code = """
#include <stdio.h>

int main() {
    int a = 10;
    int b = 20;
    int sum = a + b;
    printf("Sum: %d\\n", sum);
    printf("Product: %d\\n", a * b);
    return 0;
}
"""

print("TEST CODE:")
print("-" * 80)
print(test_code)
print("-" * 80)
print()

# Test 1: Basic Obfuscator
print("TEST 1: Basic Obfuscator")
print("-" * 80)
obf1 = CodeObfuscator()
obf_code1 = obf1.apply_obfuscation(test_code, "password123", "balanced")
result1 = obf1.verify_obfuscation(test_code, obf_code1, "")

print(f"Verified: {result1['verified']}")
print(f"Original Output:    {repr(result1['baseline_output'])}")
print(f"Obfuscated Output:  {repr(result1['obfuscated_output'])}")
print(f"Match: {'YES ✓' if result1['verified'] else 'NO ✗'}")
print()

# Test 2: Advanced Obfuscator
print("TEST 2: Advanced Obfuscator")
print("-" * 80)
obf2 = AdvancedObfuscator()
obf_code2 = obf2.apply_obfuscation(test_code, "password456", "balanced", "windows")
result2 = obf2.verify_obfuscation(test_code, obf_code2, "", "windows")

print(f"Verified: {result2['verified']}")
print(f"Original Output:    {repr(result2['baseline_output'])}")
print(f"Obfuscated Output:  {repr(result2['obfuscated_output'])}")
print(f"Match: {'YES ✓' if result2['verified'] else 'NO ✗'}")
print()

# Summary
print("=" * 80)
print("SUMMARY")
print("=" * 80)
all_passed = result1['verified'] and result2['verified']
print(f"Basic Obfuscator:    {'PASSED ✓' if result1['verified'] else 'FAILED ✗'}")
print(f"Advanced Obfuscator: {'PASSED ✓' if result2['verified'] else 'FAILED ✗'}")
print()
if all_passed:
    print("🎉 ALL TESTS PASSED!")
    print("Obfuscated code produces IDENTICAL output to original code.")
else:
    print("⚠️ SOME TESTS FAILED!")
print("=" * 80)
