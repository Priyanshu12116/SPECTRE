"""
Complete test of password validation from obfuscation to compilation
This will verify that wrong passwords are properly rejected
"""
import requests
import json

def test_complete_flow():
    """Test the complete flow: obfuscate → compile with wrong password → compile with correct password"""
    
    print("=" * 80)
    print("TESTING PASSWORD VALIDATION - COMPLETE FLOW")
    print("=" * 80)
    print()
    
    # Step 1: Obfuscate code
    print("Step 1: Obfuscating code...")
    print("-" * 80)
    
    test_code = """
#include <iostream>
int main() {
    std::cout << "Hello from SPECTRE!" << std::endl;
    return 0;
}
"""
    
    obfuscate_url = "http://127.0.0.1:5000/api/obfuscate/llvm"
    obfuscate_payload = {
        "code": test_code,
        "level": "balanced",
        "platform": "windows"
    }
    
    try:
        response = requests.post(obfuscate_url, json=obfuscate_payload, timeout=60)
        
        if response.status_code != 200:
            print(f"❌ Obfuscation failed: {response.status_code}")
            print(response.text)
            return False
        
        result = response.json()
        llvm_ir = result.get('obfuscated_ir', '')
        vault_password = result.get('vault_password', '')
        
        if not llvm_ir:
            print("❌ No LLVM IR returned")
            return False
        
        if not vault_password:
            print("❌ No vault password returned")
            return False
        
        print(f"✅ Obfuscation successful!")
        print(f"   LLVM IR size: {len(llvm_ir)} bytes")
        print(f"   Vault password: {vault_password}")
        print()
        
        # Check if password hash is embedded
        if '; SPECTRE_PASSWORD_HASH:' in llvm_ir:
            print("✅ Password hash found in LLVM IR")
            # Extract and show first line
            for line in llvm_ir.split('\n')[:5]:
                if 'SPECTRE_PASSWORD_HASH' in line:
                    print(f"   {line}")
        else:
            print("❌ WARNING: No password hash in LLVM IR!")
            print("   First 5 lines of IR:")
            for line in llvm_ir.split('\n')[:5]:
                print(f"   {line}")
        print()
        
    except Exception as e:
        print(f"❌ Obfuscation error: {e}")
        return False
    
    # Step 2: Try to compile with WRONG password
    print("Step 2: Trying to compile with WRONG password...")
    print("-" * 80)
    
    compile_url = "http://127.0.0.1:5000/api/llvm/compile"
    wrong_password = "wrongpassword123"
    
    compile_payload = {
        "llvm_ir": llvm_ir,
        "password": wrong_password,
        "is_cpp": True
    }
    
    try:
        response = requests.post(compile_url, json=compile_payload, timeout=60)
        
        if response.status_code == 200:
            print("❌ SECURITY ISSUE: Compilation succeeded with WRONG password!")
            print(f"   Executable size: {len(response.content)} bytes")
            print()
            print("THIS IS A BUG - Wrong password should be rejected!")
            return False
        else:
            print(f"✅ Compilation rejected (status {response.status_code})")
            try:
                error = response.json()
                print(f"   Error: {error.get('error', 'Unknown')}")
                if 'details' in error:
                    print(f"   Details: {error['details']}")
            except:
                print(f"   Response: {response.text}")
            print()
            print("✅ CORRECT BEHAVIOR: Wrong password was rejected!")
        
    except Exception as e:
        print(f"❌ Compilation error: {e}")
        return False
    
    # Step 3: Try to compile with CORRECT password
    print("Step 3: Trying to compile with CORRECT password...")
    print("-" * 80)
    
    compile_payload['password'] = vault_password
    
    try:
        response = requests.post(compile_url, json=compile_payload, timeout=60)
        
        if response.status_code == 200:
            print(f"✅ Compilation succeeded with CORRECT password!")
            print(f"   Executable size: {len(response.content)} bytes")
            
            # Save the executable
            with open('test_validated_output.exe', 'wb') as f:
                f.write(response.content)
            print(f"   Saved as: test_validated_output.exe")
            print()
            print("✅ CORRECT BEHAVIOR: Correct password was accepted!")
            
        else:
            print(f"❌ Compilation failed with CORRECT password (status {response.status_code})")
            try:
                error = response.json()
                print(f"   Error: {error.get('error', 'Unknown')}")
            except:
                print(f"   Response: {response.text}")
            print()
            print("THIS IS A BUG - Correct password should work!")
            return False
        
    except Exception as e:
        print(f"❌ Compilation error: {e}")
        return False
    
    # Summary
    print()
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    print("✅ Obfuscation: Password generated and embedded")
    print("✅ Wrong password: Properly rejected")
    print("✅ Correct password: Properly accepted")
    print()
    print("🎉 PASSWORD VALIDATION IS WORKING CORRECTLY!")
    print("=" * 80)
    
    return True


if __name__ == "__main__":
    print()
    print("This test will verify that password validation works correctly.")
    print("Make sure the server is running (python start_server.py)")
    print()
    input("Press Enter to start the test...")
    print()
    
    success = test_complete_flow()
    
    if not success:
        print()
        print("❌ TEST FAILED - Check the errors above")
    
    print()
    input("Press Enter to exit...")
