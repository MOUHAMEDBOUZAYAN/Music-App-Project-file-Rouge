const express = require('express');
const router = express.Router();

// --- Importer les contrôleurs et middlewares ---
const adminController = require('../controllers/admin.controller');
const { 
  protect, 
  admin,
  validateObjectId,
  validatePagination,
  activityLogger 
} = require('../middleware');

// @route   GET api/admin/dashboard
// @desc    Obtenir les statistiques pour le tableau de bord admin
// @access  Private (Admin seulement)
router.get('/dashboard', 
  protect, 
  admin, 
  activityLogger('admin_dashboard_access'), 
  adminController.getDashboardStats
);

// @route   GET api/admin/users
// @desc    Obtenir la liste de tous les utilisateurs
// @access  Private (Admin seulement)
router.get('/users', 
  protect, 
  admin, 
  validatePagination, 
  adminController.getAllUsers
);

// @route   PUT api/admin/users/:id
// @desc    Mettre à jour le rôle ou le statut d'un utilisateur
// @access  Private (Admin seulement)
router.put('/users/:id', 
  protect, 
  admin, 
  validateObjectId, 
  activityLogger('admin_update_user'), 
  adminController.updateUser
);

// @route   DELETE api/admin/users/:id
// @desc    Supprimer un utilisateur
// @access  Private (Admin seulement)
router.delete('/users/:id', 
  protect, 
  admin, 
  validateObjectId, 
  activityLogger('admin_delete_user'), 
  adminController.deleteUser
);

// @route   GET api/admin/content
// @desc    Obtenir du contenu à modérer (ex: chansons reportées)
// @access  Private (Admin seulement)
router.get('/content', 
  protect, 
  admin, 
  validatePagination, 
  adminController.getContentForModeration
);

module.exports = router; 