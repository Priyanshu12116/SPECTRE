@echo off
echo ================================================================================
echo SPECTRE - Compile Obfuscated Code to EXE
echo ================================================================================
echo.

if "%~1"=="" (
    echo Usage: compile_to_exe.bat ^<source_file^>
    echo.
    echo Examples:
    echo   compile_to_exe.bat obfuscated_code.cpp
    echo   compile_to_exe.bat obfuscated_code.c
    echo.
    pause
    exit /b 1
)

set SOURCE=%~1
set OUTPUT=%~n1.exe

echo Source File: %SOURCE%
echo Output File: %OUTPUT%
echo.

REM Detect if C or C++
echo %SOURCE% | findstr /i ".cpp" >nul
if %errorlevel%==0 (
    echo Detected: C++ file
    echo Compiling with g++...
    g++ "%SOURCE%" -o "%OUTPUT%" -static-libgcc -static-libstdc++
) else (
    echo Detected: C file
    echo Compiling with gcc...
    gcc "%SOURCE%" -o "%OUTPUT%"
)

if %errorlevel%==0 (
    echo.
    echo ================================================================================
    echo ✅ SUCCESS! Executable created: %OUTPUT%
    echo ================================================================================
    echo.
    echo File size: 
    dir "%OUTPUT%" | findstr "%OUTPUT%"
    echo.
    echo To run it:
    echo   %OUTPUT%
    echo.
) else (
    echo.
    echo ================================================================================
    echo ❌ COMPILATION FAILED!
    echo ================================================================================
    echo.
    echo Check the error messages above.
    echo.
)

pause
