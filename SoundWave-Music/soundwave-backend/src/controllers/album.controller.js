const Album = require('../models/Album');
const Song = require('../models/Song');
const { AppError } = require('../middleware/error.middleware');

// @desc    Obtenir tous les albums (avec pagination)
// @route   GET /api/albums
// @access  Public
const getAlbums = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { search, artist, genre, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Construire le filtre
    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } }
      ];
    }
    if (artist) {
      filter.artist = { $regex: artist, $options: 'i' };
    }
    if (genre) {
      filter.genre = { $regex: genre, $options: 'i' };
    }
    
    // Construire le tri
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const albums = await Album.find(filter)
      .populate('artist', 'username avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Album.countDocuments(filter);
    
    res.json({
      success: true,
      data: albums,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des albums', 500));
  }
};

// @desc    Obtenir un album par son ID
// @route   GET /api/albums/:id
// @access  Public
const getAlbumById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const album = await Album.findById(id)
      .populate('artist', 'username avatar bio')
      .populate({
        path: 'songs',
        populate: {
          path: 'uploader',
          select: 'username avatar'
        }
      });
    
    if (!album) {
      return next(new AppError('Album non trouvé', 404));
    }
    
    // Incrémenter le nombre de vues
    album.views += 1;
    await album.save();
    
    res.json({
      success: true,
      data: album
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération de l\'album', 500));
  }
};

// @desc    Créer un nouvel album
// @route   POST /api/albums
// @access  Private (Artistes seulement)
const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, genre, releaseDate, description, songs = [] } = req.body;
    const artistId = req.user._id;
    
    // Vérifier si l'utilisateur est un artiste
    if (req.user.role !== 'artist' && req.user.role !== 'admin') {
      return next(new AppError('Seuls les artistes peuvent créer des albums', 403));
    }
    
    // Upload de la cover si présente (stockage local via uploadImage)
    let coverUrl = null;
    if (req.file && req.file.filename) {
      coverUrl = `/uploads/images/${req.file.filename}`;
    }
    
    // Vérifier si les chansons existent et appartiennent à l'artiste
    if (songs.length > 0) {
      const existingSongs = await Song.find({ 
        _id: { $in: songs },
        uploader: artistId
      });
      if (existingSongs.length !== songs.length) {
        return next(new AppError('Certaines chansons n\'existent pas ou ne vous appartiennent pas', 400));
      }
    }
    
    const album = await Album.create({
      title,
      artist: artist || req.user.username,
      genre,
      releaseDate: releaseDate || new Date(),
      description,
      coverUrl,
      songs,
      artistId
    });
    
    const populatedAlbum = await Album.findById(album._id)
      .populate('artist', 'username avatar')
      .populate('songs', 'title duration');
    
    res.status(201).json({
      success: true,
      data: populatedAlbum
    });
  } catch (error) {
    next(new AppError('Erreur lors de la création de l\'album', 500));
  }
};

// @desc    Mettre à jour un album
// @route   PUT /api/albums/:id
// @access  Private (Artiste propriétaire seulement)
const updateAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, artist, genre, releaseDate, description, songs } = req.body;
    const userId = req.user._id;
    
    const album = await Album.findById(id);
    
    if (!album) {
      return next(new AppError('Album non trouvé', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire ou un admin
    if (album.artistId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return next(new AppError('Vous n\'êtes pas autorisé à modifier cet album', 403));
    }
    
    const updatedAlbum = await Album.findByIdAndUpdate(
      id,
      {
        title: title || album.title,
        artist: artist || album.artist,
        genre: genre || album.genre,
        releaseDate: releaseDate || album.releaseDate,
        description: description || album.description,
        songs: songs || album.songs
      },
      { new: true, runValidators: true }
    )
      .populate('artist', 'username avatar')
      .populate('songs', 'title duration');
    
    res.json({
      success: true,
      data: updatedAlbum
    });
  } catch (error) {
    next(new AppError('Erreur lors de la mise à jour de l\'album', 500));
  }
};

// @desc    Supprimer un album
// @route   DELETE /api/albums/:id
// @access  Private (Artiste propriétaire seulement)
const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const album = await Album.findById(id);
    
    if (!album) {
      return next(new AppError('Album non trouvé', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire ou un admin
    if (album.artistId.toString() !== userId.toString() && req.user.role !== 'admin') {
      return next(new AppError('Vous n\'êtes pas autorisé à supprimer cet album', 403));
    }
    
    await Album.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Album supprimé avec succès'
    });
  } catch (error) {
    next(new AppError('Erreur lors de la suppression de l\'album', 500));
  }
};

// @desc    Ajouter une chanson à un album
// @route   POST /api/albums/:id/songs
// @access  Private (Artiste propriétaire seulement)
const addSongToAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { songId } = req.body;
    const userId = req.user._id;
    
    const album = await Album.findById(id);
    
    if (!album) {
      return next(new AppError('Album non trouvé', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire
    if (album.artistId.toString() !== userId.toString()) {
      return next(new AppError('Vous n\'êtes pas autorisé à modifier cet album', 403));
    }
    
    // Vérifier si la chanson existe et appartient à l'artiste
    const song = await Song.findOne({ _id: songId, uploader: userId });
    if (!song) {
      return next(new AppError('Chanson non trouvée ou ne vous appartient pas', 404));
    }
    
    // Vérifier si la chanson est déjà dans l'album
    if (album.songs.includes(songId)) {
      return next(new AppError('Cette chanson est déjà dans l\'album', 400));
    }
    
    album.songs.push(songId);
    album.songsCount += 1;
    await album.save();
    
    const updatedAlbum = await Album.findById(id)
      .populate('artist', 'username avatar')
      .populate('songs', 'title duration');
    
    res.json({
      success: true,
      data: updatedAlbum
    });
  } catch (error) {
    next(new AppError('Erreur lors de l\'ajout de la chanson à l\'album', 500));
  }
};

// @desc    Retirer une chanson d'un album
// @route   DELETE /api/albums/:id/songs/:songId
// @access  Private (Artiste propriétaire seulement)
const removeSongFromAlbum = async (req, res, next) => {
  try {
    const { id, songId } = req.params;
    const userId = req.user._id;
    
    const album = await Album.findById(id);
    
    if (!album) {
      return next(new AppError('Album non trouvé', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire
    if (album.artistId.toString() !== userId.toString()) {
      return next(new AppError('Vous n\'êtes pas autorisé à modifier cet album', 403));
    }
    
    // Vérifier si la chanson est dans l'album
    if (!album.songs.includes(songId)) {
      return next(new AppError('Cette chanson n\'est pas dans l\'album', 400));
    }
    
    album.songs = album.songs.filter(song => song.toString() !== songId);
    album.songsCount -= 1;
    await album.save();
    
    const updatedAlbum = await Album.findById(id)
      .populate('artist', 'username avatar')
      .populate('songs', 'title duration');
    
    res.json({
      success: true,
      data: updatedAlbum
    });
  } catch (error) {
    next(new AppError('Erreur lors de la suppression de la chanson de l\'album', 500));
  }
};

module.exports = {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addSongToAlbum,
  removeSongFromAlbum
}; 