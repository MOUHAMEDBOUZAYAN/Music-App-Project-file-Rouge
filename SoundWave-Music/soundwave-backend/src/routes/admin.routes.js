const express = require('express');
const router = express.Router();

// --- Importer les contrôleurs et middlewares ---
// const adminController = require('../controllers/admin.controller');
// const { protect, isAdmin } = require('../middleware/auth.middleware');

// @route   GET api/admin/dashboard
// @desc    Obtenir les statistiques pour le tableau de bord admin
// @access  Private (Admin seulement)
// router.get('/dashboard', protect, isAdmin, adminController.getDashboardStats);

// @route   GET api/admin/users
// @desc    Obtenir la liste de tous les utilisateurs
// @access  Private (Admin seulement)
// router.get('/users', protect, isAdmin, adminController.getAllUsers);

// @route   PUT api/admin/users/:id
// @desc    Mettre à jour le rôle ou le statut d'un utilisateur
// @access  Private (Admin seulement)
// router.put('/users/:id', protect, isAdmin, adminController.updateUser);

// @route   DELETE api/admin/users/:id
// @desc    Supprimer un utilisateur
// @access  Private (Admin seulement)
// router.delete('/users/:id', protect, isAdmin, adminController.deleteUser);

// @route   GET api/admin/content
// @desc    Obtenir du contenu à modérer (ex: chansons reportées)
// @access  Private (Admin seulement)
// router.get('/content', protect, isAdmin, adminController.getContentForModeration);

module.exports = router; 