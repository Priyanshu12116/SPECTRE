@echo off
echo ================================================================================
echo SPECTRE - Test Downloaded Obfuscated File
echo ================================================================================
echo.
echo This script will test your downloaded obfuscated file to verify it produces
echo the same output as your original code.
echo.
echo ================================================================================
echo.

python test_downloaded_file.py %1 %2

pause
