const Song = require('../models/Song');
const User = require('../models/User');
const { AppError } = require('../middleware/error.middleware');
// const { uploadToCloudinary } = require('../services/cloudinary.service'); // not used with local storage

// @desc    Rechercher des chansons
// @route   GET /api/songs
// @access  Public
const searchSongs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { q, genre, artist, album, sortBy = 'createdAt', sortOrder = 'desc', sort, order } = req.query;
    
    // Construire le filtre
    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { artist: { $regex: q, $options: 'i' } },
        { album: { $regex: q, $options: 'i' } }
      ];
    }
    if (genre) {
      filter.genre = { $regex: genre, $options: 'i' };
    }
    if (artist) {
      filter.artist = { $regex: artist, $options: 'i' };
    }
    if (album) {
      filter.album = { $regex: album, $options: 'i' };
    }
    
    // Construire le tri (gérer les deux formats: sortBy/sortOrder et sort/order)
    const sortField = sort || sortBy;
    const sortDirection = order || sortOrder;
    
    // Validation des champs de tri autorisés
    const allowedSortFields = ['createdAt', 'releaseDate', 'title', 'artist', 'genre', 'views', 'playCount', 'likes'];
    const allowedSortOrders = ['asc', 'desc', '1', '-1'];
    
    if (sortField && !allowedSortFields.includes(sortField)) {
      return res.status(400).json({
        success: false,
        message: 'Champ de tri non autorisé',
        details: `Champs autorisés: ${allowedSortFields.join(', ')}`
      });
    }
    
    if (sortDirection && !allowedSortOrders.includes(sortDirection)) {
      return res.status(400).json({
        success: false,
        message: 'Ordre de tri non autorisé',
        details: 'Ordres autorisés: asc, desc, 1, -1'
      });
    }
    
    const sortObj = {};
    if (sortField) {
      sortObj[sortField] = sortDirection === 'desc' || sortDirection === '-1' ? -1 : 1;
    } else {
      sortObj.createdAt = -1; // Tri par défaut
    }
    
    const songs = await Song.find(filter)
      .populate('uploader', 'username avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
    
    const total = await Song.countDocuments(filter);
    
    res.json({
      success: true,
      data: songs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la recherche de chansons', 500));
  }
};

// @desc    Obtenir les détails d'une chanson
// @route   GET /api/songs/:id
// @access  Public
const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const song = await Song.findById(id)
      .populate('uploader', 'username avatar bio')
      .populate('artist', 'username name avatar')
      .populate('album', 'title name cover artwork')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      });
    
    if (!song) {
      return next(new AppError('Chanson non trouvée', 404));
    }
    
    // Incrémenter le nombre de vues
    song.views = (song.views || 0) + 1;
    await song.save();
    
    res.json({
      success: true,
      data: song
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération de la chanson', 500));
  }
};

// @desc    Uploader une nouvelle chanson
// @route   POST /api/songs
// @access  Private
const uploadSong = async (req, res, next) => {
  try {
    const { title, artist, album, genre, duration, spotifyId, description } = req.body;
    const uploaderId = req.user._id;
    
    // Upload du fichier audio si présent (stockage local)
    let audioUrl = null;
    if (req.file && req.file.filename) {
      audioUrl = `/uploads/audio/${req.file.filename}`;
    }
    
    const song = await Song.create({
      title,
      artist,
      album,
      genre,
      duration: duration ? parseInt(duration) : undefined,
      spotifyId,
      description,
      audioUrl,
      uploader: uploaderId
    });
    
    const populatedSong = await Song.findById(song._id)
      .populate('uploader', 'username avatar');
    
    res.status(201).json({
      success: true,
      data: populatedSong
    });
  } catch (error) {
    next(new AppError('Erreur lors de l\'upload de la chanson', 500));
  }
};

// @desc    Mettre à jour une chanson
// @route   PUT /api/songs/:id
// @access  Private
const updateSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, artist, album, genre, duration, description } = req.body;
    const userId = req.user._id;
    
    const song = await Song.findById(id);
    
    if (!song) {
      return next(new AppError('Chanson non trouvée', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire ou un admin
    if (song.uploader.toString() !== userId.toString() && req.user.role !== 'admin') {
      return next(new AppError('Vous n\'êtes pas autorisé à modifier cette chanson', 403));
    }
    
    const updatedSong = await Song.findByIdAndUpdate(
      id,
      {
        title: title || song.title,
        artist: artist || song.artist,
        album: album || song.album,
        genre: genre || song.genre,
        duration: duration ? parseInt(duration) : song.duration,
        description: description || song.description
      },
      { new: true, runValidators: true }
    ).populate('uploader', 'username avatar');
    
    res.json({
      success: true,
      data: updatedSong
    });
  } catch (error) {
    next(new AppError('Erreur lors de la mise à jour de la chanson', 500));
  }
};

// @desc    Supprimer une chanson
// @route   DELETE /api/songs/:id
// @access  Private
const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const song = await Song.findById(id);
    
    if (!song) {
      return next(new AppError('Chanson non trouvée', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire ou un admin
    if (song.uploader.toString() !== userId.toString() && req.user.role !== 'admin') {
      return next(new AppError('Vous n\'êtes pas autorisé à supprimer cette chanson', 403));
    }
    
    await Song.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Chanson supprimée avec succès'
    });
  } catch (error) {
    next(new AppError('Erreur lors de la suppression de la chanson', 500));
  }
};

