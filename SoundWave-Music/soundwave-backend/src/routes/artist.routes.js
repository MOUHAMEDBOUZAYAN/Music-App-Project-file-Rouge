const express = require('express');
const router = express.Router();

// Importer les contrôleurs d'artiste
const { 
  getPopularArtists, 
  getArtistById, 
  searchArtists, 
  followArtist, 
  unfollowArtist,
  getArtistSongs,
  getArtistAlbums,
  getMySongs,
  getMyAlbums
} = require('../controllers/artist.controller.js');

// Importer les middlewares
const { protect, artist } = require('../middleware');

// @route   GET api/artists/popular
// @desc    Obtenir les artistes populaires
// @access  Public
router.get('/popular', getPopularArtists);

// @route   GET api/artists/search
// @desc    Rechercher des artistes
// @access  Public
router.get('/search', searchArtists);

// @route   GET api/artists/:id
// @desc    Obtenir un artiste par ID
// @access  Public
router.get('/:id', getArtistById);

// @route   POST api/artists/:id/follow
// @desc    Suivre un artiste
// @access  Private
router.post('/:id/follow', protect, followArtist);

// @route   DELETE api/artists/:id/follow
// @desc    Ne plus suivre un artiste
// @access  Private
router.delete('/:id/follow', protect, unfollowArtist);

// @route   GET api/artists/:id/songs
// @desc    Obtenir les chansons d'un artiste
// @access  Public
router.get('/:id/songs', getArtistSongs);

// @route   GET api/artists/:id/albums
// @desc    Obtenir les albums d'un artiste
// @access  Public
router.get('/:id/albums', getArtistAlbums);

// @route   GET api/artists/me/songs
// @desc    Obtenir mes chansons (pour l'artiste connecté)
// @access  Private (Artistes seulement)
router.get('/me/songs', protect, artist, getMySongs);

// @route   GET api/artists/me/albums
// @desc    Obtenir mes albums (pour l'artiste connecté)
// @access  Private (Artistes seulement)
router.get('/me/albums', protect, artist, getMyAlbums);

module.exports = router;
