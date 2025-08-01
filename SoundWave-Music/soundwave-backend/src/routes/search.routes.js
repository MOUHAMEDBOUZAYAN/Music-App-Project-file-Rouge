const express = require('express');
const router = express.Router();

// --- Importer les contrôleurs et middlewares ---
const searchController = require('../controllers/search.controller');
const { 
  validateSearch,
  validatePagination,
  searchLimiter,
  activityLogger 
} = require('../middleware');

// @route   GET api/search
// @desc    Recherche globale (chansons, artistes, albums, playlists, utilisateurs)
// @access  Public
router.get('/', 
  searchLimiter, 
  validateSearch, 
  validatePagination, 
  activityLogger('global_search'), 
  searchController.globalSearch
);

// @route   GET api/search/songs
// @desc    Rechercher des chansons
// @access  Public
router.get('/songs', 
  searchLimiter, 
  validateSearch, 
  validatePagination, 
  activityLogger('search_songs'), 
  searchController.searchSongs
);

// @route   GET api/search/artists
// @desc    Rechercher des artistes
// @access  Public
router.get('/artists', 
  searchLimiter, 
  validateSearch, 
  validatePagination, 
  activityLogger('search_artists'), 
  searchController.searchArtists
);

// @route   GET api/search/albums
// @desc    Rechercher des albums
// @access  Public
router.get('/albums', 
  searchLimiter, 
  validateSearch, 
  validatePagination, 
  activityLogger('search_albums'), 
  searchController.searchAlbums
);

// @route   GET api/search/playlists
// @desc    Rechercher des playlists
// @access  Public
router.get('/playlists', 
  searchLimiter, 
  validateSearch, 
  validatePagination, 
  activityLogger('search_playlists'), 
  searchController.searchPlaylists
);

// @route   GET api/search/users
// @desc    Rechercher des utilisateurs
// @access  Public
router.get('/users', 
  searchLimiter, 
  validateSearch, 
  validatePagination, 
  activityLogger('search_users'), 
  searchController.searchUsers
);

// @route   GET api/search/trending
// @desc    Obtenir les tendances actuelles
// @access  Public
router.get('/trending', 
  searchLimiter, 
  validatePagination, 
  activityLogger('trending_search'), 
  searchController.getTrending
);

// @route   GET api/search/recommendations
// @desc    Obtenir des recommandations personnalisées
// @access  Private
router.get('/recommendations', 
  searchLimiter, 
  validatePagination, 
  activityLogger('recommendations_search'), 
  searchController.getRecommendations
);

module.exports = router; 