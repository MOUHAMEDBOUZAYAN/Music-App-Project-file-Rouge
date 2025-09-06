@echo off
echo Starting SoundWave Music Application...
echo.
echo Starting Backend Server...
start "SoundWave Backend" cmd /k "cd soundwave-backend && npm install && npm run dev"
echo.
echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul
echo.
echo Starting Frontend...
start "SoundWave Frontend" cmd /k "cd soundwave-frontend && npm install && npm run dev"
echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
