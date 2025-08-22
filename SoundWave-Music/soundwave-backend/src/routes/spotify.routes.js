const express = require('express');
const router = express.Router();
const spotifyApi = require('../config/spotify');

// Importer les middlewares
const { 
  corsAuth,
  activityLogger 
} = require('../middleware');

// Middleware pour garantir un access token Spotify valide
const ensureAccessToken = async (req, res, next) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token Spotify manquant dans l\'en-tête Authorization' 
      });
    }
    
    const accessToken = authHeader.substring(7); // Enlever 'Bearer '
    if (!accessToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token Spotify manquant' 
      });
    }
    
    // Définir le token dans l'instance Spotify
    spotifyApi.setAccessToken(accessToken);
    next();
  } catch (err) {
    console.error('Erreur ensureAccessToken:', err.message);
    return res.status(401).json({ 
      success: false, 
      error: 'Échec de validation du token Spotify', 
      details: err.message 
    });
  }
};

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
      'playlist-modify-private',
      'user-library-read',
      'user-library-modify',
      'user-follow-read',
      'user-follow-modify',
      'user-top-read',
      'user-read-recently-played'
    ];
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'state');
    res.redirect(authorizeURL);
  }
);

// @route   GET api/auth/spotify/callback
// @desc    Recevoir le code de Spotify et rediriger vers le frontend
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
    
    if (!code) {
      return res.status(400).json({ 
        success: false,
        error: 'Code d\'autorisation manquant' 
      });
    }
    
    // Rediriger vers le frontend avec le code
    const frontendRedirectBase = process.env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:3000/spotify-callback';
    const redirectUrl = `${frontendRedirectBase}?code=${code}&state=${state}`;
    res.redirect(redirectUrl);
  }
);

// @route   POST api/auth/spotify/exchange
// @desc    Échanger le code d'autorisation contre un token
// @access  Public
router.post('/exchange', 
  corsAuth,
  activityLogger('spotify_exchange_code'), 
  async (req, res) => {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code d\'autorisation requis'
      });
    }
    
    try {
      const data = await spotifyApi.authorizationCodeGrant(code);
      console.log('Échange de code réussi');
      // Sauvegarder les tokens dans l'instance côté serveur
      try {
        spotifyApi.setAccessToken(data.body.access_token);
        spotifyApi.setRefreshToken(data.body.refresh_token);
      } catch (setErr) {
        console.warn('Impossible de définir les tokens Spotify côté serveur:', setErr.message);
      }
      
      res.json({
        success: true,
        access_token: data.body.access_token,
        refresh_token: data.body.refresh_token,
        expires_in: data.body.expires_in,
        message: 'Échange de code réussi'
      });
    } catch (err) {
      console.error('Échec de l\'échange de code:', err.message);
      res.status(400).json({ 
        success: false,
        error: 'Échec de l\'échange de code', 
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

// @route   GET api/spotify/search
// @desc    Rechercher des morceaux, artistes, albums et playlists
// @access  Private
router.get('/search', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_search'), 
  async (req, res) => {
    const { q, type, limit = 20, offset = 0 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Paramètre de recherche requis'
      });
    }
    
    try {
      const data = await spotifyApi.search(q, type || 'track,artist,album,playlist', {
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur de recherche Spotify:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur de recherche Spotify',
        details: err.message
      });
    }
  }
);

// @route   GET api/spotify/me
// @desc    Obtenir le profil de l'utilisateur connecté
// @access  Private
router.get('/me', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_get_profile'), 
  async (req, res) => {
    try {
      const data = await spotifyApi.getMe();
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur lors de la récupération du profil:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération du profil',
        details: err.message
      });
    }
  }
);

// @route   GET api/spotify/playlists
// @desc    Obtenir les playlists de l'utilisateur
// @access  Private
router.get('/playlists', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_get_playlists'), 
  async (req, res) => {
    const { limit = 20, offset = 0 } = req.query;
    
    try {
      const data = await spotifyApi.getUserPlaylists({
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des playlists:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des playlists',
        details: err.message
      });
    }
  }
);

// @route   GET api/spotify/playlist/:id
// @desc    Obtenir une playlist spécifique
// @access  Private
router.get('/playlist/:id', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_get_playlist'), 
  async (req, res) => {
    const { id } = req.params;
    
    try {
      const data = await spotifyApi.getPlaylist(id);
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur lors de la récupération de la playlist:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de la playlist',
        details: err.message
      });
    }
  }
);

