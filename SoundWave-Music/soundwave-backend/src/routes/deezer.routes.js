const express = require('express');
const router = express.Router();
const axios = require('axios');

// Importer les middlewares
const { 
  corsAuth,
  activityLogger 
} = require('../middleware');

// Configuration de l'API Deezer
const DEEZER_API_BASE = 'https://api.deezer.com';

// @route   GET api/deezer/chart/tracks
// @desc    Obtenir les chansons tendance depuis Deezer
// @access  Public
router.get('/chart/tracks', 
  corsAuth,
  activityLogger('deezer_get_chart_tracks'), 
  async (req, res) => {
    try {
      const { limit = 20 } = req.query;
      const response = await axios.get(`${DEEZER_API_BASE}/chart/0/tracks?limit=${limit}`);
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des chansons tendance Deezer:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des chansons tendance',
        details: error.message
      });
    }
  }
);

// @route   GET api/deezer/chart/albums
// @desc    Obtenir les albums tendance depuis Deezer
// @access  Public
router.get('/chart/albums', 
  corsAuth,
  activityLogger('deezer_get_chart_albums'), 
  async (req, res) => {
    try {
      const { limit = 20 } = req.query;
      const response = await axios.get(`${DEEZER_API_BASE}/chart/0/albums?limit=${limit}`);
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des albums tendance Deezer:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des albums tendance',
        details: error.message
      });
    }
  }
);

// @route   GET api/deezer/chart/artists
// @desc    Obtenir les artistes tendance depuis Deezer
// @access  Public
router.get('/chart/artists', 
  corsAuth,
  activityLogger('deezer_get_chart_artists'), 
  async (req, res) => {
    try {
      const { limit = 20 } = req.query;
      const response = await axios.get(`${DEEZER_API_BASE}/chart/0/artists?limit=${limit}`);
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des artistes tendance Deezer:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des artistes tendance',
        details: error.message
      });
    }
  }
);

// @route   GET api/deezer/chart/playlists
// @desc    Obtenir les playlists tendance depuis Deezer
// @access  Public
router.get('/chart/playlists', 
  corsAuth,
  activityLogger('deezer_get_chart_playlists'), 
  async (req, res) => {
    try {
      const { limit = 20 } = req.query;
      const response = await axios.get(`${DEEZER_API_BASE}/chart/0/playlists?limit=${limit}`);
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des playlists tendance Deezer:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des playlists tendance',
        details: error.message
      });
    }
  }
);

// @route   GET api/deezer/search
// @desc    Rechercher dans l'API Deezer
// @access  Public
router.get('/search', 
  corsAuth,
  activityLogger('deezer_search'), 
  async (req, res) => {
    try {
      const { q, type = 'track', limit = 20 } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Paramètre de recherche requis'
        });
      }
      
      const response = await axios.get(`${DEEZER_API_BASE}/search?q=${encodeURIComponent(q)}&type=${type}&limit=${limit}`);
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('Erreur lors de la recherche Deezer:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la recherche',
        details: error.message
      });
    }
  }
);

// @route   GET api/deezer/artist/:id
// @desc    Obtenir les détails d'un artiste depuis Deezer
// @access  Public
router.get('/artist/:id', 
  corsAuth,
  activityLogger('deezer_get_artist'), 
  async (req, res) => {
    try {
      const { id } = req.params;
      const response = await axios.get(`${DEEZER_API_BASE}/artist/${id}`);
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'artiste Deezer:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de l\'artiste',
        details: error.message
      });
    }
  }
);

// @route   GET api/deezer/artist/:id/top
// @desc    Obtenir les meilleurs titres d'un artiste depuis Deezer
// @access  Public
router.get('/artist/:id/top', 
  corsAuth,
  activityLogger('deezer_get_artist_top'), 
  async (req, res) => {
    try {
      const { id } = req.params;
      const response = await axios.get(`${DEEZER_API_BASE}/artist/${id}/top`);
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des meilleurs titres de l\'artiste Deezer:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des meilleurs titres',
        details: error.message
      });
    }
  }
);

// @route   GET api/deezer/album/:id
// @desc    Obtenir les détails d'un album depuis Deezer
// @access  Public
router.get('/album/:id', 
  corsAuth,
  activityLogger('deezer_get_album'), 
  async (req, res) => {
    try {
      const { id } = req.params;
      const response = await axios.get(`${DEEZER_API_BASE}/album/${id}`);
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'album Deezer:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de l\'album',
        details: error.message
      });
    }
  }
);

// @route   GET api/deezer/playlist/:id
// @desc    Obtenir les détails d'une playlist depuis Deezer
// @access  Public
router.get('/playlist/:id', 
  corsAuth,
  activityLogger('deezer_get_playlist'), 
  async (req, res) => {
    try {
      const { id } = req.params;
      const response = await axios.get(`${DEEZER_API_BASE}/playlist/${id}`);
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la playlist Deezer:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de la playlist',
        details: error.message
      });
    }
  }
);

// @route   GET api/deezer/genre/:id/artists
// @desc    Obtenir les artistes d'un genre depuis Deezer
// @access  Public
router.get('/genre/:id/artists', 
  corsAuth,
  activityLogger('deezer_get_genre_artists'), 
  async (req, res) => {
    try {
      const { id } = req.params;
      const { limit = 20 } = req.query;
      const response = await axios.get(`${DEEZER_API_BASE}/genre/${id}/artists?limit=${limit}`);
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des artistes du genre Deezer:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des artistes du genre',
        details: error.message
      });
    }
  }
);

// @route   GET api/deezer/genre
// @desc    Obtenir tous les genres depuis Deezer
// @access  Public
router.get('/genre', 
  corsAuth,
  activityLogger('deezer_get_genres'), 
  async (req, res) => {
    try {
      const response = await axios.get(`${DEEZER_API_BASE}/genre`);
      
      res.json({
        success: true,
        data: response.data
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des genres Deezer:', error.message);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des genres',
        details: error.message
      });
    }
  }
);

module.exports = router;
