# SPECTRE Backend Startup Script
# This script starts the backend server with GCC in PATH

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting SPECTRE Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Add GCC to PATH for this session
$gccPath = "C:\Program Files\bin"
if (Test-Path "$gccPath\gcc.exe") {
    $env:Path += ";$gccPath"
    Write-Host "✅ GCC added to PATH: $gccPath" -ForegroundColor Green
} else {
    Write-Host "⚠️  GCC not found at: $gccPath" -ForegroundColor Yellow
    Write-Host "   Verification features may not work" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting SPECTRE Production Server (Waitress)..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Change to backend directory and start production server
Set-Location -Path "$PSScriptRoot\backend"
& "$PSScriptRoot\.venv\Scripts\python.exe" wsgi.py