// @desc    Aimer/ne plus aimer une chanson
// @route   POST /api/songs/:id/like
// @access  Private
const likeUnlikeSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const song = await Song.findById(id);
    
    if (!song) {
      return next(new AppError('Chanson non trouvée', 404));
    }
    
    const isLiked = song.likes.map(id => id.toString()).includes(userId.toString());
    
    if (isLiked) {
      // Ne plus aimer
      song.likes = song.likes.filter(likeId => likeId.toString() !== userId.toString());
    } else {
      // Aimer
      song.likes.push(userId);
    }
    
    await song.save();
    
    res.json({
      success: true,
      data: {
        liked: !isLiked,
        likesCount: song.likes.length
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de l\'action like', 500));
  }
};

// @desc    Obtenir les chansons likées par l'utilisateur connecté
// @route   GET /api/songs/liked
// @access  Private
const getLikedSongs = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const ExternalFavorite = require('../models/ExternalFavorite');

    const songs = await Song.find({ likes: userId })
      .populate('artist', 'username name')
      .populate('album', 'title name cover');

    // Fetch external favorites (e.g., Deezer) and return as lightweight entries
    const externals = await ExternalFavorite.find({ user: userId });

    const response = [
      ...songs.map(s => ({
        type: 'local',
        _id: s._id,
        title: s.title,
        artist: s.artist?.name || s.artist?.username,
        album: s.album?.title || s.album?.name,
        cover: s.coverImage || s.album?.cover,
        duration: s.duration,
        createdAt: s.createdAt
      })),
      ...externals.map(e => ({
        type: 'external',
        provider: e.provider,
        externalId: e.externalId,
        title: e.title,
        artist: e.artist,
        album: e.album,
        cover: e.cover,
        duration: e.duration,
        createdAt: e.createdAt
      }))
    ];

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des chansons likées', 500));
  }
};

// @desc    Ajouter un commentaire à une chanson
// @route   POST /api/songs/:id/comment
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
    const song = await Song.findById(id);
    
    if (!song) {
      return next(new AppError('Chanson non trouvée', 404));
    }
    
    const comment = {
      user: userId,
      content,
      createdAt: new Date()
    };
    
    song.comments.push(comment);
    song.commentsCount += 1;
    await song.save();
    
    // Récupérer le commentaire avec les informations de l'utilisateur
    const populatedSong = await Song.findById(id)
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      });
    
    const newComment = populatedSong.comments[populatedSong.comments.length - 1];
    
    res.status(201).json({
      success: true,
      data: newComment
    });
  } catch (error) {
    next(new AppError('Erreur lors de l\'ajout du commentaire', 500));
  }
};

// @desc    Obtenir les chansons tendance
// @route   GET /api/songs/trending
// @access  Public
const getTrendingSongs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const songs = await Song.find()
      .populate('uploader', 'username avatar')
      .sort({ views: -1, likesCount: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Song.countDocuments();
    
    res.json({
      success: true,
      data: songs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des chansons tendance', 500));
  }
};

// @desc    Obtenir toutes les chansons (pour les albums récents)
// @route   GET /api/songs/all
// @access  Public
const getAllSongs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { sortBy = 'createdAt', sortOrder = 'desc', sort, order } = req.query;
    
    // Construire le tri (gérer les deux formats: sortBy/sortOrder et sort/order)
    const sortField = sort || sortBy;
    const sortDirection = order || sortOrder;
    
    // Validation des champs de tri autorisés
    const allowedSortFields = ['createdAt', 'releaseDate', 'title', 'artist', 'genre', 'views', 'playCount', 'likes'];
    const allowedSortOrders = ['asc', 'desc', '1', '-1'];
    
    if (sortField && !allowedSortFields.includes(sortField)) {
      return res.status(400).json({
        success: false,
        message: 'Champ de tri non autorisé',
        details: `Champs autorisés: ${allowedSortFields.join(', ')}`
      });
    }
    
    if (sortDirection && !allowedSortOrders.includes(sortDirection)) {
      return res.status(400).json({
        success: false,
        message: 'Ordre de tri non autorisé',
        details: 'Ordres autorisés: asc, desc, 1, -1'
      });
    }
    
    const sortObj = {};
    if (sortField) {
      sortObj[sortField] = sortDirection === 'desc' || sortDirection === '-1' ? -1 : 1;
    } else {
      sortObj.createdAt = -1; // Tri par défaut
    }
    
    const songs = await Song.find({})
      .populate('uploader', 'username avatar')
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
    
    const total = await Song.countDocuments({});
    
    res.json({
      success: true,
      data: songs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des chansons', 500));
  }
};

module.exports = {
  searchSongs,
  getSongById,
  uploadSong,
  updateSong,
  deleteSong,
  likeUnlikeSong,
  getLikedSongs,
  addComment,
  getTrendingSongs,
  getAllSongs
}; 