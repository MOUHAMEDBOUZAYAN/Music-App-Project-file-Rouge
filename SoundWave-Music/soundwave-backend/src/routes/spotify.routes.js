const express = require('express');
const router = express.Router();
const spotifyApi = require('../config/spotify');

// Importer les middlewares
const { 
  corsAuth,
  activityLogger 
} = require('../middleware');

// @route   GET api/auth/spotify/login
// @desc    Rediriger l'utilisateur vers la page de connexion Spotify
// @access  Public
router.get('/login', 
  corsAuth,
  activityLogger('spotify_login_attempt'), 
  (req, res) => {
    const scopes = [
      'user-read-private',
      'user-read-email',
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'playlist-read-private',
      'playlist-read-collaborative',
      'playlist-modify-public',
      'playlist-modify-private'
    ];
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'state');
    res.redirect(authorizeURL);
  }
);

// @route   GET api/auth/spotify/callback
// @desc    Recevoir le code de Spotify et obtenir le token
// @access  Public
router.get('/callback', 
  corsAuth,
  activityLogger('spotify_callback'), 
  async (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    
    if (state !== 'state') {
      return res.status(400).json({ 
        success: false,
        error: 'État invalide' 
      });
    }
    
    try {
      const data = await spotifyApi.authorizationCodeGrant(code);
      console.log('Authentification avec Spotify réussie');
      
      // Envoyer les tokens au frontend ou les stocker selon le besoin
      res.json({
        success: true,
        access_token: data.body.access_token,
        refresh_token: data.body.refresh_token,
        expires_in: data.body.expires_in,
        message: 'Authentification avec Spotify réussie'
      });
    } catch (err) {
      console.error('Échec de l\'authentification avec Spotify:', err.message);
      res.status(400).json({ 
        success: false,
        error: 'Échec de l\'authentification avec Spotify', 
        details: err.message 
      });
    }
  }
);

// @route   POST api/auth/spotify/refresh
// @desc    Rafraîchir le token Spotify
// @access  Private
router.post('/refresh', 
  corsAuth,
  activityLogger('spotify_refresh_token'), 
  async (req, res) => {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token requis'
      });
    }
    
    try {
      spotifyApi.setRefreshToken(refresh_token);
      const data = await spotifyApi.refreshAccessToken();
      
      res.json({
        success: true,
        access_token: data.body.access_token,
        expires_in: data.body.expires_in,
        message: 'Token rafraîchi avec succès'
      });
    } catch (err) {
      console.error('Échec du rafraîchissement du token:', err.message);
      res.status(400).json({
        success: false,
        error: 'Échec du rafraîchissement du token',
        details: err.message
      });
    }
  }
);

module.exports = router; 