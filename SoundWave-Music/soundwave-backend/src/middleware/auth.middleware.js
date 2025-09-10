const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');

/**
 * Middleware pour protéger les routes privées
 * Vérifie le token JWT et ajoute l'utilisateur à req.user
 */
const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraire le token du header
      token = req.headers.authorization.split(' ')[1];
      
      console.log('🔍 Vérification du token:', {
        token: token.substring(0, 20) + '...',
        secret: jwtConfig.secret,
        issuer: jwtConfig.issuer
      });

      // Vérifier le token
      const decoded = jwt.verify(token, jwtConfig.secret, {
        issuer: jwtConfig.issuer
      });
      
      console.log('✅ Token décodé avec succès:', decoded);

      // Récupérer l'utilisateur depuis la base de données
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token valide mais utilisateur non trouvé'
        });
      }

      // Ajouter l'utilisateur à l'objet request
      req.user = user;
      console.log('🔐 Auth middleware - User authenticated:', {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      });
      next();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé - token manquant'
    });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est admin
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé - droits administrateur requis'
    });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est artiste ou admin
 */
const artist = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Vous devez être connecté pour effectuer cette action'
    });
  }
  
  if (req.user.role === 'artist' || req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé - seuls les artistes peuvent effectuer cette action'
    });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est le propriétaire de la ressource
 */
const owner = async (req, res, next) => {
  try {
    console.log('🔐 Owner middleware called:', {
      baseUrl: req.baseUrl,
      originalUrl: req.originalUrl,
      params: req.params,
      method: req.method,
      userId: req.user?._id,
      username: req.user?.username
    });
    
    // Pour les routes de playlist, on doit vérifier le owner de la playlist
    if (req.baseUrl && req.baseUrl.includes('/playlists') && req.params.id) {
      const Playlist = require('../models/Playlist');
      const playlist = await Playlist.findById(req.params.id);
      
      if (!playlist) {
        return res.status(404).json({
          success: false,
          message: 'Playlist non trouvée'
        });
      }
      
      const ownerId = playlist.owner._id ? playlist.owner._id.toString() : playlist.owner.toString();
      if (req.user && (ownerId === req.user._id.toString() || req.user.role === 'admin')) {
        console.log('🔐 Owner middleware - Access granted:', {
          userId: req.user._id,
          username: req.user.username,
          playlistOwnerId: ownerId,
          isOwner: ownerId === req.user._id.toString()
        });
        next();
      } else {
        console.log('🔐 Owner middleware - Access denied:', {
          userId: req.user?._id,
          username: req.user?.username,
          playlistOwnerId: ownerId,
          isOwner: ownerId === req.user?._id?.toString()
        });
        return res.status(403).json({
          success: false,
          message: 'Accès refusé - vous n\'êtes pas autorisé à accéder à cette ressource'
        });
      }
    } else {
      // Pour les autres routes, vérifier directement l'ID
      if (req.user && (req.user._id.toString() === req.params.id || req.user.role === 'admin')) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: 'Accès refusé - vous n\'êtes pas autorisé à accéder à cette ressource'
        });
      }
    }
  } catch (error) {
    console.error('🔐 Owner middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des permissions'
    });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur peut modifier une ressource
 * (propriétaire ou admin)
 */
const canModify = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user._id.toString() === req.params.userId)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé - vous n\'êtes pas autorisé à modifier cette ressource'
    });
  }
};

module.exports = {
  protect,
  admin,
  artist,
  owner,
  canModify
}; 