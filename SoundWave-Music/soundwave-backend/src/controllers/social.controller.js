const Song = require('../models/Song');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const User = require('../models/User');
const { AppError } = require('../middleware/error.middleware');

// @desc    Aimer/ne plus aimer un élément
// @route   POST /api/social/like/:type/:id
// @access  Private
const likeContent = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const userId = req.user._id;
    
    let content;
    let isLiked = false;
    
    switch (type) {
      case 'song':
        content = await Song.findById(id);
        if (!content) {
          return next(new AppError('Chanson non trouvée', 404));
        }
        isLiked = content.likes.includes(userId);
        
        if (isLiked) {
          content.likes = content.likes.filter(likeId => likeId.toString() !== userId.toString());
          content.likesCount -= 1;
        } else {
          content.likes.push(userId);
          content.likesCount += 1;
        }
        break;
        
      case 'album':
        content = await Album.findById(id);
        if (!content) {
          return next(new AppError('Album non trouvé', 404));
        }
        isLiked = content.likes.includes(userId);
        
        if (isLiked) {
          content.likes = content.likes.filter(likeId => likeId.toString() !== userId.toString());
          content.likesCount -= 1;
        } else {
          content.likes.push(userId);
          content.likesCount += 1;
        }
        break;
        
      case 'playlist':
        content = await Playlist.findById(id);
        if (!content) {
          return next(new AppError('Playlist non trouvée', 404));
        }
        isLiked = content.likes.includes(userId);
        
        if (isLiked) {
          content.likes = content.likes.filter(likeId => likeId.toString() !== userId.toString());
          content.likesCount -= 1;
        } else {
          content.likes.push(userId);
          content.likesCount += 1;
        }
        break;
        
      default:
        return next(new AppError('Type de contenu non supporté', 400));
    }
    
    await content.save();
    
    res.json({
      success: true,
      data: {
        liked: !isLiked,
        likesCount: content.likesCount
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de l\'action like', 500));
  }
};

// @desc    Ajouter un commentaire à un élément
// @route   POST /api/social/comment/:type/:id
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
    let targetContent;
    
    switch (type) {
      case 'song':
        targetContent = await Song.findById(id);
        if (!targetContent) {
          return next(new AppError('Chanson non trouvée', 404));
        }
        break;
        
      case 'album':
        targetContent = await Album.findById(id);
        if (!targetContent) {
          return next(new AppError('Album non trouvé', 404));
        }
        break;
        
      case 'playlist':
        targetContent = await Playlist.findById(id);
        if (!targetContent) {
          return next(new AppError('Playlist non trouvée', 404));
        }
        break;
        
      default:
        return next(new AppError('Type de contenu non supporté', 400));
    }
    
    const comment = {
      user: userId,
      content,
      createdAt: new Date()
    };
    
    targetContent.comments.push(comment);
    targetContent.commentsCount += 1;
    await targetContent.save();
    
    // Récupérer le commentaire avec les informations de l'utilisateur
    const populatedContent = await targetContent.constructor.findById(id)
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      });
    
    const newComment = populatedContent.comments[populatedContent.comments.length - 1];
    
    res.status(201).json({
      success: true,
      data: newComment
    });
  } catch (error) {
    next(new AppError('Erreur lors de l\'ajout du commentaire', 500));
  }
};

// @desc    Supprimer un commentaire
// @route   DELETE /api/social/comment/:commentId
// @access  Private
const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;
    
    // Chercher le commentaire dans tous les types de contenu
    let content = await Song.findOne({ 'comments._id': commentId });
    let contentType = 'song';
    
    if (!content) {
      content = await Album.findOne({ 'comments._id': commentId });
      contentType = 'album';
    }
    
    if (!content) {
      content = await Playlist.findOne({ 'comments._id': commentId });
      contentType = 'playlist';
    }
    
    if (!content) {
      return next(new AppError('Commentaire non trouvé', 404));
    }
    
    const comment = content.comments.id(commentId);
    
    // Vérifier si l'utilisateur est le propriétaire du commentaire
    if (comment.user.toString() !== userId.toString()) {
      return next(new AppError('Vous n\'êtes pas autorisé à supprimer ce commentaire', 403));
    }
    
    comment.remove();
    content.commentsCount -= 1;
    await content.save();
    
    res.json({
      success: true,
      message: 'Commentaire supprimé avec succès'
    });
  } catch (error) {
    next(new AppError('Erreur lors de la suppression du commentaire', 500));
  }
};

