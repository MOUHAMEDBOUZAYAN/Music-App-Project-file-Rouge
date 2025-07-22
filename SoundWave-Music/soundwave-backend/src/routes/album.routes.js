const express = require('express');
const router = express.Router();

// --- Importer les contrôleurs et middlewares ---
// const albumController = require('../controllers/album.controller');
// const { protect, isArtist } = require('../middleware/auth.middleware');

// @route   GET api/albums
// @desc    Obtenir tous les albums (avec pagination)
// @access  Public
// router.get('/', albumController.getAlbums);

// @route   GET api/albums/:id
// @desc    Obtenir un album par son ID
// @access  Public
// router.get('/:id', albumController.getAlbumById);

// @route   POST api/albums
// @desc    Créer un nouvel album
// @access  Private (Artistes seulement)
// router.post('/', protect, isArtist, albumController.createAlbum);

// @route   PUT api/albums/:id
// @desc    Mettre à jour un album
// @access  Private (Artiste propriétaire seulement)
// router.put('/:id', protect, isArtist, albumController.updateAlbum);

// @route   DELETE api/albums/:id
// @desc    Supprimer un album
// @access  Private (Artiste propriétaire seulement)
// router.delete('/:id', protect, isArtist, albumController.deleteAlbum);

module.exports = router; 