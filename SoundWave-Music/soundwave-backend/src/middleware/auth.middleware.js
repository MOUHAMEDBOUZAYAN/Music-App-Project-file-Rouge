const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur depuis la base de données
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token invalide - utilisateur non trouvé'
        });
      }

      // Ajouter l'utilisateur à l'objet request
      req.user = user;
      next();
    } catch (error) {
      console.error('Erreur d\'authentification:', error);
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }
  }

  if (!token) {
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
 * Middleware pour vérifier si l'utilisateur est le propriétaire de la ressource
 */
const owner = (req, res, next) => {
  if (req.user && (req.user._id.toString() === req.params.id || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé - vous n\'êtes pas autorisé à accéder à cette ressource'
    });
  }
};

module.exports = {
  protect,
  admin,
  owner
}; 