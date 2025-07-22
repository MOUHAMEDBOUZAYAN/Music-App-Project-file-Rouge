const express = require('express');
const router = express.Router();

// --- Importer les contrôleurs et middlewares ---
// const songController = require('../controllers/song.controller');
// const { protect, isArtist } = require('../middleware/auth.middleware');
// const { uploadAudio } = require('../middleware/upload.middleware'); // Middleware pour l'upload

// @route   GET api/songs
// @desc    Rechercher des chansons
// @access  Public
// router.get('/', songController.searchSongs);

// @route   GET api/songs/:id
// @desc    Obtenir les détails d'une chanson
// @access  Public
// router.get('/:id', songController.getSongById);

// @route   POST api/songs
// @desc    Uploader une nouvelle chanson
// @access  Private (Artistes seulement)
// router.post('/', protect, isArtist, uploadAudio, songController.uploadSong);

// @route   PUT api/songs/:id
// @desc    Mettre à jour une chanson
// @access  Private (Artiste propriétaire seulement)
// router.put('/:id', protect, isArtist, songController.updateSong);

// @route   DELETE api/songs/:id
// @desc    Supprimer une chanson
// @access  Private (Artiste propriétaire seulement)
// router.delete('/:id', protect, isArtist, songController.deleteSong);

// @route   POST api/songs/:id/like
// @desc    Aimer/ne plus aimer une chanson
// @access  Private
// router.post('/:id/like', protect, songController.likeUnlikeSong);

// @route   POST api/songs/:id/comment
// @desc    Ajouter un commentaire à une chanson
// @access  Private
// router.post('/:id/comment', protect, songController.addComment);

module.exports = router; 