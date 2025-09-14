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
        { 'artist.name': { $regex: search, $options: 'i' } },
        { 'artist.username': { $regex: search, $options: 'i' } }
      ];
    }
    if (artist) {
      filter.$or = [
        { 'artist.name': { $regex: artist, $options: 'i' } },
        { 'artist.username': { $regex: artist, $options: 'i' } }
      ];
    }
    if (genre) {
      filter.genre = { $regex: genre, $options: 'i' };
    }
    
    // Construire le tri
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const albums = await Album.find(filter)
      .populate('artist', 'username name profilePicture')
      .populate({
        path: 'songs',
        select: 'title duration audioUrl coverImage artist',
        populate: {
          path: 'artist',
          select: 'username'
        }
      })
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
          path: 'artist',
          select: 'username avatar'
        }
      });
    
    if (!album) {
      return next(new AppError('Album non trouvé', 404));
    }
    
    // Incrémenter le nombre de vues (si le champ existe)
    if (album.views !== undefined) {
      album.views += 1;
      await album.save();
    }
    
    res.json({
      success: true,
      data: album
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'album:', error);
    next(new AppError('Erreur lors de la récupération de l\'album', 500));
  }
};

// @desc    Créer un nouvel album
// @route   POST /api/albums
// @access  Private (Artistes seulement)
const createAlbum = async (req, res, next) => {
  try {
    const { title, genre, releaseDate, description, songs = [] } = req.body;
    const artistId = req.user._id;
    
    console.log('🎵 Create Album - Données reçues:', {
      title,
      genre,
      releaseDate,
      description,
      songs,
      artistId,
      files: req.files,
      file: req.file
    });
    
    // Vérifier si l'utilisateur est un artiste
    if (req.user.role !== 'artist' && req.user.role !== 'admin') {
      return next(new AppError('Seuls les artistes peuvent créer des albums', 403));
    }
    
    // Upload de la cover si présente (stockage local via uploadImage)
    let coverImage = null;
    if (req.file && req.file.filename) {
      coverImage = `/uploads/images/${req.file.filename}`;
    }
    
    // Vérifier si les chansons existent et appartiennent à l'artiste
    let songIds = [];
    if (songs && songs.length > 0) {
      try {
        songIds = JSON.parse(songs);
      } catch (e) {
        songIds = songs;
      }
      
      if (songIds.length > 0) {
        const existingSongs = await Song.find({ 
          _id: { $in: songIds },
          artist: artistId
        });
        if (existingSongs.length !== songIds.length) {
          return next(new AppError('Certaines chansons n\'existent pas ou ne vous appartiennent pas', 400));
        }
      }
    }
    
    const album = await Album.create({
      title,
      artist: artistId,
      genre,
      releaseDate: releaseDate || new Date(),
      coverImage,
      songs: songIds,
      songsCount: songIds.length
    });
    
    console.log('✅ Album créé avec succès:', album._id);
    
    const populatedAlbum = await Album.findById(album._id)
      .populate('artist', 'username profilePicture bio')
      .populate('songs', 'title duration coverImage');
    
    res.status(201).json({
      success: true,
      data: populatedAlbum
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'album:', error);
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
    if (album.artist.toString() !== userId.toString() && req.user.role !== 'admin') {
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
    
    console.log('🗑️ Delete Album - ID:', id, 'User:', userId);
    
    const album = await Album.findById(id);
    
    if (!album) {
      return next(new AppError('Album non trouvé', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire ou un admin
    if (album.artist.toString() !== userId.toString() && req.user.role !== 'admin') {
      return next(new AppError('Vous n\'êtes pas autorisé à supprimer cet album', 403));
    }
    
    // Supprimer l'image de couverture
    if (album.coverImage) {
      const fs = require('fs');
      const path = require('path');
      const coverPath = path.join(__dirname, '../../', album.coverImage);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }
    
    await Album.findByIdAndDelete(id);
    
    console.log('✅ Album supprimé avec succès:', id);
    
    res.json({
      success: true,
      message: 'Album supprimé avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'album:', error);
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
    if (album.artist.toString() !== userId.toString()) {
      return next(new AppError('Vous n\'êtes pas autorisé à modifier cet album', 403));
    }
    
    // Vérifier si la chanson existe et appartient à l'artiste
    const song = await Song.findOne({ _id: songId, artist: userId });
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
    if (album.artist.toString() !== userId.toString()) {
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

// @desc    Obtenir les albums de l'utilisateur connecté
// @route   GET /api/albums/user
// @access  Private
const getUserAlbums = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const albums = await Album.find({ artist: userId })
      .populate('artist', 'username profilePicture bio')
      .populate('songs', 'title duration coverImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Album.countDocuments({ artist: userId });
    
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
    next(new AppError('Erreur lors de la récupération de vos albums', 500));
  }
};

// @desc    Aimer/ne plus aimer un album
// @route   POST /api/albums/:id/like
// @access  Private
const likeUnlikeAlbum = async (req, res, next) => {
  try {
    const albumId = req.params.id;
    const userId = req.user._id;
    
    console.log('🎵 Like/Unlike album request:', { albumId, userId });
    
    const album = await Album.findById(albumId);
    if (!album) {
      return next(new AppError('Album non trouvé', 404));
    }
    
    const isLiked = album.likes.includes(userId);
    
    if (isLiked) {
      // Retirer le like
      album.likes = album.likes.filter(like => like.toString() !== userId.toString());
      album.likesCount = Math.max(0, album.likesCount - 1);
      await album.save();
      console.log('✅ Album unliked successfully');
    } else {
      // Ajouter le like
      album.likes.push(userId);
      album.likesCount = album.likes.length;
      await album.save();
      console.log('✅ Album liked successfully');
    }
    
    res.json({
      success: true,
      message: isLiked ? 'Album retiré de vos favoris' : 'Album ajouté à vos favoris',
      isLiked: !isLiked,
      likesCount: album.likes.length
    });
  } catch (error) {
    console.error('❌ Error in likeUnlikeAlbum:', error);
    next(new AppError('Erreur lors de la mise à jour des favoris', 500));
  }
};

// @desc    Suivre/ne plus suivre un album
// @route   POST /api/albums/:id/follow
// @access  Private
const followUnfollowAlbum = async (req, res, next) => {
  try {
    const albumId = req.params.id;
    const userId = req.user._id;
    
    console.log('💿 Follow/Unfollow album request:', { albumId, userId });
    
    const album = await Album.findById(albumId);
    if (!album) {
      return next(new AppError('Album non trouvé', 404));
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }
    
    const isFollowing = user.followedAlbums.includes(albumId);
    
    if (isFollowing) {
      // Ne plus suivre l'album
      user.followedAlbums = user.followedAlbums.filter(id => id.toString() !== albumId);
      album.followers = album.followers.filter(id => id.toString() !== userId);
      await user.save();
      await album.save();
      console.log('✅ Album unfollowed successfully');
      
      res.json({
        success: true,
        message: 'Album retiré de vos suivis',
        isFollowing: false,
        followersCount: album.followers.length
      });
    } else {
      // Suivre l'album
      user.followedAlbums.push(albumId);
      album.followers.push(userId);
      await user.save();
      await album.save();
      console.log('✅ Album followed successfully');
      
      res.json({
        success: true,
        message: 'Album ajouté à vos suivis',
        isFollowing: true,
        followersCount: album.followers.length
      });
    }
  } catch (error) {
    console.error('❌ Error in followUnfollowAlbum:', error);
    next(new AppError('Erreur lors de la mise à jour du suivi de l\'album', 500));
  }
};

module.exports = {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addSongToAlbum,
  removeSongFromAlbum,
  getUserAlbums,
  likeUnlikeAlbum,
  followUnfollowAlbum
}; 