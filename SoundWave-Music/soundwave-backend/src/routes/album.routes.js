const express = require('express');
const router = express.Router();

// --- Importer les contrôleurs et middlewares ---
const albumController = require('../controllers/album.controller');
const { 
  protect, 
  owner,
  artist,
  validateObjectId,
  validatePagination,
  searchLimiter,
  uploadLimiter,
  activityLogger 
} = require('../middleware');
const { uploadImage } = require('../services/cloudinary.service');

// @route   GET api/albums
// @desc    Obtenir tous les albums (avec pagination)
// @access  Public
router.get('/', 
  searchLimiter, 
  validatePagination, 
  albumController.getAlbums
);

// @route   GET api/albums/user
// @desc    Obtenir les albums de l'utilisateur connecté
// @access  Private
router.get('/user',
  protect,
  validatePagination,
  albumController.getUserAlbums
);

// @route   GET api/albums/:id
// @desc    Obtenir un album par son ID
// @access  Public
router.get('/:id', 
  validateObjectId, 
  albumController.getAlbumById
);

// @route   POST api/albums
// @desc    Créer un nouvel album
// @access  Private (Artistes seulement)
router.post('/', 
  protect, 
  artist,
  uploadLimiter, 
  uploadImage.single('cover'),
  activityLogger('create_album'), 
  albumController.createAlbum
);

// @route   PUT api/albums/:id
// @desc    Mettre à jour un album
// @access  Private (Artiste propriétaire seulement)
router.put('/:id', 
  protect, 
  owner, 
  activityLogger('update_album'), 
  albumController.updateAlbum
);

// @route   DELETE api/albums/:id
// @desc    Supprimer un album
// @access  Private (Artiste propriétaire seulement)
router.delete('/:id', 
  protect, 
  owner, 
  activityLogger('delete_album'), 
  albumController.deleteAlbum
);

// @route   POST api/albums/:id/like
// @desc    Aimer/ne plus aimer un album
// @access  Private
router.post('/:id/like', 
  protect, 
  validateObjectId, 
  activityLogger('like_album'), 
  albumController.likeUnlikeAlbum
);

// @route   POST api/albums/:id/follow
// @desc    Suivre/ne plus suivre un album
// @access  Private
router.post('/:id/follow', 
  protect, 
  validateObjectId, 
  activityLogger('follow_album'), 
  albumController.followUnfollowAlbum
);

module.exports = router; 