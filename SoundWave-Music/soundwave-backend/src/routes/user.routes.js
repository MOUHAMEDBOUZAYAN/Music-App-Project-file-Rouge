const express = require('express');
const router = express.Router();

// --- Importer les contrôleurs et middlewares ---
// const userController = require('../controllers/user.controller');
// const { protect } = require('../middleware/auth.middleware');

// @route   GET api/users
// @desc    Obtenir tous les utilisateurs (filtrés)
// @access  Public
// router.get('/', userController.getUsers);

// @route   GET api/users/profile/:username
// @desc    Obtenir le profil public d'un utilisateur
// @access  Public
// router.get('/profile/:username', userController.getUserProfile);

// @route   PUT api/users/profile
// @desc    Mettre à jour le profil de l'utilisateur connecté
// @access  Private
// router.put('/profile', protect, userController.updateUserProfile);

// @route   POST api/users/:id/follow
// @desc    Suivre ou ne plus suivre un utilisateur
// @access  Private
// router.post('/:id/follow', protect, userController.followUnfollowUser);

// @route   GET api/users/:id/followers
// @desc    Obtenir la liste des followers d'un utilisateur
// @access  Public
// router.get('/:id/followers', userController.getFollowers);

// @route   GET api/users/:id/following
// @desc    Obtenir la liste des utilisateurs suivis
// @access  Public
// router.get('/:id/following', userController.getFollowing);


module.exports = router; 