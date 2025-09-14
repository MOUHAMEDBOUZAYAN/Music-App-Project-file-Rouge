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
  activityLogger,
} = require('../middleware');
const { param } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation.middleware');
const { uploadMultiple } = require('../services/cloudinary.service');

// @route   GET api/songs
// @desc    Rechercher des chansons
// @access  Public
router.get('/', 
  searchLimiter, 
  validateSearch, 
  validatePagination, 
  songController.searchSongs
);

// @route   GET api/songs/search
// @desc    Rechercher des chansons (endpoint alternatif)
// @access  Public
router.get('/search', 
  searchLimiter, 
  validateSearch, 
  validatePagination, 
  songController.searchSongs
);

// @route   GET api/search/songs
// @desc    Rechercher des chansons (endpoint alternatif)
// @access  Public
router.get('/songs', 
  searchLimiter, 
  validateSearch, 
  validatePagination, 
  songController.searchSongs
);


// @route   GET api/songs/test
// @desc    Tester la base de données
// @access  Public
router.get('/test', songController.testDatabase);

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

// @route   GET api/songs/liked
// @desc    Obtenir les chansons likées par l'utilisateur connecté
// @access  Private
router.get('/liked',
  protect,
  songController.getLikedSongs
);

// @route   GET api/songs/user
// @desc    Obtenir les chansons de l'utilisateur connecté
// @access  Private
router.get('/user',
  protect,
  validatePagination,
  songController.getUserSongs
);

// @route   GET api/songs/artist/:artistId
// @desc    Obtenir les chansons d'un artiste spécifique
// @access  Public
router.get('/artist/:artistId',
  param('artistId').isMongoId().withMessage('ID artiste invalide'),
  handleValidationErrors,
  validatePagination,
  songController.getSongsByArtist
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
  uploadMultiple.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  (err, req, res, next) => {
    if (err) {
      console.error('❌ Erreur Multer:', err);
      return res.status(400).json({
        success: false,
        message: 'Erreur lors de l\'upload du fichier',
        error: err.message
      });
    }
    next();
  },
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
  (req, res, next) => {
    console.log('🔄 Song Update Route - Request received');
    console.log('🔄 Song Update Route - Files:', req.files);
    next();
  },
  (req, res, next) => {
    console.log('🔄 Song Update Route - Before multer, content-type:', req.headers['content-type']);
    console.log('🔄 Song Update Route - Before multer, content-length:', req.headers['content-length']);
    
    // التحقق من content-type
    if (!req.headers['content-type'] || !req.headers['content-type'].includes('multipart/form-data')) {
      console.error('❌ Song Update Route - Invalid content-type:', req.headers['content-type']);
      return res.status(400).json({
        success: false,
        message: 'Content-Type doit être multipart/form-data',
        error: 'Invalid content-type'
      });
    }
    
    try {
      uploadMultiple.fields([
        { name: 'audio', maxCount: 1 },
        { name: 'cover', maxCount: 1 }
      ])(req, res, (err) => {
        if (err) {
          console.error('❌ Multer middleware error:', err);
          console.error('❌ Multer error details:', {
            message: err.message,
            code: err.code,
            field: err.field,
            stack: err.stack
          });
          return res.status(400).json({
            success: false,
            message: 'Erreur lors du traitement des fichiers',
            error: err.message
          });
        }
        console.log('🔄 Song Update Route - After multer, files:', req.files);
        console.log('🔄 Song Update Route - After multer, body:', req.body);
        next();
      });
    } catch (error) {
      console.error('❌ Song Update Route - Multer setup error:', error);
      return res.status(500).json({
        success: false,
        message: 'Erreur lors de la configuration du traitement des fichiers',
        error: error.message
      });
    }
  },
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

// @route   GET api/songs/liked
// @desc    Obtenir les chansons likées par l'utilisateur connecté
// @access  Private
// (déplacé plus haut avant ":id")

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