#!/bin/bash

# 🎵 Script d'installation de l'intégration Spotify pour SoundWave Music
# Ce script configure automatiquement l'environnement pour l'intégration Spotify

echo "🎵 Installation de l'intégration Spotify pour SoundWave Music"
echo "=========================================================="

# Vérification des prérequis
echo "🔍 Vérification des prérequis..."

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer avec Node.js"
    exit 1
fi

# Vérifier MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB n'est pas installé. Veuillez l'installer depuis https://mongodb.com/"
    echo "   Vous pouvez continuer l'installation, mais certaines fonctionnalités ne fonctionneront pas."
fi

echo "✅ Prérequis vérifiés"

# Configuration des variables d'environnement
echo ""
echo "🔧 Configuration des variables d'environnement..."

# Backend
if [ ! -f "soundwave-backend/.env" ]; then
    echo "📝 Création du fichier .env pour le backend..."
    cat > soundwave-backend/.env << EOF
# Configuration Spotify
SPOTIFY_CLIENT_ID=votre_client_id_spotify
SPOTIFY_CLIENT_SECRET=votre_client_secret_spotify
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/spotify/callback

# Configuration de la base de données
MONGODB_URI=mongodb://localhost:27017/soundwave

# Configuration JWT
JWT_SECRET=votre_jwt_secret_ici

# Configuration du serveur
PORT=5000
NODE_ENV=development

# Configuration CORS
CORS_ORIGIN=http://localhost:3000
EOF
    echo "✅ Fichier .env créé pour le backend"
else
    echo "ℹ️  Le fichier .env existe déjà dans le backend"
fi

# Frontend
if [ ! -f "soundwave-frontend/.env" ]; then
    echo "📝 Création du fichier .env pour le frontend..."
    cat > soundwave-frontend/.env << EOF
# Configuration de l'API
REACT_APP_API_URL=http://localhost:5000

# Configuration Spotify
REACT_APP_SPOTIFY_CLIENT_ID=votre_client_id_spotify
EOF
    echo "✅ Fichier .env créé pour le frontend"
else
    echo "ℹ️  Le fichier .env existe déjà dans le frontend"
fi

# Installation des dépendances
echo ""
echo "📦 Installation des dépendances..."

# Backend
echo "🔧 Installation des dépendances backend..."
cd soundwave-backend
npm install
cd ..

# Frontend
echo "🎨 Installation des dépendances frontend..."
cd soundwave-frontend
npm install
cd ..

echo "✅ Dépendances installées"

# Configuration de la base de données
echo ""
echo "🗄️  Configuration de la base de données..."

if command -v mongod &> /dev/null; then
    echo "🔍 Démarrage de MongoDB..."
    if pgrep -x "mongod" > /dev/null; then
        echo "✅ MongoDB est déjà en cours d'exécution"
    else
        echo "⚠️  MongoDB n'est pas démarré. Veuillez le démarrer manuellement :"
        echo "   sudo systemctl start mongod"
        echo "   ou"
        echo "   mongod --dbpath /path/to/data/db"
    fi
else
    echo "⚠️  MongoDB n'est pas installé. Veuillez l'installer manuellement."
fi

# Instructions de configuration
echo ""
echo "🎯 Instructions de configuration :"
echo "=================================="
echo ""
echo "1. 🎵 Configuration Spotify :"
echo "   - Allez sur https://developer.spotify.com/dashboard"
echo "   - Créez une nouvelle application"
echo "   - Notez votre Client ID et Client Secret"
echo "   - Ajoutez l'URL de redirection : http://localhost:5000/api/auth/spotify/callback"
echo ""
echo "2. 🔑 Mise à jour des variables d'environnement :"
echo "   - Modifiez soundwave-backend/.env avec vos vraies valeurs"
echo "   - Modifiez soundwave-frontend/.env avec vos vraies valeurs"
echo ""
echo "3. 🚀 Démarrage de l'application :"
echo "   - Terminal 1 (Backend) : cd soundwave-backend && npm run dev"
echo "   - Terminal 2 (Frontend) : cd soundwave-frontend && npm run dev"
echo ""
echo "4. 🌐 Accès à l'application :"
echo "   - Frontend : http://localhost:3000"
echo "   - Backend API : http://localhost:5000"
echo ""

# Vérification des ports
echo "🔍 Vérification des ports..."

# Vérifier le port 3000 (Frontend)
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Le port 3000 est déjà utilisé. Le frontend pourrait ne pas démarrer."
else
    echo "✅ Le port 3000 est disponible pour le frontend"
fi

# Vérifier le port 5000 (Backend)
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Le port 5000 est déjà utilisé. Le backend pourrait ne pas démarrer."
else
    echo "✅ Le port 5000 est disponible pour le backend"
fi

echo ""
echo "🎉 Installation terminée !"
echo ""
echo "📚 Documentation :"
echo "   - Guide complet : SPOTIFY_INTEGRATION.md"
echo "   - API Spotify : https://developer.spotify.com/documentation/web-api/"
echo ""
echo "🆘 Support :"
echo "   - Vérifiez les logs dans la console"
echo "   - Consultez le fichier SPOTIFY_INTEGRATION.md"
echo "   - Vérifiez que tous les services sont démarrés"
echo ""
echo "🎵 Bon développement avec SoundWave Music !"
