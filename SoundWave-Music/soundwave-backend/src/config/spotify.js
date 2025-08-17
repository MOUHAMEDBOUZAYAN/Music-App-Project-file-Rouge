

const SpotifyWebApi = require('spotify-web-api-node');

// Configuration par défaut pour le développement
const defaultConfig = {
  clientId: process.env.SPOTIFY_CLIENT_ID || 'default_client_id',
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'default_client_secret',
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:5000/api/auth/spotify/callback'
};

// Vérification des variables d'environnement
if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.warn('⚠️  ATTENTION: Variables d\'environnement Spotify non configurées !');
  console.warn('   Créez un fichier .env avec SPOTIFY_CLIENT_ID et SPOTIFY_CLIENT_SECRET');
  console.warn('   ou configurez vos variables d\'environnement système.');
}

const spotifyApi = new SpotifyWebApi(defaultConfig);

module.exports = spotifyApi; 