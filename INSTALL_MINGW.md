# Installing MinGW for SPECTRE

## Problem
Clang on Windows needs a C standard library to compile code. It can't find `stdio.h` and other standard headers.

## Solution: Install MinGW-w64

### Option 1: Using Chocolatey (Recommended)

```powershell
# Install Chocolatey if you don't have it
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install MinGW
choco install mingw -y

# Restart terminal and verify
gcc --version
```

### Option 2: Manual Download

1. **Download MinGW-w64**:
   - Go to: https://sourceforge.net/projects/mingw-w64/files/
   - Download: `x86_64-posix-seh` (latest version)
   - Or direct link: https://sourceforge.net/projects/mingw-w64/files/Toolchains%20targetting%20Win64/Personal%20Builds/mingw-builds/8.1.0/threads-posix/seh/x86_64-8.1.0-release-posix-seh-rt_v6-rev0.7z

2. **Extract**:
   - Extract to `C:\mingw64`

3. **Add to PATH**:
   ```powershell
   # Add to system PATH
   $env:PATH += ";C:\mingw64\bin"
   
   # Make it permanent
   [Environment]::SetEnvironmentVariable("Path", $env:PATH + ";C:\mingw64\bin", "Machine")
   ```

4. **Verify**:
   ```powershell
   gcc --version
   # Should show: gcc (x86_64-posix-seh-rev0, Built by MinGW-W64 project) 8.1.0
   ```

### Option 3: Use MSYS2

1. Download MSYS2: https://www.msys2.org/
2. Install it
3. Open MSYS2 terminal
4. Run:
   ```bash
   pacman -S mingw-w64-x86_64-gcc
   ```
5. Add to PATH: `C:\msys64\mingw64\bin`

## After Installation

1. **Restart your terminal**
2. **Restart the SPECTRE server**:
   ```powershell
   cd C:\Users\abhis\ProjectSIH\SPECTRE
   python start_server.py
   ```
3. **Try obfuscating again** - it should work now!

## Quick Test

```powershell
# Test if GCC works
gcc --version

# Test if Clang can find headers now
echo "#include <stdio.h>" > test.c
echo "int main() { return 0; }" >> test.c
clang test.c -o test.exe
# Should compile without errors
```

## Alternative: Use GCC Directly

If you can't install MinGW, SPECTRE will automatically fall back to using GCC if available.
