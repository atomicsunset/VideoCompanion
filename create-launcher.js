const fs = require('fs');
const path = require('path');

// Create a self-contained launcher script
const launcherScript = `@echo off
setlocal EnableDelayedExpansion
title FNP Video Companion Launcher
cls

echo.
echo  =====================================================
echo   FNP VIDEO COMPANION - BROADCAST READY
echo  =====================================================
echo.
echo  Starting application...
echo.

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"

REM Check if the app folder exists next to this launcher
set "APP_DIR=%SCRIPT_DIR%FNP Video Companion-win32-x64"

if not exist "!APP_DIR!" (
    echo ERROR: Application folder not found!
    echo.
    echo This launcher must be placed next to the folder:
    echo "FNP Video Companion-win32-x64"
    echo.
    echo Please ensure both files are in the same directory:
    echo - FNP-Video-Companion-LAUNCHER.bat  ^(this file^)
    echo - FNP Video Companion-win32-x64\\    ^(folder with app^)
    echo.
    pause
    exit /b 1
)

REM Launch the application silently
start "" "!APP_DIR!\\FNP Video Companion.exe"

REM Give it a moment to start
timeout /t 2 /nobreak >nul

echo  Application launched successfully!
echo.
echo  The FNP Video Companion is now running.
echo  You can close this window.
echo.
echo  =====================================================
echo.

REM Optional: Auto-close after 5 seconds
echo  This window will close automatically in 5 seconds...
timeout /t 5 /nobreak >nul
exit /b 0
`;

// Write the launcher
const launcherPath = path.join(__dirname, 'dist', 'FNP-Video-Companion-LAUNCHER.bat');
fs.writeFileSync(launcherPath, launcherScript);

console.log('✅ Created launcher: FNP-Video-Companion-LAUNCHER.bat');
console.log('📁 Place this file next to the "FNP Video Companion-win32-x64" folder');
console.log('🚀 Users just double-click the LAUNCHER.bat file and it handles everything!');