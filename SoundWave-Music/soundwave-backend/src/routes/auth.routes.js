const express = require('express');
const router = express.Router();

// Importer les contrôleurs d'authentification
const { register, login } = require('../controllers/auth.controller.js');

// Importer les middlewares
const { 
  validateRegister, 
  validateLogin, 
  authLimiter, 
  registerLimiter,
  activityLogger 
} = require('../middleware');

// @route   POST api/auth/register
// @desc    Enregistrer un nouvel utilisateur
// @access  Public
router.post('/register', 
  registerLimiter, 
  validateRegister, 
  activityLogger('user_register'), 
  register
);

// @route   POST api/auth/login
// @desc    Connecter un utilisateur et retourner un token
// @access  Public
router.post('/login', 
  authLimiter, 
  validateLogin, 
  activityLogger('user_login'), 
  login
);

// Note: La route de déconnexion est généralement gérée côté client
// en supprimant le token. Si une logique côté serveur est nécessaire
// (ex: liste de tokens invalides), elle peut être ajoutée ici.
// Pour l'instant, elle reste en commentaire.
// const { logout } = require('../controllers/auth.controller');
// @route   GET api/auth/logout
// @desc    Déconnecter un utilisateur
// @access  Private
// router.get('/logout', protect, logout);

module.exports = router; 