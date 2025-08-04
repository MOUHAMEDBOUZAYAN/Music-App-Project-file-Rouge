/**
 * Utilitaires helper pour le projet SoundWave
 */

/**
 * Formater une durée en secondes vers MM:SS
 * @param {number} seconds - Durée en secondes
 * @returns {string} - Durée formatée
 */
const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Formater un nombre avec des séparateurs de milliers
 * @param {number} num - Nombre à formater
 * @returns {string} - Nombre formaté
 */
const formatNumber = (num) => {
  if (!num) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
};

/**
 * Formater une date relative (il y a X temps)
 * @param {Date} date - Date à formater
 * @returns {string} - Date relative
 */
const formatRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'À l\'instant';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `Il y a ${months} mois`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `Il y a ${years} an${years > 1 ? 's' : ''}`;
  }
};

/**
 * Générer un slug à partir d'une chaîne
 * @param {string} text - Texte à convertir en slug
 * @returns {string} - Slug généré
 */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

/**
 * Valider une adresse email
 * @param {string} email - Email à valider
 * @returns {boolean} - True si valide
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valider un nom d'utilisateur
 * @param {string} username - Nom d'utilisateur à valider
 * @returns {boolean} - True si valide
 */
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
  return usernameRegex.test(username);
};

/**
 * Valider un mot de passe
 * @param {string} password - Mot de passe à valider
 * @returns {Object} - Résultat de la validation
 */
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Générer un token aléatoire
 * @param {number} length - Longueur du token
 * @returns {string} - Token généré
 */
const generateRandomToken = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Paginer un tableau de données
 * @param {Array} data - Données à paginer
 * @param {number} page - Numéro de page
 * @param {number} limit - Limite par page
 * @returns {Object} - Données paginées
 */
const paginateData = (data, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: data.length,
      pages: Math.ceil(data.length / limit),
      hasNext: endIndex < data.length,
      hasPrev: page > 1
    }
  };
};

/**
 * Trier un tableau d'objets
 * @param {Array} data - Données à trier
 * @param {string} field - Champ de tri
 * @param {string} order - Ordre (asc/desc)
 * @returns {Array} - Données triées
 */
const sortData = (data, field, order = 'asc') => {
  return data.sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];
    
    // Gérer les valeurs nulles/undefined
    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';
    
    // Gérer les chaînes de caractères
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (order === 'desc') {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    } else {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    }
  });
};

/**
 * Filtrer un tableau d'objets
 * @param {Array} data - Données à filtrer
 * @param {Object} filters - Filtres à appliquer
 * @returns {Array} - Données filtrées
 */
const filterData = (data, filters) => {
  return data.filter(item => {
    return Object.keys(filters).every(key => {
      const filterValue = filters[key];
      const itemValue = item[key];
      
      if (filterValue === null || filterValue === undefined) {
        return true;
      }
      
      if (typeof filterValue === 'string') {
        return itemValue && itemValue.toLowerCase().includes(filterValue.toLowerCase());
      }
      
      if (Array.isArray(filterValue)) {
        return filterValue.includes(itemValue);
      }
      
      return itemValue === filterValue;
    });
  });
};

/**
 * Débouncer une fonction
 * @param {Function} func - Fonction à débouncer
 * @param {number} wait - Délai d'attente en ms
 * @returns {Function} - Fonction débouncée
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttler une fonction
 * @param {Function} func - Fonction à throttler
 * @param {number} limit - Limite en ms
 * @returns {Function} - Fonction throttlée
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Nettoyer un objet en supprimant les propriétés undefined/null
 * @param {Object} obj - Objet à nettoyer
 * @returns {Object} - Objet nettoyé
 */
const cleanObject = (obj) => {
  const cleaned = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== null && obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

/**
 * Valider un ID MongoDB
 * @param {string} id - ID à valider
 * @returns {boolean} - True si valide
 */
const isValidMongoId = (id) => {
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
  return mongoIdRegex.test(id);
};

/**
 * Calculer la similarité entre deux chaînes (algorithme de Levenshtein)
 * @param {string} str1 - Première chaîne
 * @param {string} str2 - Deuxième chaîne
 * @returns {number} - Distance de Levenshtein
 */
const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

module.exports = {
  formatDuration,
  formatNumber,
  formatRelativeTime,
  generateSlug,
  isValidEmail,
  isValidUsername,
  validatePassword,
  generateRandomToken,
  paginateData,
  sortData,
  filterData,
  debounce,
  throttle,
  cleanObject,
  isValidMongoId,
  levenshteinDistance
}; 