

const SpotifyWebApi = require('spotify-web-api-node');

// Configuration par défaut pour le développement
const defaultConfig = {
  clientId: process.env.SPOTIFY_CLIENT_ID || 'default_client_id',
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'default_client_secret',
  // Doit correspondre EXACTEMENT au Redirect URI enregistré dans le dashboard Spotify
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000/spotify-callback'
};

// Vérification des variables d'environnement
if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.warn('⚠️  ATTENTION: Variables d\'environnement Spotify non configurées !');
  console.warn('   Créez un fichier .env avec SPOTIFY_CLIENT_ID et SPOTIFY_CLIENT_SECRET');
  console.warn('   ou configurez vos variables d\'environnement système.');
}

const spotifyApi = new SpotifyWebApi(defaultConfig);

// Ajouter des méthodes utilitaires pour gérer les tokens
spotifyApi.getAccessToken = function() {
  return this._credentials?.accessToken;
};

spotifyApi.getRefreshToken = function() {
  return this._credentials?.refreshToken;
};

spotifyApi.setAccessToken = function(token) {
  this._credentials = this._credentials || {};
  this._credentials.accessToken = token;
  // Appeler la méthode originale de SpotifyWebApi
  SpotifyWebApi.prototype.setAccessToken.call(this, token);
};

spotifyApi.setRefreshToken = function(token) {
  this._credentials = this._credentials || {};
  this._credentials.refreshToken = token;
  // Appeler la méthode originale de SpotifyWebApi
  SpotifyWebApi.prototype.setRefreshToken.call(this, token);
};

module.exports = spotifyApi; 