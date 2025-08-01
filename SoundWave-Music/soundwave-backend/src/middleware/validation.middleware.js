const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware pour gérer les erreurs de validation
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

/**
 * Règles de validation pour l'authentification
 */
const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Veuillez fournir une adresse email valide'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Veuillez fournir une adresse email valide'),
  
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
  
  handleValidationErrors
];

/**
 * Règles de validation pour les utilisateurs
 */
const validateUserProfile = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 3 et 30 caractères')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La bio ne peut pas dépasser 500 caractères'),
  
  body('avatar')
    .optional()
    .isURL()
    .withMessage('L\'URL de l\'avatar doit être valide'),
  
  handleValidationErrors
];

/**
 * Règles de validation pour les chansons
 */
const validateSong = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Le titre doit contenir entre 1 et 100 caractères'),
  
  body('artist')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('L\'artiste doit contenir entre 1 et 100 caractères'),
  
  body('album')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le nom de l\'album ne peut pas dépasser 100 caractères'),
  
  body('duration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La durée doit être un nombre entier positif'),
  
  body('genre')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Le genre ne peut pas dépasser 50 caractères'),
  
  body('spotifyId')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('L\'ID Spotify est requis si fourni'),
  
  handleValidationErrors
];

/**
 * Règles de validation pour les playlists
 */
const validatePlaylist = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Le nom de la playlist doit contenir entre 1 et 100 caractères'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic doit être un booléen'),
  
  handleValidationErrors
];

/**
 * Règles de validation pour les paramètres d'ID
 */
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('ID invalide'),
  
  handleValidationErrors
];

/**
 * Règles de validation pour la pagination
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier positif'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être un entier entre 1 et 100'),
  
  handleValidationErrors
];

/**
 * Règles de validation pour la recherche
 */
const validateSearch = [
  query('q')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Le terme de recherche doit contenir entre 1 et 100 caractères'),
  
  query('type')
    .optional()
    .isIn(['song', 'artist', 'album', 'playlist', 'user'])
    .withMessage('Le type de recherche doit être song, artist, album, playlist ou user'),
  
  handleValidationErrors
];

/**
 * Règles de validation pour les commentaires
 */
const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Le commentaire doit contenir entre 1 et 1000 caractères'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateUserProfile,
  validateSong,
  validatePlaylist,
  validateObjectId,
  validatePagination,
  validateSearch,
  validateComment
}; 