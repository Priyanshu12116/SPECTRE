@echo off
echo ============================================================
echo Starting SPECTRE Backend Server
echo ============================================================

REM Activate virtual environment
call .venv\Scripts\activate.bat

REM Add LLVM to PATH
set PATH=%PATH%;C:\Program Files\LLVM\bin

REM Start server
echo Starting server on http://127.0.0.1:5000
echo Press Ctrl+C to stop the server
echo ============================================================
python start_server.py

pause
