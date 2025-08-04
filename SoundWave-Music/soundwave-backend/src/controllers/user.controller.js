const User = require('../models/User');
const Follow = require('../models/Follow');
const { AppError } = require('../middleware/error.middleware');

// @desc    Obtenir tous les utilisateurs (filtrés)
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { search, role, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
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

// @desc    Obtenir le profil public d'un utilisateur
// @route   GET /api/users/profile/:username
// @access  Public
const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username })
      .select('-password -email')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');
    
    if (!user) {
      return next(new AppError('Utilisateur non trouvé', 404));
    }
    
    // Compter les statistiques
    const followersCount = await Follow.countDocuments({ following: user._id });
    const followingCount = await Follow.countDocuments({ follower: user._id });
    
    res.json({
      success: true,
      data: {
        ...user.toObject(),
        followersCount,
        followingCount
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération du profil', 500));
  }
};

// @desc    Mettre à jour le profil de l'utilisateur connecté
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const { username, bio, avatar, location, website } = req.body;
    const userId = req.user._id;
    
    // Vérifier si le nom d'utilisateur est déjà pris
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return next(new AppError('Ce nom d\'utilisateur est déjà pris', 400));
      }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: username || req.user.username,
        bio: bio || req.user.bio,
        avatar: avatar || req.user.avatar,
        location: location || req.user.location,
        website: website || req.user.website
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(new AppError('Erreur lors de la mise à jour du profil', 500));
  }
};

// @desc    Suivre ou ne plus suivre un utilisateur
// @route   POST /api/users/:id/follow
// @access  Private
const followUnfollowUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const followerId = req.user._id;
    
    if (followerId.toString() === id) {
      return next(new AppError('Vous ne pouvez pas vous suivre vous-même', 400));
    }
    
    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: id
    });
    
    if (existingFollow) {
      // Ne plus suivre
      await Follow.findByIdAndDelete(existingFollow._id);
      
      // Mettre à jour les compteurs
      await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
      await User.findByIdAndUpdate(id, { $inc: { followersCount: -1 } });
      
      res.json({
        success: true,
        message: 'Utilisateur ne plus suivi',
        following: false
      });
    } else {
      // Suivre
      await Follow.create({
        follower: followerId,
        following: id
      });
      
      // Mettre à jour les compteurs
      await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
      await User.findByIdAndUpdate(id, { $inc: { followersCount: 1 } });
      
      res.json({
        success: true,
        message: 'Utilisateur suivi avec succès',
        following: true
      });
    }
  } catch (error) {
    next(new AppError('Erreur lors de l\'action de suivi', 500));
  }
};

// @desc    Obtenir la liste des followers d'un utilisateur
// @route   GET /api/users/:id/followers
// @access  Public
const getFollowers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const followers = await Follow.find({ following: id })
      .populate('follower', 'username avatar bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Follow.countDocuments({ following: id });
    
    res.json({
      success: true,
      data: followers.map(f => f.follower),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des followers', 500));
  }
};

// @desc    Obtenir la liste des utilisateurs suivis
// @route   GET /api/users/:id/following
// @access  Public
const getFollowing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const following = await Follow.find({ follower: id })
      .populate('following', 'username avatar bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Follow.countDocuments({ follower: id });
    
    res.json({
      success: true,
      data: following.map(f => f.following),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des utilisateurs suivis', 500));
  }
};

// @desc    Obtenir le profil de l'utilisateur connecté
// @route   GET /api/users/me
// @access  Private
const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération du profil', 500));
  }
};

module.exports = {
  getUsers,
  getUserProfile,
  updateUserProfile,
  followUnfollowUser,
  getFollowers,
  getFollowing,
  getMyProfile
}; 