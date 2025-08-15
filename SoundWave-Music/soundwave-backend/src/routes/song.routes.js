const express = require('express');
const router = express.Router();

// --- Importer les contrôleurs et middlewares ---
const songController = require('../controllers/song.controller');
const { 
  protect, 
  artist,
  owner,
  validateSong,
  validateObjectId,
  validatePagination,
  validateSearch,
  validateComment,
  searchLimiter,
  uploadLimiter,
  commentLimiter,
  socialActionLimiter,
  activityLogger 
} = require('../middleware');
// const { uploadAudio } = require('../middleware/upload.middleware'); // Middleware pour l'upload

// @route   GET api/songs
// @desc    Rechercher des chansons
// @access  Public
router.get('/', 
  searchLimiter, 
  validateSearch, 
  validatePagination, 
  songController.searchSongs
);

// @route   GET api/songs/all
// @desc    Obtenir toutes les chansons (pour les albums récents)
// @access  Public
router.get('/all', 
  validatePagination, 
  songController.getAllSongs
);

// @route   GET api/songs/trending
// @desc    Obtenir les chansons tendance
// @access  Public
router.get('/trending', 
  validatePagination, 
  songController.getTrendingSongs
);

// @route   GET api/songs/:id
// @desc    Obtenir les détails d'une chanson
// @access  Public
router.get('/:id', 
  validateObjectId, 
  songController.getSongById
);

// @route   POST api/songs
// @desc    Uploader une nouvelle chanson
// @access  Private (Artistes seulement)
router.post('/', 
  protect, 
  artist,
  uploadLimiter, 
  validateSong, 
  activityLogger('upload_song'), 
  songController.uploadSong
);

// @route   PUT api/songs/:id
// @desc    Mettre à jour une chanson
// @access  Private (Artiste propriétaire seulement)
router.put('/:id', 
  protect, 
  artist,
  owner, 
  validateSong, 
  activityLogger('update_song'), 
  songController.updateSong
);

// @route   DELETE api/songs/:id
// @desc    Supprimer une chanson
// @access  Private (Artiste propriétaire seulement)
router.delete('/:id', 
  protect, 
  artist,
  owner, 
  activityLogger('delete_song'), 
  songController.deleteSong
);

// @route   POST api/songs/:id/like
// @desc    Aimer/ne plus aimer une chanson
// @access  Private
router.post('/:id/like', 
  protect, 
  validateObjectId, 
  socialActionLimiter, 
  activityLogger('like_song'), 
  songController.likeUnlikeSong
);

// @route   POST api/songs/:id/comment
// @desc    Ajouter un commentaire à une chanson
// @access  Private
router.post('/:id/comment', 
  protect, 
  validateObjectId, 
  validateComment, 
  commentLimiter, 
  activityLogger('comment_song'), 
  songController.addComment
);

module.exports = router; 