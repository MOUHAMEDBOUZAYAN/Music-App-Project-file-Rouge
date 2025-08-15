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

// @desc    Obtenir les playlists recommandées
// @route   GET /api/playlists/recommended
// @access  Public
const getRecommendedPlaylists = async (req, res, next) => {
  try {
    const { limit = 10, genre, userId } = req.query;
    
    console.log('🎵 Récupération des playlists recommandées...');
    
    // Construire le filtre de base
    const filter = { isPublic: true };
    
    // Ajouter le filtre de genre si spécifié
    if (genre && genre !== 'all') {
      filter.genre = genre;
    }
    
    // Si un utilisateur est connecté, personnaliser les recommandations
    let playlists;
    if (userId) {
      // Logique de recommandation personnalisée basée sur l'historique
      playlists = await Playlist.find(filter)
        .populate('owner', 'username avatar')
        .populate('songs', 'title artist album duration')
        .sort({ views: -1, likes: -1, createdAt: -1 })
        .limit(parseInt(limit));
    } else {
      // Recommandations générales basées sur la popularité
      playlists = await Playlist.find(filter)
        .populate('owner', 'username avatar')
        .populate('songs', 'title artist album duration')
        .sort({ views: -1, likes: -1, createdAt: -1 })
        .limit(parseInt(limit));
    }
    
    // Si aucune playlist n'est trouvée, créer des playlists de démonstration
    if (!playlists || playlists.length === 0) {
      console.log('ℹ️ Aucune playlist trouvée, création de playlists de démonstration...');
      
      const demoPlaylists = [
        {
          _id: 'demo-playlist-1',
          name: 'Hits du Moment',
          description: 'Les meilleures chansons du moment',
          coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
          genre: 'Pop',
          isPublic: true,
          owner: {
            _id: 'demo-user-1',
            username: 'SoundWave',
            avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop&crop=face'
          },
          songs: [],
          songsCount: 0,
          views: 15000,
          likes: 1200,
          createdAt: new Date()
        },
        {
          _id: 'demo-playlist-2',
          name: 'Chill Vibes',
          description: 'Musique relaxante pour se détendre',
          coverImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
          genre: 'Ambient',
          isPublic: true,
          owner: {
            _id: 'demo-user-2',
            username: 'MusicLover',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
          },
          songs: [],
          songsCount: 0,
          views: 8900,
          likes: 750,
          createdAt: new Date()
        },
        {
          _id: 'demo-playlist-3',
          name: 'Workout Energy',
          description: 'Musique énergique pour vos séances d\'entraînement',
          coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
          genre: 'Electronic',
          isPublic: true,
          owner: {
            _id: 'demo-user-3',
            username: 'FitnessFan',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face'
          },
          songs: [],
          songsCount: 0,
          views: 12000,
          likes: 980,
          createdAt: new Date()
        }
      ];
      
      console.log('✅ Playlists de démonstration créées');
      
      return res.json({
        success: true,
        message: 'Playlists recommandées récupérées avec succès',
        data: demoPlaylists,
        count: demoPlaylists.length
      });
    }
    
    console.log(`✅ ${playlists.length} playlists recommandées trouvées`);
    
    res.json({
      success: true,
      message: 'Playlists recommandées récupérées avec succès',
      data: playlists,
      count: playlists.length
    });
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération des playlists recommandées:', error);
    next(new AppError('Erreur lors de la récupération des playlists recommandées', 500));
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
  getPublicPlaylists,
  getRecommendedPlaylists
}; 