// @desc    Obtenir le flux d'activité de l'utilisateur
// @route   GET /api/social/feed
// @access  Private
const getFeed = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const userId = req.user._id;
    
    // Obtenir les utilisateurs que l'utilisateur suit
    const following = await User.findById(userId).populate('following');
    const followingIds = following.following.map(user => user._id);
    
    // Obtenir les activités récentes
    const activities = [];
    
    // Nouvelles chansons des artistes suivis
    const newSongs = await Song.find({
      uploader: { $in: followingIds }
    })
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    newSongs.forEach(song => {
      activities.push({
        type: 'new_song',
        content: song,
        user: song.uploader,
        createdAt: song.createdAt
      });
    });
    
    // Nouvelles playlists des utilisateurs suivis
    const newPlaylists = await Playlist.find({
      owner: { $in: followingIds },
      isPublic: true
    })
      .populate('owner', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    newPlaylists.forEach(playlist => {
      activities.push({
        type: 'new_playlist',
        content: playlist,
        user: playlist.owner,
        createdAt: playlist.createdAt
      });
    });
    
    // Trier toutes les activités par date
    activities.sort((a, b) => b.createdAt - a.createdAt);
    
    // Pagination
    const paginatedActivities = activities.slice(skip, skip + limit);
    
    res.json({
      success: true,
      data: paginatedActivities,
      pagination: {
        page,
        limit,
        total: activities.length,
        pages: Math.ceil(activities.length / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération du flux', 500));
  }
};

// @desc    Obtenir l'activité d'un utilisateur
// @route   GET /api/social/activity/:userId
// @access  Public
const getUserActivity = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }
    
    const activities = [];
    
    // Chansons uploadées
    const songs = await Song.find({ uploader: userId })
      .populate('uploader', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    songs.forEach(song => {
      activities.push({
        type: 'uploaded_song',
        content: song,
        user: song.uploader,
        createdAt: song.createdAt
      });
    });
    
    // Playlists créées
    const playlists = await Playlist.find({ owner: userId })
      .populate('owner', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    playlists.forEach(playlist => {
      activities.push({
        type: 'created_playlist',
        content: playlist,
        user: playlist.owner,
        createdAt: playlist.createdAt
      });
    });
    
    // Trier toutes les activités par date
    activities.sort((a, b) => b.createdAt - a.createdAt);
    
    // Pagination
    const paginatedActivities = activities.slice(skip, skip + limit);
    
    res.json({
      success: true,
      data: paginatedActivities,
      pagination: {
        page,
        limit,
        total: activities.length,
        pages: Math.ceil(activities.length / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération de l\'activité', 500));
  }
};

// @desc    Partager un élément
// @route   POST /api/social/share/:type/:id
// @access  Private
const shareContent = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const userId = req.user._id;
    
    let content;
    
    switch (type) {
      case 'song':
        content = await Song.findById(id).populate('uploader', 'username');
        break;
      case 'album':
        content = await Album.findById(id).populate('artist', 'username');
        break;
      case 'playlist':
        content = await Playlist.findById(id).populate('owner', 'username');
        break;
      default:
        return next(new AppError('Type de contenu non supporté', 400));
    }
    
    if (!content) {
      return next(new AppError('Contenu non trouvé', 404));
    }
    
    // Incrémenter le nombre de partages
    content.sharesCount = (content.sharesCount || 0) + 1;
    await content.save();
    
    res.json({
      success: true,
      data: {
        sharesCount: content.sharesCount,
        message: 'Contenu partagé avec succès'
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors du partage', 500));
  }
};

// @desc    Obtenir les éléments tendance
// @route   GET /api/social/trending
// @access  Public
const getTrending = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    // Chansons tendance
    const trendingSongs = await Song.find()
      .populate('uploader', 'username avatar')
      .sort({ views: -1, likesCount: -1 })
      .skip(skip)
      .limit(limit);
    
    // Albums tendance
    const trendingAlbums = await Album.find()
      .populate('artist', 'username avatar')
      .sort({ views: -1, likesCount: -1 })
      .limit(5);
    
    // Playlists tendance
    const trendingPlaylists = await Playlist.find({ isPublic: true })
      .populate('owner', 'username avatar')
      .sort({ views: -1, likesCount: -1 })
      .limit(5);
    
    const total = await Song.countDocuments();
    
    res.json({
      success: true,
      data: {
        songs: trendingSongs,
        albums: trendingAlbums,
        playlists: trendingPlaylists
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des tendances', 500));
  }
};

// @desc    Signaler un élément
// @route   POST /api/social/report/:type/:id
// @access  Private
const reportContent = async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const { reason, description } = req.body;
    const userId = req.user._id;
    
    if (!reason) {
      return next(new AppError('Raison du signalement requise', 400));
    }
    
    let content;
    
    switch (type) {
      case 'song':
        content = await Song.findById(id);
        break;
      case 'album':
        content = await Album.findById(id);
        break;
      case 'playlist':
        content = await Playlist.findById(id);
        break;
      case 'user':
        content = await User.findById(id);
        break;
      default:
        return next(new AppError('Type de contenu non supporté', 400));
    }
    
    if (!content) {
      return next(new AppError('Contenu non trouvé', 404));
    }
    
    // Ici vous pouvez implémenter la logique pour sauvegarder le rapport
    // dans une collection de rapports
    
    res.json({
      success: true,
      message: 'Contenu signalé avec succès'
    });
  } catch (error) {
    next(new AppError('Erreur lors du signalement', 500));
  }
};

// @desc    Obtenir les notifications de l'utilisateur
// @route   GET /api/social/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const userId = req.user._id;
    
    // Ici vous pouvez implémenter la logique pour récupérer les notifications
    // depuis une collection de notifications
    
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
    next(new AppError('Erreur lors de la récupération des notifications', 500));
  }
};

// @desc    Marquer une notification comme lue
// @route   PUT /api/social/notifications/:id/read
// @access  Private
const markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Ici vous pouvez implémenter la logique pour marquer une notification comme lue
    
    res.json({
      success: true,
      message: 'Notification marquée comme lue'
    });
  } catch (error) {
    next(new AppError('Erreur lors de la mise à jour de la notification', 500));
  }
};

// @desc    Supprimer une notification
// @route   DELETE /api/social/notifications/:id
// @access  Private
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Ici vous pouvez implémenter la logique pour supprimer une notification
    
    res.json({
      success: true,
      message: 'Notification supprimée avec succès'
    });
  } catch (error) {
    next(new AppError('Erreur lors de la suppression de la notification', 500));
  }
};

module.exports = {
  likeContent,
  addComment,
  deleteComment,
  getFeed,
  getUserActivity,
  shareContent,
  getTrending,
  reportContent,
  getNotifications,
  markNotificationAsRead,
  deleteNotification
}; 