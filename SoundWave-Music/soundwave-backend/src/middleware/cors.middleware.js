const cors = require('cors');

/**
 * Configuration CORS pour le développement
 */
const corsDev = cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Auth-Token'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400 // 24 heures
});

/**
 * Configuration CORS pour la production
 */
const corsProd = cors({
  origin: process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['https://soundwave-app.com', 'https://www.soundwave-app.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-Auth-Token'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400
});

/**
 * Configuration CORS dynamique basée sur l'environnement
 */
const corsConfig = process.env.NODE_ENV === 'production' ? corsProd : corsDev;

/**
 * Middleware CORS personnalisé avec validation d'origine
 */
const corsWithValidation = (req, res, next) => {
  const origin = req.headers.origin;
  
  // Liste des origines autorisées
  const allowedOrigins = process.env.NODE_ENV === 'production' ?
    (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []) :
    ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'];

  // Vérifier si l'origine est autorisée
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token');

  // Gérer les requêtes preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
};

/**
 * Middleware CORS pour les API publiques
 */
const corsPublic = cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],
  maxAge: 86400
});

/**
 * Middleware CORS pour les API d'authentification
 */
const corsAuth = cors({
  origin: process.env.NODE_ENV === 'production' ?
    (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []) :
    ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],
  maxAge: 86400
});

/**
 * Middleware pour ajouter des headers de sécurité
 */
const securityHeaders = (req, res, next) => {
  // Headers de sécurité
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Header CSP basique
  res.header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;");
  
  next();
};

/**
 * Middleware pour gérer les erreurs CORS
 */
const corsErrorHandler = (err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'Origine non autorisée'
    });
  }
  next(err);
};

module.exports = {
  corsConfig,
  corsWithValidation,
  corsPublic,
  corsAuth,
  securityHeaders,
  corsErrorHandler
}; 