const User = require('../models/User');
const Song = require('../models/Song');
const Album = require('../models/Album');

// @desc    Obtenir les artistes populaires
// @route   GET /api/artists/popular
// @access  Public
const getPopularArtists = async (req, res) => {
  try {
    console.log('🎵 Récupération des artistes populaires...');
    
    // Rechercher les utilisateurs avec le rôle 'artist'
    const artists = await User.find({ role: 'artist' })
      .select('username profilePicture bio followers')
      .limit(10)
      .sort({ followers: -1, createdAt: -1 });
    
    if (!artists || artists.length === 0) {
      console.log('ℹ️ Aucun artiste trouvé, création d\'artistes de démonstration...');
      
      // Créer des artistes de démonstration
      const demoArtists = [
        {
          _id: 'demo-artist-1',
          username: 'Drake',
          profilePicture: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face',
          bio: 'Artiste international de hip-hop et R&B',
          followers: 15000000,
          role: 'artist'
        },
        {
          _id: 'demo-artist-2',
          username: 'Taylor Swift',
          profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          bio: 'Chanteuse et compositrice pop country',
          followers: 12000000,
          role: 'artist'
        },
        {
          _id: 'demo-artist-3',
          username: 'The Weeknd',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          bio: 'Artiste R&B et pop alternatif',
          followers: 8000000,
          role: 'artist'
        },
        {
          _id: 'demo-artist-4',
          username: 'Billie Eilish',
          profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          bio: 'Chanteuse pop alternative',
          followers: 6000000,
          role: 'artist'
        },
        {
          _id: 'demo-artist-5',
          username: 'Post Malone',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          bio: 'Rappeur et chanteur pop',
          followers: 5000000,
          role: 'artist'
        }
      ];
      
      console.log('✅ Artistes de démonstration créés');
      
      return res.json({
        success: true,
        message: 'Artistes populaires récupérés avec succès',
        data: demoArtists,
        count: demoArtists.length
      });
    }
    
    console.log(`✅ ${artists.length} artistes trouvés`);
    
    res.json({
      success: true,
      message: 'Artistes populaires récupérés avec succès',
      data: artists,
      count: artists.length
    });
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération des artistes populaires:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des artistes',
      error: error.message
    });
  }
};

// @desc    Obtenir un artiste par ID
// @route   GET /api/artists/:id
// @access  Public
const getArtistById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🎵 Récupération de l'artiste: ${id}`);
    
    // Rechercher l'artiste
    const artist = await User.findOne({ _id: id, role: 'artist' })
      .select('username profilePicture bio followers following createdAt');
    
    console.log('🔍 Artiste trouvé pour getArtistById:', artist ? `${artist.username} (${artist._id})` : 'Aucun');
    
    if (!artist) {
      console.log('❌ Artiste non trouvé avec ID pour getArtistById:', id);
      return res.status(404).json({
        success: false,
        message: 'Artiste non trouvé'
      });
    }
    
    // Récupérer les chansons de l'artiste
    console.log('🔍 Recherche des chansons pour getArtistById avec artist ID:', id);
    const songs = await Song.find({ artist: id })
      .select('title duration genre plays')
      .limit(10)
      .sort({ plays: -1 });
    
    // Récupérer les albums de l'artiste
    console.log('🔍 Recherche des albums pour getArtistById avec artist ID:', id);
    const albums = await Album.find({ artist: id })
      .select('title coverImage releaseDate genre')
      .limit(5)
      .sort({ releaseDate: -1 });
    
    console.log(`📊 Chansons trouvées: ${songs.length}, Albums trouvés: ${albums.length}`);
    
    const artistData = {
      ...artist.toObject(),
      songs,
      albums,
      stats: {
        totalSongs: songs.length,
        totalAlbums: albums.length,
        totalFollowers: artist.followers?.length || 0,
        totalFollowing: artist.following?.length || 0
      }
    };
    
    console.log(`✅ Artiste récupéré: ${artist.username}`);
    console.log('📊 Détails de l\'artiste:', { username: artist.username, songs: songs.length, albums: albums.length });
    
    res.json({
      success: true,
      message: 'Artiste récupéré avec succès',
      data: artistData
    });
    
    console.log('📤 Réponse envoyée pour getArtistById:', { success: true, dataKeys: Object.keys(artistData) });
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération de l\'artiste:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'artiste',
      error: error.message
    });
  }
};

