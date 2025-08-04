const User = require('../models/User');
const Song = require('../models/Song');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const { AppError } = require('../middleware/error.middleware');

// @desc    Obtenir les statistiques pour le tableau de bord admin
// @route   GET /api/admin/dashboard
// @access  Private (Admin seulement)
const getDashboardStats = async (req, res, next) => {
  try {
    // Statistiques des utilisateurs
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    const artistsCount = await User.countDocuments({ role: 'artist' });
    const listenersCount = await User.countDocuments({ role: 'listener' });

    // Statistiques des chansons
    const totalSongs = await Song.countDocuments();
    const songsThisMonth = await Song.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    const totalViews = await Song.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    // Statistiques des albums
    const totalAlbums = await Album.countDocuments();
    const albumsThisMonth = await Album.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });

    // Statistiques des playlists
    const totalPlaylists = await Playlist.countDocuments();
    const publicPlaylists = await Playlist.countDocuments({ isPublic: true });

    // Top chansons
    const topSongs = await Song.find()
      .sort({ views: -1, likesCount: -1 })
      .limit(5)
      .populate('uploader', 'username');

    // Top artistes
    const topArtists = await User.aggregate([
      { $match: { role: 'artist' } },
      { $lookup: { from: 'songs', localField: '_id', foreignField: 'uploader', as: 'songs' } },
      { $addFields: { totalViews: { $sum: '$songs.views' } } },
      { $sort: { totalViews: -1 } },
      { $limit: 5 },
      { $project: { username: 1, avatar: 1, totalViews: 1 } }
    ]);

    // Activité récente
    const recentSongs = await Song.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('uploader', 'username avatar');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('username email role createdAt');

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
          artists: artistsCount,
          listeners: listenersCount
        },
        songs: {
          total: totalSongs,
          newThisMonth: songsThisMonth,
          totalViews: totalViews[0]?.totalViews || 0
        },
        albums: {
          total: totalAlbums,
          newThisMonth: albumsThisMonth
        },
        playlists: {
          total: totalPlaylists,
          public: publicPlaylists
        },
        topSongs,
        topArtists,
        recentSongs,
        recentUsers
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des statistiques', 500));
  }
};

// @desc    Obtenir la liste de tous les utilisateurs
// @route   GET /api/admin/users
// @access  Private (Admin seulement)
const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { search, role, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Construire le filtre
    const filter = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      filter.role = role;
    }
    if (status) {
      filter.status = status;
    }
    
    // Construire le tri
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(filter);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des utilisateurs', 500));
  }
};

// @desc    Mettre à jour le rôle ou le statut d'un utilisateur
// @route   PUT /api/admin/users/:id
// @access  Private (Admin seulement)
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, status, isVerified } = req.body;
    
    const user = await User.findById(id);
    
    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }
    
    // Empêcher la modification de son propre rôle
    if (id === req.user._id.toString()) {
      return next(new AppError('Vous ne pouvez pas modifier votre propre rôle', 400));
    }
    
    const updateData = {};
    if (role) updateData.role = role;
    if (status !== undefined) updateData.status = status;
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(new AppError('Erreur lors de la mise à jour de l\'utilisateur', 500));
  }
};

// @desc    Supprimer un utilisateur
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin seulement)
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }
    
    // Empêcher la suppression de son propre compte
    if (id === req.user._id.toString()) {
      return next(new AppError('Vous ne pouvez pas supprimer votre propre compte', 400));
    }
    
    // Supprimer toutes les données associées
    await Song.deleteMany({ uploader: id });
    await Album.deleteMany({ artistId: id });
    await Playlist.deleteMany({ owner: id });
    
    await User.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    next(new AppError('Erreur lors de la suppression de l\'utilisateur', 500));
  }
};

// @desc    Obtenir du contenu à modérer
// @route   GET /api/admin/content
// @access  Private (Admin seulement)
const getContentForModeration = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { type, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let content = [];
    let total = 0;
    
    if (type === 'songs' || !type) {
      const songs = await Song.find({ status: 'pending' })
        .populate('uploader', 'username email')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit);
      
      content = songs.map(song => ({
        ...song.toObject(),
        contentType: 'song'
      }));
      
      total = await Song.countDocuments({ status: 'pending' });
    }
    
    if (type === 'albums') {
      const albums = await Album.find({ status: 'pending' })
        .populate('artist', 'username email')
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit);
      
      content = albums.map(album => ({
        ...album.toObject(),
        contentType: 'album'
      }));
      
      total = await Album.countDocuments({ status: 'pending' });
    }
    
    res.json({
      success: true,
      data: content,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération du contenu à modérer', 500));
  }
};

// @desc    Approuver ou rejeter du contenu
// @route   PUT /api/admin/content/:type/:id
// @access  Private (Admin seulement)
const moderateContent = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { status, reason } = req.body;
    
    let content;
    
    if (type === 'song') {
      content = await Song.findByIdAndUpdate(
        id,
        { status, moderationReason: reason },
        { new: true }
      ).populate('uploader', 'username email');
    } else if (type === 'album') {
      content = await Album.findByIdAndUpdate(
        id,
        { status, moderationReason: reason },
        { new: true }
      ).populate('artist', 'username email');
    } else {
      return next(new AppError('Type de contenu non supporté', 400));
    }
    
    if (!content) {
      return next(new AppError('Contenu non trouvé', 404));
    }
    
    res.json({
      success: true,
      data: content
    });
  } catch (error) {
    next(new AppError('Erreur lors de la modération du contenu', 500));
  }
};

// @desc    Obtenir les rapports de contenu
// @route   GET /api/admin/reports
// @access  Private (Admin seulement)
const getReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Ici vous pouvez implémenter la logique pour récupérer les rapports
    // depuis une collection de rapports si vous en avez une
    
    res.json({
      success: true,
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        pages: 0
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des rapports', 500));
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser,
  getContentForModeration,
  moderateContent,
  getReports
}; 