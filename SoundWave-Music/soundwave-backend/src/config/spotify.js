

const SpotifyWebApi = require('spotify-web-api-node');


const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID, 
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET, 
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:5000/api/auth/spotify/callback'
});

module.exports = spotifyApi; 