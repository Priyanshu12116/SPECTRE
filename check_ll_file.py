"""
Check if a .ll file has the password hash embedded
"""
import sys
import os

def check_ll_file(filepath):
    """Check if .ll file has password hash"""
    
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filepath}")
        return
    
    print("=" * 80)
    print("CHECKING .LL FILE FOR PASSWORD HASH")
    print("=" * 80)
    print(f"File: {filepath}")
    print()
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"File size: {len(content)} bytes")
    print(f"Lines: {len(content.split(chr(10)))}")
    print()
    
    # Check for password hash
    if '; SPECTRE_PASSWORD_HASH:' in content:
        print("✅ PASSWORD HASH FOUND!")
        print()
        print("First 10 lines of file:")
        print("-" * 80)
        for i, line in enumerate(content.split('\n')[:10], 1):
            if 'SPECTRE_PASSWORD_HASH' in line:
                print(f"{i:3}: {line} ← PASSWORD HASH HERE")
            else:
                print(f"{i:3}: {line}")
        print("-" * 80)
        print()
        print("✅ This file has password protection!")
        print("   Only the correct password will allow compilation.")
        
    else:
        print("❌ NO PASSWORD HASH FOUND!")
        print()
        print("First 10 lines of file:")
        print("-" * 80)
        for i, line in enumerate(content.split('\n')[:10], 1):
            print(f"{i:3}: {line}")
        print("-" * 80)
        print()
        print("⚠️  This file does NOT have password protection!")
        print("   This is an OLD file from before the password fix.")
        print()
        print("Solution:")
        print("1. Re-obfuscate your code with the latest SPECTRE")
        print("2. The new .ll file will have password protection")
        print("3. Then test compilation with wrong/correct passwords")


if __name__ == "__main__":
    print()
    
    if len(sys.argv) > 1:
        filepath = sys.argv[1].strip('"')
    else:
        filepath = input("Enter path to .ll file: ").strip().strip('"')
    
    print()
    check_ll_file(filepath)
    print()
    input("Press Enter to exit...")
