@echo off-
chcp 65001 >nul
title 🎵 SoundWave Music - Démarrage de l'application

echo 🎵 SoundWave Music - Démarrage de l'application
echo ================================================
echo.

echo 🔍 Vérification de la configuration...
if not exist "soundwave-backend\.env" (
    echo ❌ Fichier .env manquant dans le backend
    echo Veuillez exécuter install-spotify.bat d'abord
    pause
    exit /b 1
)

if not exist "soundwave-frontend\.env" (
    echo ❌ Fichier .env manquant dans le frontend
    echo Veuillez exécuter install-spotify.bat d'abord
    pause
    exit /b 1
)

echo ✅ Configuration vérifiée
echo.

echo 🚀 Démarrage des services...
echo.

echo 📡 Démarrage du backend (port 5000)...
start "SoundWave Backend" cmd /k "cd soundwave-backend && npm run dev"

echo ⏳ Attente du démarrage du backend...
timeout /t 5 /nobreak >nul

echo 🌐 Démarrage du frontend (port 3000)...
start "SoundWave Frontend" cmd /k "cd soundwave-frontend && npm run dev"

echo.
echo 🎉 Services démarrés !
echo.
echo 📱 Frontend : http://localhost:3000
echo 🔌 Backend API : http://localhost:5000
echo.
echo 💡 Conseils :
echo    - Gardez les fenêtres de terminal ouvertes
echo    - Vérifiez les logs pour détecter les erreurs
echo    - Consultez SPOTIFY_INTEGRATION.md pour la configuration
echo.
echo 🎵 Bonne écoute avec SoundWave Music !
echo.
pause