// @desc    Rechercher des artistes
// @route   GET /api/artists/search
// @access  Public
const searchArtists = async (req, res) => {
  try {
    const { q, limit = 10, page = 1 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Le terme de recherche doit contenir au moins 2 caractères'
      });
    }
    
    console.log(`🔍 Recherche d'artistes: "${q}"`);
    
    const searchRegex = new RegExp(q, 'i');
    
    const artists = await User.find({
      role: 'artist',
      $or: [
        { username: searchRegex },
        { bio: searchRegex }
      ]
    })
    .select('username profilePicture bio followers')
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit))
    .sort({ followers: -1, username: 1 });
    
    const total = await User.countDocuments({
      role: 'artist',
      $or: [
        { username: searchRegex },
        { bio: searchRegex }
      ]
    });
    
    console.log(`✅ ${artists.length} artistes trouvés pour "${q}"`);
    
    res.json({
      success: true,
      message: 'Recherche d\'artistes réussie',
      data: artists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('💥 Erreur lors de la recherche d\'artistes:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la recherche d\'artistes',
      error: error.message
    });
  }
};

// @desc    Suivre un artiste
// @route   POST /api/artists/:id/follow
// @access  Private
const followArtist = async (req, res) => {
  try {
    const { id: artistId } = req.params;
    const userId = req.user.id;
    
    if (userId === artistId) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas vous suivre vous-même'
      });
    }
    
    console.log(`👥 Utilisateur ${userId} suit l'artiste ${artistId}`);
    
    // Vérifier que l'artiste existe
    const artist = await User.findOne({ _id: artistId, role: 'artist' });
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artiste non trouvé'
      });
    }
    
    // Vérifier que l'utilisateur n'a pas déjà suivi l'artiste
    const user = await User.findById(userId);
    if (user.following.includes(artistId)) {
      return res.status(400).json({
        success: false,
        message: 'Vous suivez déjà cet artiste'
      });
    }
    
    // Ajouter l'artiste aux suivis de l'utilisateur
    await User.findByIdAndUpdate(userId, {
      $push: { following: artistId }
    });
    
    // Ajouter l'utilisateur aux followers de l'artiste
    await User.findByIdAndUpdate(artistId, {
      $push: { followers: userId }
    });
    
    console.log(`✅ Utilisateur ${userId} suit maintenant l'artiste ${artistId}`);
    
    res.json({
      success: true,
      message: 'Artiste suivi avec succès'
    });
    
  } catch (error) {
    console.error('💥 Erreur lors du suivi de l\'artiste:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du suivi de l\'artiste',
      error: error.message
    });
  }
};


