const express = require('express');
const router = express.Router();

// --- Importer les contrôleurs et middlewares ---
// const playlistController = require('../controllers/playlist.controller');
// const { protect } = require('../middleware/auth.middleware');

// @route   GET api/playlists
// @desc    Obtenir les playlists de l'utilisateur connecté
// @access  Private
// router.get('/', protect, playlistController.getMyPlaylists);

// @route   GET api/playlists/:id
// @desc    Obtenir une playlist par son ID
// @access  Public (si la playlist est publique) ou Private
// router.get('/:id', playlistController.getPlaylistById);

// @route   POST api/playlists
// @desc    Créer une nouvelle playlist
// @access  Private
// router.post('/', protect, playlistController.createPlaylist);

// @route   PUT api/playlists/:id
// @desc    Mettre à jour une playlist (nom, description)
// @access  Private (Propriétaire seulement)
// router.put('/:id', protect, playlistController.updatePlaylist);

// @route   DELETE api/playlists/:id
// @desc    Supprimer une playlist
// @access  Private (Propriétaire seulement)
// router.delete('/:id', protect, playlistController.deletePlaylist);

// @route   POST api/playlists/:id/songs
// @desc    Ajouter une chanson à une playlist
// @access  Private (Propriétaire seulement)
// router.post('/:id/songs', protect, playlistController.addSongToPlaylist);

// @route   DELETE api/playlists/:id/songs/:songId
// @desc    Retirer une chanson d'une playlist
// @access  Private (Propriétaire seulement)
// router.delete('/:id/songs/:songId', protect, playlistController.removeSongFromPlaylist);


module.exports = router; 