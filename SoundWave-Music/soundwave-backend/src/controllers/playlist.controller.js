const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const { AppError } = require('../middleware/error.middleware');

// @desc    Obtenir les playlists de l'utilisateur connecté
// @route   GET /api/playlists
// @access  Private
const getMyPlaylists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { isPublic, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Construire le filtre
    const filter = { owner: req.user._id };
    if (isPublic !== undefined) {
      filter.isPublic = isPublic === 'true';
    }
    
    // Construire le tri
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const playlists = await Playlist.find(filter)
      .populate('owner', 'username avatar')
      .populate('songs', 'title artist album duration')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Playlist.countDocuments(filter);
    
    res.json({
      success: true,
      data: playlists,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des playlists', 500));
  }
};

// @desc    Obtenir une playlist par son ID
// @route   GET /api/playlists/:id
// @access  Public (si la playlist est publique) ou Private
const getPlaylistById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const playlist = await Playlist.findById(id)
      .populate('owner', 'username avatar bio')
      .populate({
        path: 'songs',
        populate: {
          path: 'uploader',
          select: 'username avatar'
        }
      });
    
    if (!playlist) {
      return next(new AppError('Playlist non trouvée', 404));
    }
    
    // Vérifier si l'utilisateur peut accéder à la playlist
    if (!playlist.isPublic && (!req.user || playlist.owner._id.toString() !== req.user._id.toString())) {
      return next(new AppError('Accès non autorisé à cette playlist', 403));
    }
    
    // Incrémenter le nombre de vues
    playlist.views += 1;
    await playlist.save();
    
    res.json({
      success: true,
      data: playlist
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération de la playlist', 500));
  }
};

// @desc    Créer une nouvelle playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, isPublic = true, songs = [] } = req.body;
    const ownerId = req.user._id;
    
    // Vérifier si les chansons existent
    if (songs.length > 0) {
      const existingSongs = await Song.find({ _id: { $in: songs } });
      if (existingSongs.length !== songs.length) {
        return next(new AppError('Certaines chansons n\'existent pas', 400));
      }
    }
    
    const playlist = await Playlist.create({
      name,
      description,
      isPublic,
      owner: ownerId,
      songs
    });
    
    const populatedPlaylist = await Playlist.findById(playlist._id)
      .populate('owner', 'username avatar')
      .populate('songs', 'title artist album duration');
    
    res.status(201).json({
      success: true,
      data: populatedPlaylist
    });
  } catch (error) {
    next(new AppError('Erreur lors de la création de la playlist', 500));
  }
};

// @desc    Mettre à jour une playlist
// @route   PUT /api/playlists/:id
// @access  Private (Propriétaire seulement)
const updatePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, isPublic } = req.body;
    const userId = req.user._id;
    
    const playlist = await Playlist.findById(id);
    
    if (!playlist) {
      return next(new AppError('Playlist non trouvée', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire
    if (playlist.owner.toString() !== userId.toString()) {
      return next(new AppError('Vous n\'êtes pas autorisé à modifier cette playlist', 403));
    }
    
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      {
        name: name || playlist.name,
        description: description !== undefined ? description : playlist.description,
        isPublic: isPublic !== undefined ? isPublic : playlist.isPublic
      },
      { new: true, runValidators: true }
    )
      .populate('owner', 'username avatar')
      .populate('songs', 'title artist album duration');
    
    res.json({
      success: true,
      data: updatedPlaylist
    });
  } catch (error) {
    next(new AppError('Erreur lors de la mise à jour de la playlist', 500));
  }
};

// @desc    Supprimer une playlist
// @route   DELETE /api/playlists/:id
// @access  Private (Propriétaire seulement)
const deletePlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const playlist = await Playlist.findById(id);
    
    if (!playlist) {
      return next(new AppError('Playlist non trouvée', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire
    if (playlist.owner.toString() !== userId.toString()) {
      return next(new AppError('Vous n\'êtes pas autorisé à supprimer cette playlist', 403));
    }
    
    await Playlist.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Playlist supprimée avec succès'
    });
  } catch (error) {
    next(new AppError('Erreur lors de la suppression de la playlist', 500));
  }
};

// @desc    Ajouter une chanson à une playlist
// @route   POST /api/playlists/:id/songs
// @access  Private (Propriétaire seulement)
const addSongToPlaylist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;
    const userId = req.user._id;
    
    const playlist = await Playlist.findById(id);
    
    if (!playlist) {
      return next(new AppError('Playlist non trouvée', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire
    if (playlist.owner.toString() !== userId.toString()) {
      return next(new AppError('Vous n\'êtes pas autorisé à modifier cette playlist', 403));
    }
    
    // Vérifier si la chanson existe
    const song = await Song.findById(songId);
    if (!song) {
      return next(new AppError('Chanson non trouvée', 404));
    }
    
    // Vérifier si la chanson est déjà dans la playlist
    if (playlist.songs.includes(songId)) {
      return next(new AppError('Cette chanson est déjà dans la playlist', 400));
    }
    
    playlist.songs.push(songId);
    playlist.songsCount += 1;
    await playlist.save();
    
    const updatedPlaylist = await Playlist.findById(id)
      .populate('owner', 'username avatar')
      .populate('songs', 'title artist album duration');
    
    res.json({
      success: true,
      data: updatedPlaylist
    });
  } catch (error) {
    next(new AppError('Erreur lors de l\'ajout de la chanson à la playlist', 500));
  }
};

// @desc    Retirer une chanson d'une playlist
// @route   DELETE /api/playlists/:id/songs/:songId
// @access  Private (Propriétaire seulement)
const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { id, songId } = req.params;
    const userId = req.user._id;
    
    const playlist = await Playlist.findById(id);
    
    if (!playlist) {
      return next(new AppError('Playlist non trouvée', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire
    if (playlist.owner.toString() !== userId.toString()) {
      return next(new AppError('Vous n\'êtes pas autorisé à modifier cette playlist', 403));
    }
    
    // Vérifier si la chanson est dans la playlist
    if (!playlist.songs.includes(songId)) {
      return next(new AppError('Cette chanson n\'est pas dans la playlist', 400));
    }
    
    playlist.songs = playlist.songs.filter(song => song.toString() !== songId);
    playlist.songsCount -= 1;
    await playlist.save();
    
    const updatedPlaylist = await Playlist.findById(id)
      .populate('owner', 'username avatar')
      .populate('songs', 'title artist album duration');
    
    res.json({
      success: true,
      data: updatedPlaylist
    });
  } catch (error) {
    next(new AppError('Erreur lors de la suppression de la chanson de la playlist', 500));
  }
};

// @desc    Obtenir les playlists publiques
// @route   GET /api/playlists/public
// @access  Public
const getPublicPlaylists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Construire le filtre
    const filter = { isPublic: true };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Construire le tri
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const playlists = await Playlist.find(filter)
      .populate('owner', 'username avatar')
      .populate('songs', 'title artist album duration')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Playlist.countDocuments(filter);
    
    res.json({
      success: true,
      data: playlists,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des playlists publiques', 500));
  }
};

module.exports = {
  getMyPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getPublicPlaylists
}; 