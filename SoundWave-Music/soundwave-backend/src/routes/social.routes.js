const express = require('express');
const router = express.Router();

// --- Importer les contrôleurs et middlewares ---
const socialController = require('../controllers/social.controller');
const { 
  protect,
  validateObjectId,
  validatePagination,
  validateComment,
  socialActionLimiter,
  commentLimiter,
  activityLogger 
} = require('../middleware');

// @route   POST api/social/like/:type/:id
// @desc    Aimer/ne plus aimer un élément (chanson, album, playlist)
// @access  Private
router.post('/like/:type/:id', 
  protect, 
  validateObjectId, 
  socialActionLimiter, 
  activityLogger('like_content'), 
  socialController.likeContent
);

// @route   POST api/social/comment/:type/:id
// @desc    Ajouter un commentaire à un élément
// @access  Private
router.post('/comment/:type/:id', 
  protect, 
  validateObjectId, 
  validateComment, 
  commentLimiter, 
  activityLogger('comment_content'), 
  socialController.addComment
);

// @route   DELETE api/social/comment/:commentId
// @desc    Supprimer un commentaire
// @access  Private (propriétaire du commentaire)
router.delete('/comment/:commentId', 
  protect, 
  validateObjectId, 
  activityLogger('delete_comment'), 
  socialController.deleteComment
);

// @route   GET api/social/feed
// @desc    Obtenir le flux d'activité de l'utilisateur
// @access  Private
router.get('/feed', 
  protect, 
  validatePagination, 
  socialController.getFeed
);

// @route   GET api/social/activity/:userId
// @desc    Obtenir l'activité d'un utilisateur
// @access  Public
router.get('/activity/:userId', 
  validateObjectId, 
  validatePagination, 
  socialController.getUserActivity
);

// @route   POST api/social/share/:type/:id
// @desc    Partager un élément
// @access  Private
router.post('/share/:type/:id', 
  protect, 
  validateObjectId, 
  socialActionLimiter, 
  activityLogger('share_content'), 
  socialController.shareContent
);

// @route   GET api/social/trending
// @desc    Obtenir les éléments tendance
// @access  Public
router.get('/trending', 
  validatePagination, 
  socialController.getTrending
);

// @route   POST api/social/report/:type/:id
// @desc    Signaler un élément
// @access  Private
router.post('/report/:type/:id', 
  protect, 
  validateObjectId, 
  socialActionLimiter, 
  activityLogger('report_content'), 
  socialController.reportContent
);

// @route   GET api/social/notifications
// @desc    Obtenir les notifications de l'utilisateur
// @access  Private
router.get('/notifications', 
  protect, 
  validatePagination, 
  socialController.getNotifications
);

// @route   PUT api/social/notifications/:id/read
// @desc    Marquer une notification comme lue
// @access  Private
router.put('/notifications/:id/read', 
  protect, 
  validateObjectId, 
  socialController.markNotificationAsRead
);

// @route   DELETE api/social/notifications/:id
// @desc    Supprimer une notification
// @access  Private
router.delete('/notifications/:id', 
  protect, 
  validateObjectId, 
  socialController.deleteNotification
);

module.exports = router; 