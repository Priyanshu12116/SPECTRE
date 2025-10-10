# SPECTRE GCC PATH Setup Script
# Run this script to permanently add GCC to your system PATH

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "SPECTRE GCC PATH Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Check if GCC exists
$gccPath = "C:\Program Files\bin"
$gccExe = Join-Path $gccPath "gcc.exe"

if (Test-Path $gccExe) {
    Write-Host "✅ GCC found at: $gccPath" -ForegroundColor Green
    
    # Get current PATH
    $currentPath = [Environment]::GetEnvironmentVariable("Path", "User")
    
    # Check if already in PATH
    if ($currentPath -like "*$gccPath*") {
        Write-Host "✅ GCC is already in your PATH" -ForegroundColor Green
    } else {
        Write-Host "Adding GCC to PATH..." -ForegroundColor Yellow
        
        # Add to User PATH (doesn't require admin)
        $newPath = $currentPath + ";$gccPath"
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        
        Write-Host "✅ GCC added to PATH successfully!" -ForegroundColor Green
        Write-Host "⚠️  Please restart your terminal/IDE for changes to take effect" -ForegroundColor Yellow
    }
    
    # Test GCC in current session
    $env:Path += ";$gccPath"
    Write-Host ""
    Write-Host "Testing GCC..." -ForegroundColor Cyan
    & gcc --version
    
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "✅ Setup Complete!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Restart your terminal/IDE" -ForegroundColor White
    Write-Host "2. Restart the backend server:" -ForegroundColor White
    Write-Host "   cd backend" -ForegroundColor Gray
    Write-Host "   python server.py" -ForegroundColor Gray
    Write-Host "3. Refresh the browser page" -ForegroundColor White
    Write-Host "4. Try obfuscation again!" -ForegroundColor White
    Write-Host ""
    
} else {
    Write-Host "❌ GCC not found at: $gccPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check your GCC installation location." -ForegroundColor Yellow
    Write-Host "Common locations:" -ForegroundColor Yellow
    Write-Host "  - C:\Program Files\bin" -ForegroundColor Gray
    Write-Host "  - C:\mingw64\bin" -ForegroundColor Gray
    Write-Host "  - C:\TDM-GCC-64\bin" -ForegroundColor Gray
    Write-Host "  - C:\msys64\mingw64\bin" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
