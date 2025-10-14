"""
Run the most recently obfuscated executable and show its output
"""
import os
import glob
import subprocess
import tempfile
from datetime import datetime

def find_latest_obfuscated_exe():
    """Find the most recently created obfuscated executable"""
    temp_dir = tempfile.gettempdir()
    
    # Look for SPECTRE LLVM temp directories
    pattern = os.path.join(temp_dir, "spectre_llvm_*")
    llvm_dirs = glob.glob(pattern)
    
    if not llvm_dirs:
        print("❌ No obfuscated executables found!")
        print(f"   Searched in: {temp_dir}")
        print("   Run an obfuscation first using the web interface.")
        return None
    
    # Find the most recent directory
    latest_dir = max(llvm_dirs, key=os.path.getmtime)
    
    # Look for executable
    exe_path = os.path.join(latest_dir, "output.exe")
    
    if not os.path.exists(exe_path):
        print(f"❌ Executable not found in {latest_dir}")
        return None
    
    return exe_path

def run_executable(exe_path):
    """Run the executable and capture output"""
    print("=" * 80)
    print("RUNNING OBFUSCATED EXECUTABLE")
    print("=" * 80)
    print(f"\nExecutable: {exe_path}")
    print(f"Size: {os.path.getsize(exe_path):,} bytes")
    print(f"Modified: {datetime.fromtimestamp(os.path.getmtime(exe_path))}")
    print("\n" + "-" * 80)
    print("OUTPUT:")
    print("-" * 80)
    
    try:
        result = subprocess.run(
            [exe_path],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        # Print output
        if result.stdout:
            print(result.stdout)
        
        if result.stderr:
            print("STDERR:", result.stderr)
        
        print("-" * 80)
        print(f"Exit Code: {result.returncode}")
        
        if result.returncode == 0:
            print("✅ Program executed successfully!")
        else:
            print(f"⚠️  Program exited with code {result.returncode}")
        
        return True
        
    except subprocess.TimeoutExpired:
        print("❌ Execution timeout (program took too long)")
        return False
    except Exception as e:
        print(f"❌ Error running executable: {e}")
        return False

def main():
    print("\n" + "=" * 80)
    print("SPECTRE - Run Obfuscated Executable")
    print("=" * 80 + "\n")
    
    # Find executable
    print("🔍 Searching for obfuscated executable...")
    exe_path = find_latest_obfuscated_exe()
    
    if not exe_path:
        print("\n💡 TIP: Obfuscate some code first using the web interface,")
        print("   then run this script to see the output.")
        return
    
    print(f"✅ Found: {exe_path}\n")
    
    # Run it
    run_executable(exe_path)
    
    print("\n" + "=" * 80)
    print("\n💡 To run it again manually:")
    print(f"   {exe_path}")
    print("\n" + "=" * 80 + "\n")

if __name__ == "__main__":
    main()
