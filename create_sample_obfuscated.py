"""
Create a sample obfuscated file for testing
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from obfuscator import CodeObfuscator

# Read original file
with open('sample_original.c', 'r') as f:
    original_code = f.read()

print("Creating obfuscated version of sample_original.c...")

# Obfuscate
obfuscator = CodeObfuscator()
obfuscated_code = obfuscator.apply_obfuscation(original_code, "sample_password", "balanced")

# Save obfuscated version
with open('sample_obfuscated.c', 'w') as f:
    f.write(obfuscated_code)

print("✅ Created sample_obfuscated.c")
print(f"   Original size: {len(original_code)} bytes")
print(f"   Obfuscated size: {len(obfuscated_code)} bytes")
print(f"   Increase: {((len(obfuscated_code) - len(original_code)) / len(original_code) * 100):.1f}%")
print()
print("Now you can test with:")
print("  python test_downloaded_file.py sample_original.c sample_obfuscated.c")