// @route   GET api/spotify/album/:id
// @desc    Obtenir un album spécifique
// @access  Private
router.get('/album/:id', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_get_album'), 
  async (req, res) => {
    const { id } = req.params;
    
    try {
      const data = await spotifyApi.getAlbum(id);
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'album:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de l\'album',
        details: err.message
      });
    }
  }
);

// @route   GET api/spotify/artist/:id
// @desc    Obtenir un artiste spécifique
// @access  Private
router.get('/artist/:id', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_get_artist'), 
  async (req, res) => {
    const { id } = req.params;
    
    try {
      const data = await spotifyApi.getArtist(id);
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'artiste:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de l\'artiste',
        details: err.message
      });
    }
  }
);

// @route   GET api/spotify/artist/:id/top-tracks
// @desc    Obtenir les morceaux populaires d'un artiste
// @access  Private
router.get('/artist/:id/top-tracks', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_get_artist_top_tracks'), 
  async (req, res) => {
    const { id } = req.params;
    const { market = 'FR' } = req.query;
    
    try {
      const data = await spotifyApi.getArtistTopTracks(id, market);
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des morceaux populaires:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des morceaux populaires',
        details: err.message
      });
    }
  }
);

// @route   GET api/spotify/artist/:id/albums
// @desc    Obtenir les albums d'un artiste
// @access  Private
router.get('/artist/:id/albums', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_get_artist_albums'), 
  async (req, res) => {
    const { id } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    try {
      const data = await spotifyApi.getArtistAlbums(id, {
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des albums:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des albums',
        details: err.message
      });
    }
  }
);

// @route   GET api/spotify/recommendations
// @desc    Obtenir des recommandations basées sur des paramètres
// @access  Private
router.get('/recommendations', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_get_recommendations'), 
  async (req, res) => {
    const { 
      seed_artists, 
      seed_genres, 
      seed_tracks, 
      limit = 20,
      market = 'FR'
    } = req.query;
    
    try {
      const data = await spotifyApi.getRecommendations({
        seed_artists: seed_artists ? seed_artists.split(',') : undefined,
        seed_genres: seed_genres ? seed_genres.split(',') : undefined,
        seed_tracks: seed_tracks ? seed_tracks.split(',') : undefined,
        limit: parseInt(limit),
        market
      });
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des recommandations:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des recommandations',
        details: err.message
      });
    }
  }
);

// @route   GET api/spotify/new-releases
// @desc    Obtenir les nouvelles sorties
// @access  Private
router.get('/new-releases', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_get_new_releases'), 
  async (req, res) => {
    const { limit = 20, offset = 0, country = 'FR' } = req.query;
    
    try {
      const data = await spotifyApi.getNewReleases({
        limit: parseInt(limit),
        offset: parseInt(offset),
        country
      });
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des nouvelles sorties:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des nouvelles sorties',
        details: err.message
      });
    }
  }
);

// @route   GET api/spotify/featured-playlists
// @desc    Obtenir les playlists en vedette
// @access  Private
router.get('/featured-playlists', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_get_featured_playlists'), 
  async (req, res) => {
    const { limit = 20, offset = 0, country = 'FR' } = req.query;
    
    try {
      const data = await spotifyApi.getFeaturedPlaylists({
        limit: parseInt(limit),
        offset: parseInt(offset),
        country
      });
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des playlists en vedette:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des playlists en vedette',
        details: err.message
      });
    }
  }
);

// @route   GET api/spotify/categories
// @desc    Obtenir les catégories de playlists
// @access  Private
router.get('/categories', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_get_categories'), 
  async (req, res) => {
    const { limit = 20, offset = 0, country = 'FR' } = req.query;
    
    try {
      const data = await spotifyApi.getCategories({
        limit: parseInt(limit),
        offset: parseInt(offset),
        country
      });
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des catégories:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des catégories',
        details: err.message
      });
    }
  }
);

// @route   GET api/spotify/category/:id/playlists
// @desc    Obtenir les playlists d'une catégorie
// @access  Private
router.get('/category/:id/playlists', 
  corsAuth,
  ensureAccessToken,
  activityLogger('spotify_get_category_playlists'), 
  async (req, res) => {
    const { id } = req.params;
    const { limit = 20, offset = 0, country = 'FR' } = req.query;
    
    try {
      const data = await spotifyApi.getPlaylistsForCategory(id, {
        limit: parseInt(limit),
        offset: parseInt(offset),
        country
      });
      
      res.json({
        success: true,
        data: data.body
      });
    } catch (err) {
      console.error('Erreur lors de la récupération des playlists de catégorie:', err.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des playlists de catégorie',
        details: err.message
      });
    }
  }
);

module.exports = router; 