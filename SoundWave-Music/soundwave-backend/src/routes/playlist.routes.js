const express = require('express');
const router = express.Router();

// --- Importer les contrôleurs et middlewares ---
const playlistController = require('../controllers/playlist.controller');
const { 
  protect, 
  owner,
  validatePlaylist,
  validateObjectId,
  validatePagination,
  searchLimiter,
  activityLogger 
} = require('../middleware');

// @route   GET api/playlists
// @desc    Obtenir les playlists de l'utilisateur connecté
// @access  Private
router.get('/', 
  protect, 
  validatePagination, 
  playlistController.getMyPlaylists
);

// @route   GET api/playlists/recommended
// @desc    Obtenir les playlists recommandées
// @access  Public
router.get('/recommended', playlistController.getRecommendedPlaylists);

// @route   GET api/playlists/public
// @desc    Obtenir les playlists publiques
// @access  Public
router.get('/public', playlistController.getPublicPlaylists);

// @route   GET api/playlists/draft
// @desc    Obtenir la playlist brouillon de l'utilisateur
// @access  Private
router.get('/draft', 
  protect, 
  playlistController.getDraftPlaylist
);

// @route   GET api/playlists/:id
// @desc    Obtenir une playlist par son ID
// @access  Public (si la playlist est publique) ou Private
router.get('/:id', 
  validateObjectId,
  // Middleware protect optionnel - ne bloque pas si pas de token
  (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      return protect(req, res, next);
    }
    next();
  },
  playlistController.getPlaylistById
);

// @route   POST api/playlists
// @desc    Créer une nouvelle playlist
// @access  Private
router.post('/', 
  protect, 
  validatePlaylist, 
  activityLogger('create_playlist'), 
  playlistController.createPlaylist
);

// @route   PUT api/playlists/:id
// @desc    Mettre à jour une playlist (nom, description)
// @access  Private (Propriétaire seulement)
router.put('/:id', 
  protect, 
  owner, 
  validatePlaylist, 
  activityLogger('update_playlist'), 
  playlistController.updatePlaylist
);

// @route   DELETE api/playlists/:id
// @desc    Supprimer une playlist
// @access  Private (Propriétaire seulement)
router.delete('/:id', 
  protect, 
  owner, 
  activityLogger('delete_playlist'), 
  playlistController.deletePlaylist
);

// @route   POST api/playlists/:id/songs
// @desc    Ajouter une chanson à une playlist
// @access  Private (Propriétaire seulement)
router.post('/:id/songs', 
  protect, 
  owner, 
  validateObjectId, 
  activityLogger('add_song_to_playlist'), 
  playlistController.addSongToPlaylist
);

// @route   DELETE api/playlists/:id/songs/:songId
// @desc    Retirer une chanson d'une playlist
// @access  Private (Propriétaire seulement)
router.delete('/:id/songs/:songId', 
  protect, 
  owner, 
  validateObjectId, 
  activityLogger('remove_song_from_playlist'), 
  playlistController.removeSongFromPlaylist
);

// @route   POST api/playlists/draft
// @desc    Créer une playlist brouillon
// @access  Private
router.post('/draft', 
  protect, 
  playlistController.createDraftPlaylist
);

// @route   PUT api/playlists/draft
// @desc    Mettre à jour la playlist brouillon
// @access  Private
router.put('/draft', 
  protect, 
  playlistController.updateDraftPlaylist
);

// @route   DELETE api/playlists/draft
// @desc    Supprimer la playlist brouillon
// @access  Private
router.delete('/draft', 
  protect, 
  playlistController.deleteDraftPlaylist
);

module.exports = router; 