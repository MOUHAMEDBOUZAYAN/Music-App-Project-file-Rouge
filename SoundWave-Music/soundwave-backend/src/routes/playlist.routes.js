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

// @route   GET api/playlists/:id
// @desc    Obtenir une playlist par son ID
// @access  Public (si la playlist est publique) ou Private
router.get('/:id', 
  validateObjectId, 
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

module.exports = router; 