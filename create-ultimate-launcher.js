const fs = require('fs');
const path = require('path');

// Create the ultimate "single click" launcher
const ultimateLauncher = `@echo off
setlocal EnableDelayedExpansion
title FNP Video Companion

REM Hide cursor and clear screen
echo off
cls

REM Define colors (if supported)
set "GREEN=[92m"
set "YELLOW=[93m" 
set "BLUE=[94m"
set "RED=[91m"
set "RESET=[0m"

echo.
echo %BLUE% ███████╗███╗   ██╗██████╗     ██╗   ██╗██╗██████╗ ███████╗ ██████╗ %RESET%
echo %BLUE% ██╔════╝████╗  ██║██╔══██╗    ██║   ██║██║██╔══██╗██╔════╝██╔═══██╗%RESET%
echo %BLUE% █████╗  ██╔██╗ ██║██████╔╝    ██║   ██║██║██║  ██║█████╗  ██║   ██║%RESET%
echo %BLUE% ██╔══╝  ██║╚██╗██║██╔═══╝     ╚██╗ ██╔╝██║██║  ██║██╔══╝  ██║   ██║%RESET%
echo %BLUE% ██║     ██║ ╚████║██║          ╚████╔╝ ██║██████╔╝███████╗╚██████╔╝%RESET%
echo %BLUE% ╚═╝     ╚═╝  ╚═══╝╚═╝           ╚═══╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝ %RESET%
echo.
echo %GREEN%                    🎬 COMPANION - BROADCAST READY 🎬%RESET%
echo.

REM Get script directory
set "SCRIPT_DIR=%~dp0"
set "APP_FOLDER=FNP Video Companion-win32-x64"
set "APP_DIR=%SCRIPT_DIR%%APP_FOLDER%"
set "LOCAL_DIR=%USERPROFILE%\\AppData\\Local\\FNPVideoCompanion"
set "APP_EXE=FNP Video Companion.exe"

REM Check if app folder exists next to launcher
if not exist "!APP_DIR!" (
    echo %RED%❌ ERROR: Application folder missing!%RESET%
    echo.
    echo %YELLOW%This launcher needs the folder: "%APP_FOLDER%"%RESET%
    echo %YELLOW%Place both files in the same directory:%RESET%
    echo   • FNP-Video-Companion.bat
    echo   • %APP_FOLDER%\\ ^(folder^)
    echo.
    pause
    exit /b 1
)

REM Check if we need to set up local copy (first run or update needed)
set "NEED_SETUP=0"
if not exist "!LOCAL_DIR!\\!APP_EXE!" set "NEED_SETUP=1"

REM Check if source is newer than local copy
if exist "!LOCAL_DIR!\\!APP_EXE!" (
    for %%i in ("!APP_DIR!\\!APP_EXE!") do set "SOURCE_DATE=%%~ti"
    for %%i in ("!LOCAL_DIR!\\!APP_EXE!") do set "LOCAL_DATE=%%~ti"
    if "!SOURCE_DATE!" GTR "!LOCAL_DATE!" set "NEED_SETUP=1"
)

if "!NEED_SETUP!"=="1" (
    echo %YELLOW%⚡ Setting up FNP Video Companion...%RESET%
    
    REM Create local directory
    if not exist "!LOCAL_DIR!" mkdir "!LOCAL_DIR!" >nul 2>&1
    
    REM Copy app files with progress
    echo    📁 Copying application files...
    xcopy "!APP_DIR!" "!LOCAL_DIR!" /E /Y /Q >nul 2>&1
    
    if !errorlevel! NEQ 0 (
        echo %RED%❌ Setup failed! Using portable mode...%RESET%
        set "LAUNCH_DIR=!APP_DIR!"
    ) else (
        echo %GREEN%✅ Setup complete!%RESET%
        set "LAUNCH_DIR=!LOCAL_DIR!"
    )
) else (
    set "LAUNCH_DIR=!LOCAL_DIR!"
)

echo %GREEN%🚀 Launching FNP Video Companion...%RESET%
echo.

REM Launch the application
start "" "!LAUNCH_DIR!\\!APP_EXE!"

REM Wait a moment and check if it started
timeout /t 2 /nobreak >nul

REM Check if process is running
tasklist /FI "IMAGENAME eq FNP Video Companion.exe" 2>nul | find /I "FNP Video Companion.exe" >nul
if %errorlevel%==0 (
    echo %GREEN%✅ Application started successfully!%RESET%
    echo.
    echo %BLUE%📺 Control panel: Primary monitor%RESET%
    echo %BLUE%🎬 Video output: Secondary monitor%RESET%
    echo.
    echo %YELLOW%This launcher will close in 3 seconds...%RESET%
    timeout /t 3 /nobreak >nul
) else (
    echo %RED%⚠️  Launch may have failed. Please check for error messages.%RESET%
    echo.
    pause
)

exit /b 0
`;

// Write the ultimate launcher
const launcherPath = path.join(__dirname, 'dist', 'FNP-Video-Companion.bat');
fs.writeFileSync(launcherPath, ultimateLauncher);

console.log('✅ Created ultimate launcher: FNP-Video-Companion.bat');
console.log('');
console.log('🎯 SINGLE-FILE EXPERIENCE:');
console.log('   • Beautiful splash screen with branding');
console.log('   • Auto-copies to user profile on first run');
console.log('   • Updates itself when source is newer');
console.log('   • Falls back to portable mode if copy fails');
console.log('   • Professional startup messages');
console.log('   • Auto-closes after successful launch');
console.log('');
console.log('📦 DISTRIBUTION:');
console.log('   • Place FNP-Video-Companion.bat next to the app folder');
console.log('   • Users just double-click the .bat file');
console.log('   • First run: Copies to user profile for speed');
console.log('   • Future runs: Launches instantly from local copy');
console.log('');
console.log('🚀 User experience: "Just double-click and it works!"');