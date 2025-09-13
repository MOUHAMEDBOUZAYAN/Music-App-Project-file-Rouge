const express = require('express');
const router = express.Router();

// --- Importer les contrôleurs et middlewares ---
const userController = require('../controllers/user.controller');
const { 
  protect, 
  owner,
  validateUserProfile,
  validateObjectId,
  validatePagination,
  searchLimiter,
  socialActionLimiter,
  activityLogger 
} = require('../middleware');
const { uploadImage } = require('../services/cloudinary.service');

// @route   GET api/users
// @desc    Obtenir tous les utilisateurs (filtrés)
// @access  Public
router.get('/', 
  searchLimiter, 
  validatePagination, 
  userController.getUsers
);

// @route   GET api/users/profile/:username
// @desc    Obtenir le profil public d'un utilisateur
// @access  Public
router.get('/profile/:username', 
  searchLimiter, 
  userController.getUserProfile
);

// @route   PUT api/users/profile
// @desc    Mettre à jour le profil de l'utilisateur connecté
// @access  Private
router.put('/profile', 
  (req, res, next) => {
    console.log('🛣️ Route PUT /api/users/profile appelée');
    console.log('🔍 Headers:', {
      authorization: req.headers.authorization ? 'présent' : 'manquant',
      contentType: req.headers['content-type']
    });
    next();
  },
  protect, 
  uploadImage.single('profilePicture'),
  validateUserProfile, 
  activityLogger('update_profile'), 
  userController.updateUserProfile
);

// @route   POST api/users/:id/follow
// @desc    Suivre ou ne plus suivre un utilisateur
// @access  Private
router.post('/:id/follow', 
  protect, 
  validateObjectId, 
  socialActionLimiter, 
  activityLogger('follow_user'), 
  userController.followUnfollowUser
);

// @route   GET api/users/:id/followers
// @desc    Obtenir la liste des followers d'un utilisateur
// @access  Public
router.get('/:id/followers', 
  validateObjectId, 
  validatePagination, 
  userController.getFollowers
);

// @route   GET api/users/:id/following
// @desc    Obtenir la liste des utilisateurs suivis
// @access  Public
router.get('/:id/following', 
  validateObjectId, 
  validatePagination, 
  userController.getFollowing
);

// @route   GET api/users/following
// @desc    Obtenir la liste des artistes suivis par l'utilisateur connecté
// @access  Private
router.get('/following', 
  protect,
  validatePagination, 
  userController.getMyFollowing
);

// @route   GET api/users/followed-albums
// @desc    Obtenir la liste des albums suivis par l'utilisateur connecté
// @access  Private
router.get('/followed-albums', 
  protect,
  validatePagination, 
  userController.getMyFollowedAlbums
);

module.exports = router; 