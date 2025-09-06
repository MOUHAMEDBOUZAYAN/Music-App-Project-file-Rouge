@echo off
echo ========================================
echo    Configuration de la base de donnees
echo ========================================
echo.

echo 1. Installation de MongoDB...
echo    - Telechargez MongoDB Community Server depuis: https://www.mongodb.com/try/download/community
echo    - Installez MongoDB avec les options par defaut
echo    - Demarrez le service MongoDB
echo.

echo 2. Configuration du fichier .env...
echo    - Copiez env.example vers .env
echo    - Modifiez les valeurs selon votre configuration
echo.

echo 3. Demarrage de l'application...
echo    - Backend: start-backend.bat
echo    - Frontend: start-frontend.bat
echo.

echo ========================================
echo    Instructions detailees:
echo ========================================
echo.
echo 1. INSTALLER MONGODB:
echo    - Allez sur https://www.mongodb.com/try/download/community
echo    - Telechargez MongoDB Community Server pour Windows
echo    - Installez avec les options par defaut
echo    - Le service MongoDB se demarrera automatiquement
echo.
echo 2. CONFIGURER L'ENVIRONNEMENT:
echo    - Copiez le fichier env.example vers .env
echo    - Modifiez MONGODB_URI si necessaire
echo    - Changez JWT_SECRET pour la securite
echo.
echo 3. DEMARRER L'APPLICATION:
echo    - Ouvrez un terminal dans le dossier soundwave-backend
echo    - Executez: npm install
echo    - Executez: npm run dev
echo    - Dans un autre terminal, allez dans soundwave-frontend
echo    - Executez: npm install
echo    - Executez: npm run dev
echo.
echo 4. TESTER L'APPLICATION:
echo    - Allez sur http://localhost:3000
echo    - Inscrivez-vous comme artiste
echo    - Connectez-vous et uploadez des musiques
echo.
pause
