"""
Test Downloaded Obfuscated File
This script tests the obfuscated file you download from the web interface
to verify it produces the same output as the original code.
"""

import subprocess
import tempfile
import os
import sys

def print_separator(title=""):
    """Print a formatted separator"""
    if title:
        print(f"\n{'='*80}")
        print(f"  {title}")
        print(f"{'='*80}\n")
    else:
        print(f"{'='*80}\n")

def compile_and_run(code_file, is_cpp=False):
    """Compile and run a C/C++ file"""
    try:
        # Determine compiler and executable name
        compiler = 'g++' if is_cpp else 'gcc'
        exe_name = code_file.replace('.c', '.exe').replace('.cpp', '.exe')
        
        print(f"📝 Compiling with {compiler}...")
        
        # Compile
        compile_result = subprocess.run(
            [compiler, code_file, '-o', exe_name],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if compile_result.returncode != 0:
            print(f"❌ Compilation failed!")
            print(f"Error: {compile_result.stderr}")
            return None
        
        print(f"✅ Compilation successful!")
        
        # Run
        print(f"🚀 Running executable...")
        run_result = subprocess.run(
            [exe_name],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        # Clean up executable
        if os.path.exists(exe_name):
            os.unlink(exe_name)
        
        return run_result.stdout
        
    except subprocess.TimeoutExpired:
        print("❌ Execution timeout!")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_files(original_file, obfuscated_file):
    """Test original and obfuscated files"""
    
    print_separator("TESTING DOWNLOADED OBFUSCATED FILE")
    
    # Check if files exist
    if not os.path.exists(original_file):
        print(f"❌ Original file not found: {original_file}")
        print("Please provide the path to your original C/C++ file.")
        return False
    
    if not os.path.exists(obfuscated_file):
        print(f"❌ Obfuscated file not found: {obfuscated_file}")
        print("Please download the obfuscated code from the web interface first.")
        return False
    
    # Detect if C++
    is_cpp = original_file.endswith('.cpp') or obfuscated_file.endswith('.cpp')
    
    print(f"Original File: {original_file}")
    print(f"Obfuscated File: {obfuscated_file}")
    print(f"Language: {'C++' if is_cpp else 'C'}")
    print()
    
    # Show file sizes
    orig_size = os.path.getsize(original_file)
    obf_size = os.path.getsize(obfuscated_file)
    size_increase = ((obf_size - orig_size) / orig_size) * 100
    
    print(f"📊 File Sizes:")
    print(f"  Original:    {orig_size:,} bytes")
    print(f"  Obfuscated:  {obf_size:,} bytes")
    print(f"  Increase:    {size_increase:.1f}%")
    print()
    
    # Test original file
    print_separator("TESTING ORIGINAL FILE")
    original_output = compile_and_run(original_file, is_cpp)
    
    if original_output is None:
        print("❌ Original file failed to compile or run!")
        return False
    
    print(f"\n📤 Original Output:")
    print("-" * 80)
    print(original_output if original_output else "(no output)")
    print("-" * 80)
    
    # Test obfuscated file
    print_separator("TESTING OBFUSCATED FILE")
    obfuscated_output = compile_and_run(obfuscated_file, is_cpp)
    
    if obfuscated_output is None:
        print("❌ Obfuscated file failed to compile or run!")
        return False
    
    print(f"\n📤 Obfuscated Output:")
    print("-" * 80)
    print(obfuscated_output if obfuscated_output else "(no output)")
    print("-" * 80)
    
    # Compare outputs
    print_separator("VERIFICATION RESULTS")
    
    if original_output == obfuscated_output:
        print("✅ SUCCESS! Outputs are IDENTICAL!")
        print()
        print("The obfuscated code produces the exact same output as the original.")
        print("This confirms that obfuscation preserved the program's functionality.")
        return True
    else:
        print("❌ FAILED! Outputs are DIFFERENT!")
        print()
        print("Differences found:")
        print(f"  Original length:    {len(original_output)} characters")
        print(f"  Obfuscated length:  {len(obfuscated_output)} characters")
        print()
        print("This may indicate an issue with the obfuscation process.")
        return False

def main():
    """Main function"""
    print_separator("SPECTRE - Downloaded File Verification Test")
    
    # Check command line arguments
    if len(sys.argv) >= 3:
        original_file = sys.argv[1]
        obfuscated_file = sys.argv[2]
    else:
        print("Usage:")
        print("  python test_downloaded_file.py <original_file> <obfuscated_file>")
        print()
        print("Example:")
        print("  python test_downloaded_file.py original.c obfuscated_code.c")
        print()
        print("Or enter the file paths now:")
        print()
        
        original_file = input("Enter path to ORIGINAL file: ").strip().strip('"')
        obfuscated_file = input("Enter path to OBFUSCATED file (downloaded): ").strip().strip('"')
    
    # Run test
    success = test_files(original_file, obfuscated_file)
    
    print_separator()
    
    if success:
        print("🎉 VERIFICATION PASSED!")
        print()
        print("Your downloaded obfuscated code works correctly!")
        sys.exit(0)
    else:
        print("⚠️ VERIFICATION FAILED!")
        print()
        print("Please check the files and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main()
