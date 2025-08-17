@echo off
chcp 65001 >nul
echo 🎵 Installation de l'intégration Spotify pour SoundWave Music
echo ==========================================================

echo.
echo 🔍 Vérification des prérequis...

REM Vérifier Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas installé. Veuillez l'installer avec Node.js
    pause
    exit /b 1
)

echo ✅ Prérequis vérifiés

echo.
echo 🔧 Configuration des variables d'environnement...

REM Backend
if not exist "soundwave-backend\.env" (
    echo 📝 Création du fichier .env pour le backend...
    (
        echo # Configuration Spotify
        echo SPOTIFY_CLIENT_ID=votre_client_id_spotify
        echo SPOTIFY_CLIENT_SECRET=votre_client_secret_spotify
        echo SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/spotify/callback
        echo.
        echo # Configuration de la base de données
        echo MONGODB_URI=mongodb://localhost:27017/soundwave
        echo.
        echo # Configuration JWT
        echo JWT_SECRET=votre_jwt_secret_ici
        echo.
        echo # Configuration du serveur
        echo PORT=5000
        echo NODE_ENV=development
        echo.
        echo # Configuration CORS
        echo CORS_ORIGIN=http://localhost:3000
    ) > soundwave-backend\.env
    echo ✅ Fichier .env créé pour le backend
) else (
    echo ℹ️  Le fichier .env existe déjà dans le backend
)

REM Frontend
if not exist "soundwave-frontend\.env" (
    echo 📝 Création du fichier .env pour le frontend...
    (
        echo # Configuration de l'API
        echo REACT_APP_API_URL=http://localhost:5000
        echo.
        echo # Configuration Spotify
        echo REACT_APP_SPOTIFY_CLIENT_ID=votre_client_id_spotify
    ) > soundwave-frontend\.env
    echo ✅ Fichier .env créé pour le frontend
) else (
    echo ℹ️  Le fichier .env existe déjà dans le frontend
)

echo.
echo 📦 Installation des dépendances...

REM Backend
echo 🔧 Installation des dépendances backend...
cd soundwave-backend
call npm install
cd ..

REM Frontend
echo 🎨 Installation des dépendances frontend...
cd soundwave-frontend
call npm install
cd ..

echo ✅ Dépendances installées

echo.
echo 🎯 Instructions de configuration :
echo ==================================
echo.
echo 1. 🎵 Configuration Spotify :
echo    - Allez sur https://developer.spotify.com/dashboard
echo    - Créez une nouvelle application
echo    - Notez votre Client ID et Client Secret
echo    - Ajoutez l'URL de redirection : http://localhost:5000/api/auth/spotify/callback
echo.
echo 2. 🔑 Mise à jour des variables d'environnement :
echo    - Modifiez soundwave-backend\.env avec vos vraies valeurs
echo    - Modifiez soundwave-frontend\.env avec vos vraies valeurs
echo.
echo 3. 🚀 Démarrage de l'application :
echo    - Terminal 1 (Backend) : cd soundwave-backend ^&^& npm run dev
echo    - Terminal 2 (Frontend) : cd soundwave-frontend ^&^& npm run dev
echo.
echo 4. 🌐 Accès à l'application :
echo    - Frontend : http://localhost:3000
echo    - Backend API : http://localhost:5000
echo.

echo 🎉 Installation terminée !
echo.
echo 📚 Documentation :
echo    - Guide complet : SPOTIFY_INTEGRATION.md
echo    - API Spotify : https://developer.spotify.com/documentation/web-api/
echo.
echo 🆘 Support :
echo    - Vérifiez les logs dans la console
echo    - Consultez le fichier SPOTIFY_INTEGRATION.md
echo    - Vérifiez que tous les services sont démarrés
echo.
echo 🎵 Bon développement avec SoundWave Music !
echo.
pause
