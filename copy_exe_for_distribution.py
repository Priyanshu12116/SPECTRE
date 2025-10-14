"""
Copy the latest LLVM obfuscated executable to a distribution folder
"""
import os
import glob
import shutil
import tempfile
from datetime import datetime

def find_latest_obfuscated_exe():
    """Find the most recently created LLVM obfuscated executable"""
    temp_dir = tempfile.gettempdir()
    pattern = os.path.join(temp_dir, "spectre_llvm_*", "output.exe")
    
    exe_files = glob.glob(pattern)
    
    if not exe_files:
        return None
    
    # Sort by modification time, newest first
    exe_files.sort(key=os.path.getmtime, reverse=True)
    return exe_files[0]

def copy_exe_for_distribution():
    """Copy the executable to a distribution folder"""
    exe_path = find_latest_obfuscated_exe()
    
    if not exe_path:
        print("[X] No obfuscated executable found!")
        print()
        print("Make sure you've run LLVM obfuscation first.")
        return
    
    # Create distribution folder
    dist_folder = os.path.join(os.path.dirname(__file__), "distribution")
    os.makedirs(dist_folder, exist_ok=True)
    
    # Generate a timestamped filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    new_filename = f"obfuscated_program_{timestamp}.exe"
    dest_path = os.path.join(dist_folder, new_filename)
    
    # Copy the file
    shutil.copy2(exe_path, dest_path)
    
    # Get file size
    file_size = os.path.getsize(dest_path)
    size_kb = file_size / 1024
    
    print("=" * 80)
    print("EXECUTABLE COPIED FOR DISTRIBUTION")
    print("=" * 80)
    print()
    print(f"[OK] Source: {exe_path}")
    print(f"[OK] Destination: {dest_path}")
    print(f"[OK] File size: {size_kb:.2f} KB")
    print()
    print("=" * 80)
    print("READY TO DISTRIBUTE!")
    print("=" * 80)
    print()
    print(f"The executable is ready at:")
    print(f"  {dest_path}")
    print()
    print("You can now:")
    print("  1. Give this .exe file to other users")
    print("  2. They can run it directly (no compilation needed)")
    print("  3. No SPECTRE or special tools required!")
    print()
    print("To run it:")
    print(f'  "{dest_path}"')
    print()

if __name__ == "__main__":
    copy_exe_for_distribution()
