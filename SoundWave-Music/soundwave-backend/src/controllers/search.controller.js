const Song = require('../models/Song');
const Album = require('../models/Album');
const Playlist = require('../models/Playlist');
const User = require('../models/User');
const { AppError } = require('../middleware/error.middleware');

// @desc    Recherche globale
// @route   GET /api/search
// @access  Public
const globalSearch = async (req, res, next) => {
  try {
    const { q, type, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    if (!q) {
      return next(new AppError('Terme de recherche requis', 400));
    }
    
    const searchRegex = { $regex: q, $options: 'i' };
    let results = {};
    
    // Recherche dans les chansons
    if (!type || type === 'song') {
      const songs = await Song.find({
        $or: [
          { title: searchRegex },
          { artist: searchRegex },
          { album: searchRegex },
          { genre: searchRegex }
        ]
      })
        .populate('uploader', 'username avatar')
        .sort({ views: -1, likesCount: -1 })
        .skip(skip)
        .limit(limit);
      
      const songsTotal = await Song.countDocuments({
        $or: [
          { title: searchRegex },
          { artist: searchRegex },
          { album: searchRegex },
          { genre: searchRegex }
        ]
      });
      
      results.songs = {
        data: songs,
        total: songsTotal,
        pages: Math.ceil(songsTotal / limit)
      };
    }
    
    // Recherche dans les albums
    if (!type || type === 'album') {
      const albums = await Album.find({
        $or: [
          { title: searchRegex },
          { artist: searchRegex },
          { genre: searchRegex }
        ]
      })
        .populate('artist', 'username avatar')
        .sort({ views: -1 })
        .skip(skip)
        .limit(limit);
      
      const albumsTotal = await Album.countDocuments({
        $or: [
          { title: searchRegex },
          { artist: searchRegex },
          { genre: searchRegex }
        ]
      });
      
      results.albums = {
        data: albums,
        total: albumsTotal,
        pages: Math.ceil(albumsTotal / limit)
      };
    }
    
    // Recherche dans les playlists
    if (!type || type === 'playlist') {
      const playlists = await Playlist.find({
        isPublic: true,
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      })
        .populate('owner', 'username avatar')
        .sort({ views: -1 })
        .skip(skip)
        .limit(limit);
      
      const playlistsTotal = await Playlist.countDocuments({
        isPublic: true,
        $or: [
          { name: searchRegex },
          { description: searchRegex }
        ]
      });
      
      results.playlists = {
        data: playlists,
        total: playlistsTotal,
        pages: Math.ceil(playlistsTotal / limit)
      };
    }
    
    // Recherche dans les utilisateurs
    if (!type || type === 'user') {
      const users = await User.find({
        $or: [
          { username: searchRegex },
          { bio: searchRegex }
        ]
      })
        .select('-password')
        .sort({ followersCount: -1 })
        .skip(skip)
        .limit(limit);
      
      const usersTotal = await User.countDocuments({
        $or: [
          { username: searchRegex },
          { bio: searchRegex }
        ]
      });
      
      results.users = {
        data: users,
        total: usersTotal,
        pages: Math.ceil(usersTotal / limit)
      };
    }
    
    res.json({
      success: true,
      data: results,
      query: q,
      type: type || 'all'
    });
  } catch (error) {
    next(new AppError('Erreur lors de la recherche globale', 500));
  }
};

// @desc    Rechercher des chansons
// @route   GET /api/search/songs
// @access  Public
const searchSongs = async (req, res, next) => {
  try {
    const { q, genre, artist, album, page = 1, limit = 10, sortBy = 'views', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;
    
    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          pages: 0
        }
      });
    }
    
    // Use aggregation to search in artist name as well
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'artist',
          foreignField: '_id',
          as: 'artistInfo'
        }
      },
      {
        $unwind: '$artistInfo'
      },
      {
        $match: {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { album: { $regex: q, $options: 'i' } },
            { genre: { $regex: q, $options: 'i' } },
            { 'artistInfo.username': { $regex: q, $options: 'i' } }
          ]
        }
      },
      {
        $addFields: {
          artist: {
            _id: '$artistInfo._id',
            username: '$artistInfo.username',
            avatar: '$artistInfo.avatar'
          }
        }
      },
      {
        $project: {
          artistInfo: 0
        }
      },
      {
        $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
      },
      {
        $skip: skip
      },
      {
        $limit: parseInt(limit)
      }
    ];
    
    const songs = await Song.aggregate(pipeline);
    
    // Count total with same aggregation logic
    const countPipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'artist',
          foreignField: '_id',
          as: 'artistInfo'
        }
      },
      {
        $unwind: '$artistInfo'
      },
      {
        $match: {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { album: { $regex: q, $options: 'i' } },
            { genre: { $regex: q, $options: 'i' } },
            { 'artistInfo.username': { $regex: q, $options: 'i' } }
          ]
        }
      },
      {
        $count: 'total'
      }
    ];
    
    const countResult = await Song.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;
    
    res.json({
      success: true,
      data: songs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la recherche de chansons:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error stack:', error.stack);
    next(new AppError(`Erreur lors de la recherche de chansons: ${error.message}`, 500));
  }
};

