const fs = require('fs');
const path = require('path');

/**
 * Middleware de logging pour enregistrer les requêtes
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Capturer la réponse originale
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    // Créer l'objet de log
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      userId: req.user ? req.user._id : 'anonymous'
    };

    // Logger dans la console en développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${logEntry.timestamp}] ${logEntry.method} ${logEntry.url} - ${logEntry.statusCode} (${logEntry.duration})`);
    }

    // Sauvegarder dans un fichier de log
    saveLogToFile(logEntry);
    
    // Appeler la méthode originale
    originalSend.call(this, data);
  };

  next();
};

/**
 * Middleware pour logger les erreurs
 */
const errorLogger = (err, req, res, next) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    error: err.message,
    stack: err.stack,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    userId: req.user ? req.user._id : 'anonymous'
  };

  // Logger l'erreur dans la console
  console.error('ERROR:', logEntry);

  // Sauvegarder l'erreur dans un fichier de log
  saveErrorToFile(logEntry);

  next(err);
};

/**
 * Middleware pour logger les performances
 */
const performanceLogger = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000; // Convertir en millisecondes
    
    if (duration > 1000) { // Logger seulement les requêtes lentes (> 1 seconde)
      const logEntry = {
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode,
        ip: req.ip || req.connection.remoteAddress,
        userId: req.user ? req.user._id : 'anonymous'
      };

      console.warn(`SLOW REQUEST: ${logEntry.method} ${logEntry.url} - ${logEntry.duration}`);
      saveSlowRequestToFile(logEntry);
    }
  });

  next();
};

/**
 * Middleware pour logger les actions importantes
 */
const activityLogger = (action) => {
  return (req, res, next) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action: action,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip || req.connection.remoteAddress,
      userId: req.user ? req.user._id : 'anonymous',
      userEmail: req.user ? req.user.email : 'anonymous'
    };

    console.log(`ACTIVITY: ${action} by ${logEntry.userEmail}`);
    console.log('🔍 Activity Logger - Détails:', {
      action,
      method: req.method,
      url: req.originalUrl,
      hasUser: !!req.user,
      userId: req.user?._id,
      userEmail: req.user?.email
    });
    saveActivityToFile(logEntry);

    next();
  };
};

/**
 * Fonction pour sauvegarder les logs dans un fichier
 */
const saveLogToFile = (logEntry) => {
  const logDir = path.join(__dirname, '../../logs');
  const logFile = path.join(logDir, 'requests.log');

  // Créer le dossier de logs s'il n'existe pas
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logLine = JSON.stringify(logEntry) + '\n';
  
  fs.appendFile(logFile, logLine, (err) => {
    if (err) {
      console.error('Erreur lors de l\'écriture du log:', err);
    }
  });
};

/**
 * Fonction pour sauvegarder les erreurs dans un fichier
 */
const saveErrorToFile = (logEntry) => {
  const logDir = path.join(__dirname, '../../logs');
  const logFile = path.join(logDir, 'errors.log');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logLine = JSON.stringify(logEntry) + '\n';
  
  fs.appendFile(logFile, logLine, (err) => {
    if (err) {
      console.error('Erreur lors de l\'écriture du log d\'erreur:', err);
    }
  });
};

/**
 * Fonction pour sauvegarder les requêtes lentes dans un fichier
 */
const saveSlowRequestToFile = (logEntry) => {
  const logDir = path.join(__dirname, '../../logs');
  const logFile = path.join(logDir, 'slow-requests.log');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logLine = JSON.stringify(logEntry) + '\n';
  
  fs.appendFile(logFile, logLine, (err) => {
    if (err) {
      console.error('Erreur lors de l\'écriture du log de requête lente:', err);
    }
  });
};

/**
 * Fonction pour sauvegarder les activités dans un fichier
 */
const saveActivityToFile = (logEntry) => {
  const logDir = path.join(__dirname, '../../logs');
  const logFile = path.join(logDir, 'activities.log');

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logLine = JSON.stringify(logEntry) + '\n';
  
  fs.appendFile(logFile, logLine, (err) => {
    if (err) {
      console.error('Erreur lors de l\'écriture du log d\'activité:', err);
    }
  });
};

/**
 * Middleware pour nettoyer les anciens logs
 */
const cleanupLogs = () => {
  const logDir = path.join(__dirname, '../../logs');
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 jours

  if (fs.existsSync(logDir)) {
    fs.readdir(logDir, (err, files) => {
      if (err) {
        console.error('Erreur lors de la lecture du dossier de logs:', err);
        return;
      }

      const now = Date.now();
      files.forEach(file => {
        const filePath = path.join(logDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) return;
          
          if (now - stats.mtime.getTime() > maxAge) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Erreur lors de la suppression du fichier de log ${file}:`, err);
              } else {
                console.log(`Fichier de log supprimé: ${file}`);
              }
            });
          }
        });
      });
    });
  }
};

// Nettoyer les logs tous les jours à 2h du matin
setInterval(cleanupLogs, 24 * 60 * 60 * 1000);

module.exports = {
  requestLogger,
  errorLogger,
  performanceLogger,
  activityLogger,
  cleanupLogs
}; 