// @desc    Obtenir les chansons d'un artiste
// @route   GET /api/artists/:id/songs
// @access  Public
const getArtistSongs = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    console.log(`🎵 Récupération des chansons de l'artiste: ${id}`);
    
    // Vérifier que l'artiste existe
    const artist = await User.findOne({ _id: id, role: 'artist' });
    console.log('🔍 Artiste trouvé:', artist ? `${artist.username} (${artist._id})` : 'Aucun');
    
    if (!artist) {
      console.log('❌ Artiste non trouvé avec ID:', id);
      return res.status(404).json({
        success: false,
        message: 'Artiste non trouvé'
      });
    }
    
    const skip = (page - 1) * limit;
    
    console.log('🔍 Recherche des chansons avec artist ID:', id);
    const songs = await Song.find({ artist: id })
      .select('title duration genre plays audioUrl coverImage album createdAt')
      .populate('artist', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Song.countDocuments({ artist: id });
    
    console.log(`✅ ${songs.length} chansons trouvées pour l'artiste ${artist.username}`);
    console.log('📊 Détails des chansons:', songs.map(s => ({ title: s.title, artist: s.artist?.username, duration: s.duration })));
    
    res.json({
      success: true,
      message: 'Chansons de l\'artiste récupérées avec succès',
      data: songs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
    console.log('📤 Réponse envoyée pour getArtistSongs:', { success: true, songsCount: songs.length, total });
    console.log('📊 Détails de la réponse:', { artistId: id, songs: songs.map(s => s.title) });
    console.log('📊 Détails complets des chansons:', songs.map(s => ({ 
      id: s._id, 
      title: s.title, 
      artist: s.artist?.username, 
      duration: s.duration,
      audioUrl: s.audioUrl,
      coverImage: s.coverImage
    })));
    console.log('📊 Détails de la pagination:', { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) });
    console.log('📊 Détails de la requête:', { id, page, limit, skip });
    console.log('📊 Détails de la base de données:', { 
      artistExists: !!artist, 
      artistId: artist?._id, 
      artistUsername: artist?.username,
      songsInDB: total
    });
    console.log('📊 Détails de la requête MongoDB:', { 
      query: { artist: id },
      select: 'title duration genre plays audioUrl coverImage album createdAt',
      populate: 'artist',
      sort: { createdAt: -1 },
      skip,
      limit: parseInt(limit)
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération des chansons de l\'artiste:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des chansons',
      error: error.message
    });
  }
};

// @desc    Obtenir les albums d'un artiste
// @route   GET /api/artists/:id/albums
// @access  Public
const getArtistAlbums = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    console.log(`🎵 Récupération des albums de l'artiste: ${id}`);
    
    // Vérifier que l'artiste existe
    const artist = await User.findOne({ _id: id, role: 'artist' });
    console.log('🔍 Artiste trouvé pour albums:', artist ? `${artist.username} (${artist._id})` : 'Aucun');
    
    if (!artist) {
      console.log('❌ Artiste non trouvé avec ID pour albums:', id);
      return res.status(404).json({
        success: false,
        message: 'Artiste non trouvé'
      });
    }
    
    const skip = (page - 1) * limit;
    
    console.log('🔍 Recherche des albums avec artist ID:', id);
    const albums = await Album.find({ artist: id })
      .select('title genre releaseDate coverImage description songCount createdAt')
      .populate('artist', 'username')
      .populate('songs', 'title duration')
      .sort({ releaseDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Album.countDocuments({ artist: id });
    
    console.log(`✅ ${albums.length} albums trouvés pour l'artiste ${artist.username}`);
    console.log('📊 Détails des albums:', albums.map(a => ({ title: a.title, artist: a.artist?.username, genre: a.genre })));
    
    res.json({
      success: true,
      message: 'Albums de l\'artiste récupérés avec succès',
      data: albums,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
    console.log('📤 Réponse envoyée pour getArtistAlbums:', { success: true, albumsCount: albums.length, total });
    console.log('📊 Détails de la réponse:', { artistId: id, albums: albums.map(a => a.title) });
    console.log('📊 Détails complets des albums:', albums.map(a => ({ 
      id: a._id, 
      title: a.title, 
      artist: a.artist?.username, 
      genre: a.genre,
      coverImage: a.coverImage,
      releaseDate: a.releaseDate
    })));
    console.log('📊 Détails de la pagination:', { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) });
    console.log('📊 Détails de la requête:', { id, page, limit, skip });
    console.log('📊 Détails de la base de données:', { 
      artistExists: !!artist, 
      artistId: artist?._id, 
      artistUsername: artist?.username,
      albumsInDB: total
    });
    console.log('📊 Détails de la requête MongoDB:', { 
      query: { artist: id },
      select: 'title genre releaseDate coverImage description songCount createdAt',
      populate: 'artist',
      sort: { releaseDate: -1 },
      skip,
      limit: parseInt(limit)
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    console.log('📊 Détails de la requête de comptage:', { 
      query: { artist: id },
      count: total
    });
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération des albums de l\'artiste:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des albums',
      error: error.message
    });
  }
};

// @desc    Obtenir mes chansons (pour l'artiste connecté)
// @route   GET /api/artists/me/songs
// @access  Private (Artistes seulement)
const getMySongs = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;
    
    console.log(`🎵 Récupération des chansons de l'artiste connecté: ${userId}`);
    
    const skip = (page - 1) * limit;
    
    const songs = await Song.find({ uploader: userId })
      .select('title duration genre playCount audioUrl coverImage createdAt')
      .populate('uploader', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Song.countDocuments({ uploader: userId });
    
    console.log(`✅ ${songs.length} chansons trouvées pour l'artiste connecté`);
    
    res.json({
      success: true,
      message: 'Mes chansons récupérées avec succès',
      data: songs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération de mes chansons:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de mes chansons',
      error: error.message
    });
  }
};

