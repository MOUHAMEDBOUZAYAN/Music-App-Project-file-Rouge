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
    
    if (!artist) {
      return res.status(404).json({
        success: false,
        message: 'Artiste non trouvé'
      });
    }
    
    // Récupérer les chansons de l'artiste
    const songs = await Song.find({ artist: id })
      .select('title duration genre playCount')
      .limit(10)
      .sort({ playCount: -1 });
    
    // Récupérer les albums de l'artiste
    const albums = await Album.find({ artist: id })
      .select('title coverImage releaseDate genre')
      .limit(5)
      .sort({ releaseDate: -1 });
    
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
    
    res.json({
      success: true,
      message: 'Artiste récupéré avec succès',
      data: artistData
    });
    
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

// @desc    Ne plus suivre un artiste
// @route   DELETE /api/artists/:id/follow
// @access  Private
const unfollowArtist = async (req, res) => {
  try {
    const { id: artistId } = req.params;
    const userId = req.user.id;
    
    console.log(`👥 Utilisateur ${userId} ne suit plus l'artiste ${artistId}`);
    
    // Retirer l'artiste des suivis de l'utilisateur
    await User.findByIdAndUpdate(userId, {
      $pull: { following: artistId }
    });
    
    // Retirer l'utilisateur des followers de l'artiste
    await User.findByIdAndUpdate(artistId, {
      $pull: { followers: userId }
    });
    
    console.log(`✅ Utilisateur ${userId} ne suit plus l'artiste ${artistId}`);
    
    res.json({
      success: true,
      message: 'Artiste non suivi avec succès'
    });
    
  } catch (error) {
    console.error('💥 Erreur lors du non-suivi de l\'artiste:', error);
    
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors du non-suivi de l\'artiste',
      error: error.message
    });
  }
};

module.exports = {
  getPopularArtists,
  getArtistById,
  searchArtists,
  followArtist,
  unfollowArtist
};
