const rateLimit = require('express-rate-limit');

/**
 * Limiteur de taux général pour toutes les routes
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // Augmenté pour le développement
  message: {
    success: false,
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
  },
  standardHeaders: true, // Retourne les headers `RateLimit-*` dans la réponse
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * Limiteur de taux strict pour l'authentification
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Augmenté pour les tests
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.'
  },
  skipSuccessfulRequests: true, // Ne compte pas les connexions réussies
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * Limiteur de taux pour l'enregistrement
 */
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 20, // Augmenté pour les tests
  message: {
    success: false,
    message: 'Trop de tentatives d\'enregistrement, veuillez réessayer plus tard.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop de tentatives d\'enregistrement, veuillez réessayer plus tard.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * Limiteur de taux pour les requêtes de recherche
 */
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // Augmenté pour le développement
  message: {
    success: false,
    message: 'Trop de requêtes de recherche, veuillez ralentir.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop de requêtes de recherche, veuillez ralentir.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * Limiteur de taux pour les uploads de fichiers
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 50, // Augmenté pour les tests
  message: {
    success: false,
    message: 'Trop d\'uploads de fichiers, veuillez réessayer plus tard.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop d\'uploads de fichiers, veuillez réessayer plus tard.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * Limiteur de taux pour les commentaires
 */
const commentLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // Augmenté pour les tests
  message: {
    success: false,
    message: 'Trop de commentaires, veuillez ralentir.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop de commentaires, veuillez ralentir.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * Limiteur de taux pour les actions sociales (like, follow, etc.)
 */
const socialActionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // Augmenté pour le développement
  message: {
    success: false,
    message: 'Trop d\'actions sociales, veuillez ralentir.'
  },
  handler: (req, res) => {
    console.log('🚫 Rate limit exceeded for social action:', req.path);
    res.status(429).json({
      success: false,
      message: 'Trop d\'actions sociales, veuillez ralentir.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  },
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  }
});

/**
 * Fonction pour créer un limiteur de taux personnalisé
 */          
const createCustomLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      });
    }
  });
};

module.exports = {
  generalLimiter,
  authLimiter,
  registerLimiter,
  searchLimiter,
  uploadLimiter,
  commentLimiter,
  socialActionLimiter,
  createCustomLimiter
}; 