// @desc    Rechercher des artistes
// @route   GET /api/search/artists
// @access  Public
const searchArtists = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10, sortBy = 'followersCount', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;
    
    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          pages: 0
        }
      });
    }
    
    const filter = {
      role: 'artist',
      $or: [
        { username: { $regex: `^${q}`, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } }
      ]
    };
    
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const artists = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments(filter);
    
    res.json({
      success: true,
      data: artists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la recherche d\'artistes:', error);
    next(new AppError('Erreur lors de la recherche d\'artistes', 500));
  }
};

// @desc    Rechercher des albums
// @route   GET /api/search/albums
// @access  Public
const searchAlbums = async (req, res, next) => {
  try {
    const { q, artist, genre, page = 1, limit = 10, sortBy = 'views', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;
    
    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          pages: 0
        }
      });
    }
    
    // Use aggregation to search in artist name as well
    const pipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'artist',
          foreignField: '_id',
          as: 'artistInfo'
        }
      },
      {
        $unwind: '$artistInfo'
      },
      {
        $match: {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { genre: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { 'artistInfo.username': { $regex: q, $options: 'i' } }
          ]
        }
      },
      {
        $addFields: {
          artist: {
            _id: '$artistInfo._id',
            username: '$artistInfo.username',
            avatar: '$artistInfo.avatar'
          }
        }
      },
      {
        $project: {
          artistInfo: 0
        }
      },
      {
        $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
      },
      {
        $skip: skip
      },
      {
        $limit: parseInt(limit)
      }
    ];
    
    const albums = await Album.aggregate(pipeline);
    
    // Count total with same aggregation logic
    const countPipeline = [
      {
        $lookup: {
          from: 'users',
          localField: 'artist',
          foreignField: '_id',
          as: 'artistInfo'
        }
      },
      {
        $unwind: '$artistInfo'
      },
      {
        $match: {
          $or: [
            { title: { $regex: q, $options: 'i' } },
            { genre: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { 'artistInfo.username': { $regex: q, $options: 'i' } }
          ]
        }
      },
      {
        $count: 'total'
      }
    ];
    
    const countResult = await Album.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;
    
    res.json({
      success: true,
      data: albums,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la recherche d\'albums:', error);
    next(new AppError('Erreur lors de la recherche d\'albums', 500));
  }
};

// @desc    Rechercher des playlists
// @route   GET /api/search/playlists
// @access  Public
const searchPlaylists = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10, sortBy = 'views', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;
    
    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          pages: 0
        }
      });
    }
    
    const filter = {
      isPublic: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    };
    
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const playlists = await Playlist.find(filter)
      .populate('owner', 'username avatar')
      .populate('songs', 'title artist')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    const total = await Playlist.countDocuments(filter);
    
    res.json({
      success: true,
      data: playlists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors de la recherche de playlists:', error);
    next(new AppError('Erreur lors de la recherche de playlists', 500));
  }
};

// @desc    Rechercher des utilisateurs
// @route   GET /api/search/users
// @access  Public
const searchUsers = async (req, res, next) => {
  try {
    const { q, role, page = 1, limit = 10, sortBy = 'followersCount', sortOrder = 'desc' } = req.query;
    const skip = (page - 1) * limit;
    
    if (!q) {
      return next(new AppError('Terme de recherche requis', 400));
    }
    
    const filter = {
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } }
      ]
    };
    
    if (role) {
      filter.role = role;
    }
    
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
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la recherche d\'utilisateurs', 500));
  }
};

// @desc    Obtenir les tendances actuelles
// @route   GET /api/search/trending
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
      .sort({ views: -1 })
      .limit(5);
    
    // Artistes tendance
    const trendingArtists = await User.aggregate([
      { $match: { role: 'artist' } },
      { $lookup: { from: 'songs', localField: '_id', foreignField: 'uploader', as: 'songs' } },
      { $addFields: { totalViews: { $sum: '$songs.views' } } },
      { $sort: { totalViews: -1 } },
      { $limit: 5 },
      { $project: { username: 1, avatar: 1, totalViews: 1 } }
    ]);
    
    const total = await Song.countDocuments();
    
    res.json({
      success: true,
      data: {
        songs: trendingSongs,
        albums: trendingAlbums,
        artists: trendingArtists
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

// @desc    Obtenir des recommandations personnalisées
// @route   GET /api/search/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user._id;
    
    // Basé sur les genres que l'utilisateur écoute
    const userSongs = await Song.find({ 'likes': userId });
    const userGenres = [...new Set(userSongs.map(song => song.genre))];
    
    let recommendedSongs = [];
    
    if (userGenres.length > 0) {
      recommendedSongs = await Song.find({
        genre: { $in: userGenres },
        _id: { $nin: userSongs.map(song => song._id) }
      })
        .populate('uploader', 'username avatar')
        .sort({ views: -1, likesCount: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      // Si pas de préférences, recommander les chansons populaires
      recommendedSongs = await Song.find()
        .populate('uploader', 'username avatar')
        .sort({ views: -1, likesCount: -1 })
        .skip(skip)
        .limit(limit);
    }
    
    const total = await Song.countDocuments();
    
    res.json({
      success: true,
      data: recommendedSongs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des recommandations', 500));
  }
};

module.exports = {
  globalSearch,
  searchSongs,
  searchArtists,
  searchAlbums,
  searchPlaylists,
  searchUsers,
  getTrending,
  getRecommendations
}; 