/**
 * Middleware de gestion d'erreurs personnalisé
 */

// Classe d'erreur personnalisée
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware pour gérer les erreurs de développement
const errorHandlerDev = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: err.message,
    stack: err.stack,
    status: err.status
  });
};

// Middleware pour gérer les erreurs de production
const errorHandlerProd = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Erreur opérationnelle, erreur de confiance : envoyer le message à l'utilisateur
  if (err.isOperational) {
    res.status(statusCode).json({
      success: false,
      error: err.message
    });
  } else {
    // Erreur de programmation ou autre erreur inconnue : ne pas divulguer les détails
    console.error('ERROR 💥', err);
    res.status(500).json({
      success: false,
      error: 'Quelque chose s\'est mal passé!'
    });
  }
};

// Middleware pour gérer les erreurs 404
const notFound = (req, res, next) => {
  const error = new AppError(`Route non trouvée - ${req.originalUrl}`, 404);
  next(error);
};

// Middleware pour gérer les erreurs de validation Mongoose
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Données invalides. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Middleware pour gérer les erreurs de clé dupliquée Mongoose
const handleDuplicateKeyErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Valeur dupliquée: ${value}. Veuillez utiliser une autre valeur!`;
  return new AppError(message, 400);
};

// Middleware pour gérer les erreurs de cast Mongoose
const handleCastErrorDB = (err) => {
  const message = `ID invalide: ${err.value}`;
  return new AppError(message, 400);
};

// Middleware pour gérer les erreurs JWT
const handleJWTError = () => new AppError('Token invalide. Veuillez vous reconnecter!', 401);

const handleJWTExpiredError = () => new AppError('Votre token a expiré. Veuillez vous reconnecter!', 401);

// Middleware principal de gestion d'erreurs
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    errorHandlerDev(err, req, res, next);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateKeyErrorDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    errorHandlerProd(error, req, res, next);
  }
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
  handleValidationErrorDB,
  handleDuplicateKeyErrorDB,
  handleCastErrorDB,
  handleJWTError,
  handleJWTExpiredError
}; 