"""
Visual Demo: Before and After Obfuscation Verification
Shows that obfuscated code produces identical output
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from obfuscator import CodeObfuscator

# Simple test program
original_code = """
#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    printf("Factorial of 5 = %d\\n", factorial(5));
    printf("Factorial of 7 = %d\\n", factorial(7));
    return 0;
}
"""

print("\n" + "="*80)
print(" OBFUSCATION VERIFICATION DEMO")
print("="*80 + "\n")

print("ORIGINAL CODE:")
print("-"*80)
print(original_code)
print("-"*80 + "\n")

# Create obfuscator
obfuscator = CodeObfuscator()

# Apply obfuscation
print("⏳ Applying obfuscation...")
obfuscated_code = obfuscator.apply_obfuscation(original_code, "demo_password", "balanced")
print("✅ Obfuscation complete!\n")

print("OBFUSCATED CODE (preview):")
print("-"*80)
lines = obfuscated_code.split('\n')
for i, line in enumerate(lines[:25], 1):  # Show first 25 lines
    print(f"{i:3d} | {line}")
if len(lines) > 25:
    print(f"... ({len(lines) - 25} more lines)")
print("-"*80 + "\n")

# Verify outputs match
print("⏳ Compiling and running both versions...")
verification = obfuscator.verify_obfuscation(original_code, obfuscated_code, "")

print("\n" + "="*80)
print(" VERIFICATION RESULTS")
print("="*80 + "\n")

print(f"Status: {verification['reason']}\n")

print("ORIGINAL OUTPUT:")
print("  " + (verification['baseline_output'] or '(no output)').replace('\n', '\n  '))
print()

print("OBFUSCATED OUTPUT:")
print("  " + (verification['obfuscated_output'] or '(no output)').replace('\n', '\n  '))
print()

if verification['verified']:
    print("✅ VERIFICATION PASSED!")
    print("   The obfuscated code produces IDENTICAL output to the original.")
else:
    print("❌ VERIFICATION FAILED!")
    print("   The outputs differ.")

# Show statistics
stats = obfuscator.get_stats()
print("\n" + "="*80)
print(" OBFUSCATION STATISTICS")
print("="*80 + "\n")
print(f"  Obfuscation Cycles:    {stats['obfuscation_cycles']}")
print(f"  Bogus Code Lines:      {stats['bogus_code_lines']}")
print(f"  Control Flow Changes:  {stats['control_flow_changes']}")
print(f"  Original Lines:        {len(original_code.split(chr(10)))}")
print(f"  Obfuscated Lines:      {len(obfuscated_code.split(chr(10)))}")
print(f"  Lines Added:           {len(obfuscated_code.split(chr(10))) - len(original_code.split(chr(10)))}")

print("\n" + "="*80 + "\n")
