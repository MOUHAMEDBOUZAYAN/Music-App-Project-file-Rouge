const rateLimit = require('express-rate-limit');

/**
 * Limiteur de taux général pour toutes les routes
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
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
  max: 5, // Limite chaque IP à 5 tentatives de connexion par fenêtre
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
  max: 3, // Limite chaque IP à 3 tentatives d'enregistrement par heure
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
  max: 30, // Limite chaque IP à 30 recherches par minute
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
  max: 10, // Limite chaque IP à 10 uploads par heure
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
  max: 10, // Limite chaque IP à 10 commentaires par 5 minutes
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
  max: 20, // Limite chaque IP à 20 actions sociales par minute
  message: {
    success: false,
    message: 'Trop d\'actions sociales, veuillez ralentir.'
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Trop d\'actions sociales, veuillez ralentir.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

/**
 * Middleware pour créer un limiteur personnalisé
 */
const createCustomLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Trop de requêtes, veuillez réessayer plus tard.'
    },
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message: message || 'Trop de requêtes, veuillez réessayer plus tard.',
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