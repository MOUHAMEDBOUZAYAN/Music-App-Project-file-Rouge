@echo off
title SoundWave Music - Complete Setup
color 0A

echo.
echo ========================================
echo    🎵 SoundWave Music Setup 🎵
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

echo.
echo Checking if MongoDB is running...
mongo --eval "db.runCommand('ping')" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB is not running or not installed
    echo The app will work without database for now
) else (
    echo ✅ MongoDB is running
)

echo.
echo ========================================
echo    Starting Backend Server...
echo ========================================
echo.

cd soundwave-backend
echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo Starting backend server...
start "SoundWave Backend" cmd /k "cd soundwave-backend && npm run dev"

echo.
echo Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo    Starting Frontend...
echo ========================================
echo.

cd ..\soundwave-frontend
echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Starting frontend server...
start "SoundWave Frontend" cmd /k "cd soundwave-frontend && npm run dev"

echo.
echo ========================================
echo    🎉 Setup Complete! 🎉
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo The application should open automatically in your browser.
echo If not, manually open: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
