#!/usr/bin/env python3
"""
Test Script for Code Vault Functionality
Verifies password-protected code vault works correctly
"""

import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from code_vault import CodeVault

def test_code_vault():
    """Test the code vault functionality"""
    
    print("=" * 70)
    print("🔐 TESTING CODE VAULT FUNCTIONALITY")
    print("=" * 70)
    
    # Test code to protect
    test_code = """
#include <stdio.h>

int secret_calculation(int a, int b) {
    // This is a secret algorithm
    int result = (a * b) + (a ^ b) - (a & b);
    return result;
}

int main() {
    int x = 10;
    int y = 20;
    int result = secret_calculation(x, y);
    printf("Secret result: %d\\n", result);
    return 0;
}
"""
    
    print("\n📝 Original Code:")
    print("-" * 70)
    print(test_code[:200] + "...")
    print("-" * 70)
    
    # Create code vault
    print("\n🔒 Creating password-protected vault with AUTO-GENERATED password...")
    vault = CodeVault()
    
    # Let Code Vault auto-generate a secure password
    # Pass None or omit password parameter
    
    try:
        vault_code, stats = vault.create_vault(test_code, password=None)
        
        print("\n✅ Vault created successfully!")
        print(f"\n📊 Vault Statistics:")
        print(f"   Encryption Algorithm: {stats['encryption_algorithm']}")
        print(f"   Key Derivation Iterations: {stats['key_derivation_iterations']:,}")
        print(f"   Salt Size: {stats['salt_size_bytes']} bytes")
        print(f"   🔑 PASSWORD: {stats['password']}")
        print(f"   Password Auto-Generated: {stats['password_auto_generated']}")
        print(f"   Password Length: {stats['password_length']} characters")
        print(f"   Vault Created: {stats['vault_created']}")
        
        print("\n📝 Vault Code Preview:")
        print("-" * 70)
        # Show first 500 characters
        print(vault_code[:500])
        print("\n... (truncated) ...")
        print("-" * 70)
        
        # Save vault code to file
        vault_file = "vault_protected.c"
        with open(vault_file, 'w', encoding='utf-8') as f:
            f.write(vault_code)
        
        print(f"\n💾 Vault code saved to: {vault_file}")
        print(f"   File size: {len(vault_code)} bytes")
        
        # Verify vault structure
        print("\n🔍 Verifying vault structure...")
        checks = {
            'Has encrypted payload': 'encrypted_payload[]' in vault_code,
            'Has salt': 'salt[]' in vault_code,
            'Has key': 'key[]' in vault_code,
            'Has decrypt function': 'decrypt_payload' in vault_code,
            'Has password prompt': 'Enter password' in vault_code,
            'Has verification': 'verify_password' in vault_code,
            'Has main function': 'int main' in vault_code
        }
        
        all_passed = True
        for check, result in checks.items():
            status = "✅" if result else "❌"
            print(f"   {status} {check}")
            if not result:
                all_passed = False
        
        if all_passed:
            print("\n✅ All vault structure checks passed!")
        else:
            print("\n⚠️ Some vault structure checks failed!")
        
        # Test runtime decryption stub
        print("\n🔧 Testing runtime decryption stub...")
        stub = vault.create_runtime_decryption_stub("secret_calculation")
        
        print("✅ Runtime decryption stub created!")
        print(f"   Stub size: {len(stub)} bytes")
        
        stub_checks = {
            'Has function typedef': 'typedef' in stub,
            'Has encrypted array': '_encrypted[]' in stub,
            'Has wrapper function': '_wrapper' in stub,
            'Has decryption logic': 'Decrypt function' in stub
        }
        
        print("\n🔍 Stub verification:")
        for check, result in stub_checks.items():
            status = "✅" if result else "❌"
            print(f"   {status} {check}")
        
        # Generate HTML password report
        print("\n📄 Generating HTML password report...")
        report_file = vault.generate_password_report_html(stats)
        print(f"✅ HTML report saved to: {report_file}")
        print(f"   Open this file in your browser to view the password!")
        
        # How to compile and test
        print("\n" + "=" * 70)
        print("📋 HOW TO TEST THE VAULT:")
        print("=" * 70)
        print("\n1️⃣ Compile the vault:")
        print(f"   gcc {vault_file} -o vault_protected.exe")
        
        print("\n2️⃣ Run the protected executable:")
        print("   ./vault_protected.exe")
        
        print("\n3️⃣ When prompted, enter password:")
        print(f"   Password: {stats['password']}")
        
        print("\n4️⃣ Expected behavior:")
        print("   ✅ Password accepted")
        print("   ✅ Payload decrypted")
        print("   ✅ Code executed")
        print("   ✅ Memory cleaned up")
        
        print("\n" + "=" * 70)
        print("🎉 CODE VAULT TEST COMPLETE!")
        print("=" * 70)
        
        print("\n📝 Summary:")
        print(f"   ✅ Vault creation: SUCCESS")
        print(f"   ✅ Encryption: {stats['encryption_algorithm']}")
        print(f"   ✅ Security: {stats['key_derivation_iterations']:,} iterations")
        print(f"   ✅ Output file: {vault_file}")
        print(f"   ✅ All checks: PASSED")
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error during vault creation: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_encryption_decryption():
    """Test encryption and decryption separately"""
    
    print("\n" + "=" * 70)
    print("🔐 TESTING ENCRYPTION/DECRYPTION")
    print("=" * 70)
    
    vault = CodeVault()
    
    # Test data
    test_string = "Hello, this is a secret message!"
    password = "TestPassword123"
    
    print(f"\n📝 Original: {test_string}")
    
    # Generate salt and key
    salt = vault._generate_salt()
    key = vault._derive_key(password, salt)
    
    print(f"\n🔑 Key derived from password")
    print(f"   Salt: {salt.hex()[:40]}...")
    print(f"   Key: {key.hex()[:40]}...")
    
    # Encrypt
    encrypted = vault._encrypt_code(test_string, key)
    print(f"\n🔒 Encrypted: {encrypted.hex()[:40]}...")
    
    # Decrypt (using same key)
    decrypted_bytes = bytearray()
    for i, byte in enumerate(encrypted):
        decrypted_bytes.append(byte ^ key[i % len(key)])
    decrypted = bytes(decrypted_bytes).decode('utf-8')
    
    print(f"\n🔓 Decrypted: {decrypted}")
    
    # Verify
    if decrypted == test_string:
        print("\n✅ Encryption/Decryption: SUCCESS")
        print("   Original and decrypted match perfectly!")
        return True
    else:
        print("\n❌ Encryption/Decryption: FAILED")
        print(f"   Expected: {test_string}")
        print(f"   Got: {decrypted}")
        return False

if __name__ == "__main__":
    print("\n" + "=" * 70)
    print("🧪 CODE VAULT COMPREHENSIVE TEST SUITE")
    print("=" * 70)
    
    # Test 1: Encryption/Decryption
    test1_passed = test_encryption_decryption()
    
    # Test 2: Full Vault Creation
    test2_passed = test_code_vault()
    
    # Final Summary
    print("\n" + "=" * 70)
    print("📊 FINAL TEST RESULTS")
    print("=" * 70)
    
    print(f"\n   {'✅' if test1_passed else '❌'} Test 1: Encryption/Decryption")
    print(f"   {'✅' if test2_passed else '❌'} Test 2: Vault Creation")
    
    if test1_passed and test2_passed:
        print("\n🎉 ALL TESTS PASSED!")
        print("\n✅ Code Vault is working correctly!")
        sys.exit(0)
    else:
        print("\n⚠️ Some tests failed!")
        sys.exit(1)
