 const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware pour gérer les erreurs de validation
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Erreurs de validation:', errors.array());
    console.log('📝 Données reçues:', {
      username: req.body.username,
      email: req.body.email,
      bio: req.body.bio,
      hasFile: !!req.file
    });
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: errors.array().map(error => ({
        field: error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  console.log('✅ Validation réussie');
  next();
};

/**
 * Règles de validation pour l'authentification
 */
const validateRegister = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'.-]+$/)
    .withMessage('Le prénom ne peut contenir que des lettres, espaces, tirets, apostrophes et points'),
  
  body('LastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\u00C0-\u017F\s'.-]+$/)
    .withMessage('Le nom ne peut contenir que des lettres, espaces, tirets, apostrophes et points'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Veuillez fournir une adresse email valide'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Les mots de passe ne correspondent pas');
      }
      return true;
    }),
  
  body('userType')
    .optional()
    .isIn(['listener', 'artist'])
    .withMessage('Le type d\'utilisateur doit être "listener" ou "artist"'),
  
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
  (req, res, next) => {
    console.log('🔍 Validation du profil utilisateur:', {
      username: req.body.username,
      email: req.body.email,
      bio: req.body.bio,
      hasFile: !!req.file
    });
    next();
  },
  body('username')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom d\'utilisateur doit contenir entre 2 et 50 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\u00C0-\u017F\s'.-]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, espaces, tirets, apostrophes et points'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Veuillez fournir une adresse email valide'),
  
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
  
  body('album')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Le nom de l\'album ne peut pas dépasser 100 caractères'),
  
  body('genre')
    .optional()
    .isIn(['Pop', 'Rock', 'Hip-Hop', 'R&B', 'Jazz', 'Classical', 'Electronic', 'Country', 'Reggae','Rap', 'Blues', 'Folk', 'Alternative', 'Indie', 'Funk', 'Soul', 'Disco'])
    .withMessage('Genre musical invalide'),
  
  body('duration')
    .optional()
    .isInt({ min: 1, max: 3600 })
    .withMessage('La durée doit être entre 1 et 3600 secondes'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La description ne peut pas dépasser 500 caractères'),
  
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
    .withMessage('Le statut public doit être un booléen'),
  
  handleValidationErrors
];

/**
 * Validation d'ObjectId MongoDB
 */
const validateObjectId = [
  param('id')
    .isMongoId()
    .withMessage('ID invalide'),
  
  handleValidationErrors
];

/**
 * Validation de pagination
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Le numéro de page doit être un entier positif'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('La limite doit être entre 1 et 100'),
  
  handleValidationErrors
];

/**
 * Validation de recherche
 */
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .custom((value) => {
      if (value && value.length > 0 && value.length < 1) {
        throw new Error('Le terme de recherche doit contenir au moins 1 caractère');
      }
      if (value && value.length > 100) {
        throw new Error('Le terme de recherche ne peut pas dépasser 100 caractères');
      }
      return true;
    }),
  
  query('type')
    .optional()
    .isIn(['songs', 'artists', 'albums', 'playlists', 'all'])
    .withMessage('Type de recherche invalide'),
  
  handleValidationErrors
];

/**
 * Validation de commentaires
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