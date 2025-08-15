const express = require('express');
const router = express.Router();

// Importer les contrôleurs d'artiste
const { 
  getPopularArtists, 
  getArtistById, 
  searchArtists, 
  followArtist, 
  unfollowArtist 
} = require('../controllers/artist.controller.js');

// Importer les middlewares
const { protect } = require('../middleware');

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

module.exports = router;
