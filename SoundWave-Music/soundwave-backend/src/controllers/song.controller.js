const Song = require('../models/Song');
const User = require('../models/User');
const { AppError } = require('../middleware/error.middleware');
const { uploadToCloudinary } = require('../services/cloudinary.service');

// @desc    Rechercher des chansons
// @route   GET /api/songs
// @access  Public
const searchSongs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { q, genre, artist, album, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
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
    
    // Construire le tri
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const songs = await Song.find(filter)
      .populate('uploader', 'username avatar')
      .sort(sort)
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
    song.views += 1;
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
    
    // Vérifier si l'utilisateur est un artiste
    if (req.user.role !== 'artist' && req.user.role !== 'admin') {
      return next(new AppError('Seuls les artistes peuvent uploader des chansons', 403));
    }
    
    // Upload du fichier audio si présent
    let audioUrl = null;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file, 'songs');
      audioUrl = uploadResult.secure_url;
    }
    
    const song = await Song.create({
      title,
      artist,
      album,
      genre,
      duration: parseInt(duration),
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
    
    const isLiked = song.likes.includes(userId);
    
    if (isLiked) {
      // Ne plus aimer
      song.likes = song.likes.filter(likeId => likeId.toString() !== userId.toString());
      song.likesCount -= 1;
    } else {
      // Aimer
      song.likes.push(userId);
      song.likesCount += 1;
    }
    
    await song.save();
    
    res.json({
      success: true,
      data: {
        liked: !isLiked,
        likesCount: song.likesCount
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de l\'action like', 500));
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

module.exports = {
  searchSongs,
  getSongById,
  uploadSong,
  updateSong,
  deleteSong,
  likeUnlikeSong,
  addComment,
  getTrendingSongs
}; 