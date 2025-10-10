@echo off
REM SPECTRE Backend Startup Script
REM This script starts the backend server with GCC in PATH

echo ========================================
echo Starting SPECTRE Backend Server
echo ========================================
echo.

REM Add GCC to PATH
set PATH=%PATH%;C:\Program Files\bin

REM Check if GCC exists
where gcc >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] GCC found in PATH
) else (
    echo [WARNING] GCC not found - verification may not work
)

echo.
echo Starting SPECTRE Production Server (Waitress)...
echo Press Ctrl+C to stop the server
echo.

REM Start production server using venv Python
cd backend
..\.venv\Scripts\python.exe wsgi.py

pause