// @desc    Obtenir mes albums (pour l'artiste connecté)
// @route   GET /api/artists/me/albums
// @access  Private (Artistes seulement)
const getMyAlbums = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20 } = req.query;
    
    console.log(`🎵 Récupération des albums de l'artiste connecté: ${userId}`);
    
    const skip = (page - 1) * limit;
    
    const albums = await Album.find({ artistId: userId })
      .select('title genre releaseDate coverUrl description songsCount createdAt')
      .populate('artist', 'username')
      .populate('songs', 'title duration')
      .sort({ releaseDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Album.countDocuments({ artistId: userId });
    
    console.log(`✅ ${albums.length} albums trouvés pour l'artiste connecté`);
    
    res.json({
      success: true,
      message: 'Mes albums récupérés avec succès',
      data: albums,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
    
  } catch (error) {
    console.error('💥 Erreur lors de la récupération de mes albums:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de mes albums',
      error: error.message
    });
  }
};


// @desc    Ne plus suivre un artiste
// @route   DELETE /api/artists/:id/follow
// @access  Private
const unfollowArtist = async (req, res, next) => {
  try {
    const artistId = req.params.id;
    const userId = req.user.id;

    console.log(`🎵 Tentative d'arrêt de suivi de l'artiste ${artistId} par l'utilisateur ${userId}`);

    // Vérifier si l'artiste existe
    const artist = await User.findById(artistId);
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artiste non trouvé'
      });
    }

    // Vérifier si l'utilisateur suit l'artiste
    const user = await User.findById(userId);
    if (!user.following || !user.following.includes(artistId)) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne suivez pas cet artiste'
      });
    }

    // Retirer l'artiste de la liste de suivi de l'utilisateur
    user.following = user.following.filter(id => id.toString() !== artistId);
    await user.save();

    // Retirer l'utilisateur des followers de l'artiste
    if (artist.followers) {
      artist.followers = artist.followers.filter(id => id.toString() !== userId);
      await artist.save();
    }

    console.log(`✅ Utilisateur ${userId} ne suit plus l'artiste ${artistId}`);

    res.json({
      success: true,
      message: 'Arrêt du suivi de l\'artiste réussi',
      data: {
        artistId,
        userId,
        following: user.following
      }
    });

  } catch (error) {
    console.error('💥 Erreur lors de l\'arrêt du suivi de l\'artiste:', error);
    next(error);
  }
};

module.exports = {
  getPopularArtists,
  getArtistById,
  searchArtists,
  followArtist,
  unfollowArtist,
  getArtistSongs,
  getArtistAlbums,
  getMySongs,
  getMyAlbums
};
