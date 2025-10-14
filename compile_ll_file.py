"""
Simple script to compile .ll file to .exe without browser
This bypasses antivirus download blocking
"""
import requests
import sys
import os

def compile_ll_file(ll_file_path, password, output_name='output.exe', is_cpp=True):
    """
    Compile a .ll file to .exe
    
    Args:
        ll_file_path: Path to .ll file
        password: Code Vault password
        output_name: Name for output .exe
        is_cpp: True for C++, False for C
    """
    
    print("=" * 80)
    print("SPECTRE - Compile LLVM IR to Executable")
    print("=" * 80)
    print()
    
    # Check if file exists
    if not os.path.exists(ll_file_path):
        print(f"❌ Error: File not found: {ll_file_path}")
        return False
    
    # Read the .ll file
    print(f"📂 Reading file: {ll_file_path}")
    with open(ll_file_path, 'r', encoding='utf-8') as f:
        llvm_ir = f.read()
    
    print(f"✅ File size: {len(llvm_ir)} bytes")
    print()
    
    # Prepare request
    url = "http://127.0.0.1:5000/api/llvm/compile"
    payload = {
        "llvm_ir": llvm_ir,
        "password": password,
        "is_cpp": is_cpp
    }
    
    print("🔄 Sending compilation request to server...")
    print(f"   URL: {url}")
    print(f"   Language: {'C++' if is_cpp else 'C'}")
    print()
    
    try:
        # Send request
        response = requests.post(url, json=payload, timeout=60)
        
        if response.status_code == 200:
            # Success - save the executable
            print("✅ Compilation successful!")
            print(f"   Executable size: {len(response.content)} bytes")
            print()
            
            # Save to file
            with open(output_name, 'wb') as f:
                f.write(response.content)
            
            print("=" * 80)
            print(f"✅ SUCCESS! Executable saved as: {output_name}")
            print("=" * 80)
            print()
            print("To run it:")
            print(f"   {output_name}")
            print()
            return True
            
        else:
            # Error
            print("❌ Compilation failed!")
            print(f"   Status code: {response.status_code}")
            try:
                error = response.json()
                print(f"   Error: {error.get('error', 'Unknown error')}")
                if 'details' in error:
                    print(f"   Details: {error['details']}")
            except:
                print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server!")
        print()
        print("Make sure the server is running:")
        print("   python start_server.py")
        return False
        
    except requests.exceptions.Timeout:
        print("❌ Request timeout!")
        print("   Compilation took too long (> 60 seconds)")
        return False
        
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False


def main():
    """Main function with interactive prompts"""
    
    print()
    print("=" * 80)
    print("SPECTRE - Compile LLVM IR to Executable")
    print("=" * 80)
    print()
    print("This script compiles .ll files to .exe without browser download")
    print("(Bypasses antivirus blocking)")
    print()
    
    # Get .ll file path
    if len(sys.argv) > 1:
        ll_file = sys.argv[1]
    else:
        ll_file = input("Enter path to .ll file: ").strip().strip('"')
    
    # Get password
    if len(sys.argv) > 2:
        password = sys.argv[2]
    else:
        password = input("Enter Code Vault password: ").strip()
    
    # Get output name
    if len(sys.argv) > 3:
        output_name = sys.argv[3]
    else:
        output_name = input("Enter output name (default: output.exe): ").strip()
        if not output_name:
            output_name = "output.exe"
    
    # Get language type
    if len(sys.argv) > 4:
        is_cpp = sys.argv[4].lower() == 'cpp'
    else:
        lang = input("Language (cpp/c, default: cpp): ").strip().lower()
        is_cpp = lang != 'c'
    
    print()
    
    # Compile
    success = compile_ll_file(ll_file, password, output_name, is_cpp)
    
    if success:
        print()
        print("🎉 Done! Your executable is ready.")
    else:
        print()
        print("❌ Compilation failed. Check the errors above.")
    
    print()
    input("Press Enter to exit...")


if __name__ == "__main__":
    main()
