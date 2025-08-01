/**
 * Index des middlewares - Export centralisé de tous les middlewares
 */

// Middleware d'authentification
const { protect, admin, owner } = require('./auth.middleware');

// Middleware de gestion d'erreurs
const { 
  AppError, 
  errorHandler, 
  notFound,
  handleValidationErrorDB,
  handleDuplicateKeyErrorDB,
  handleCastErrorDB,
  handleJWTError,
  handleJWTExpiredError
} = require('./error.middleware');

// Middleware de validation
const {
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
} = require('./validation.middleware');

// Middleware de limitation de taux
const {
  generalLimiter,
  authLimiter,
  registerLimiter,
  searchLimiter,
  uploadLimiter,
  commentLimiter,
  socialActionLimiter,
  createCustomLimiter
} = require('./rateLimit.middleware');

// Middleware de logging
const {
  requestLogger,
  errorLogger,
  performanceLogger,
  activityLogger,
  cleanupLogs
} = require('./logger.middleware');

// Middleware CORS
const {
  corsConfig,
  corsWithValidation,
  corsPublic,
  corsAuth,
  securityHeaders,
  corsErrorHandler
} = require('./cors.middleware');

module.exports = {
  // Authentification
  protect,
  admin,
  owner,
  
  // Gestion d'erreurs
  AppError,
  errorHandler,
  notFound,
  handleValidationErrorDB,
  handleDuplicateKeyErrorDB,
  handleCastErrorDB,
  handleJWTError,
  handleJWTExpiredError,
  
  // Validation
  handleValidationErrors,
  validateRegister,
  validateLogin,
  validateUserProfile,
  validateSong,
  validatePlaylist,
  validateObjectId,
  validatePagination,
  validateSearch,
  validateComment,
  
  // Limitation de taux
  generalLimiter,
  authLimiter,
  registerLimiter,
  searchLimiter,
  uploadLimiter,
  commentLimiter,
  socialActionLimiter,
  createCustomLimiter,
  
  // Logging
  requestLogger,
  errorLogger,
  performanceLogger,
  activityLogger,
  cleanupLogs,
  
  // CORS
  corsConfig,
  corsWithValidation,
  corsPublic,
  corsAuth,
  securityHeaders,
  corsErrorHandler
}; 