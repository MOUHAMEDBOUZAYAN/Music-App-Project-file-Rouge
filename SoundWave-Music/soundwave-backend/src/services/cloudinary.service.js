const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload un fichier vers Cloudinary
 * @param {Object} file - Le fichier à uploader
 * @param {string} folder - Le dossier de destination
 * @returns {Promise<Object>} - Résultat de l'upload
 */
const uploadToCloudinary = async (file, folder = 'soundwave') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp3', 'wav', 'flac', 'aac'],
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    
    return result;
  } catch (error) {
    throw new Error(`Erreur lors de l'upload vers Cloudinary: ${error.message}`);
  }
};

/**
 * Supprimer un fichier de Cloudinary
 * @param {string} publicId - L'ID public du fichier
 * @returns {Promise<Object>} - Résultat de la suppression
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Erreur lors de la suppression de Cloudinary: ${error.message}`);
  }
};

/**
 * Configuration du stockage Cloudinary pour Multer
 */
const createCloudinaryStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp3', 'wav', 'flac', 'aac'],
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    }
  });
};

/**
 * Middleware Multer pour l'upload d'images
 */
const uploadImage = multer({
  storage: createCloudinaryStorage('soundwave/images'),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'), false);
    }
  }
});

/**
 * Middleware Multer pour l'upload d'audio
 */
const uploadAudio = multer({
  storage: createCloudinaryStorage('soundwave/audio'),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers audio sont autorisés'), false);
    }
  }
});

/**
 * Optimiser une image
 * @param {string} publicId - L'ID public de l'image
 * @param {Object} options - Options d'optimisation
 * @returns {string} - URL de l'image optimisée
 */
const optimizeImage = (publicId, options = {}) => {
  const defaultOptions = {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  return cloudinary.url(publicId, finalOptions);
};

/**
 * Créer une miniature d'image
 * @param {string} publicId - L'ID public de l'image
 * @param {number} width - Largeur de la miniature
 * @param {number} height - Hauteur de la miniature
 * @returns {string} - URL de la miniature
 */
const createThumbnail = (publicId, width = 300, height = 300) => {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  });
};

/**
 * Obtenir les informations d'un fichier
 * @param {string} publicId - L'ID public du fichier
 * @returns {Promise<Object>} - Informations du fichier
 */
const getFileInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    throw new Error(`Erreur lors de la récupération des informations: ${error.message}`);
  }
};

/**
 * Lister les fichiers dans un dossier
 * @param {string} folder - Le dossier à lister
 * @param {Object} options - Options de pagination
 * @returns {Promise<Object>} - Liste des fichiers
 */
const listFiles = async (folder, options = {}) => {
  try {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder,
      max_results: options.maxResults || 100,
      next_cursor: options.nextCursor
    });
    
    return result;
  } catch (error) {
    throw new Error(`Erreur lors de la liste des fichiers: ${error.message}`);
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadImage,
  uploadAudio,
  optimizeImage,
  createThumbnail,
  getFileInfo,
  listFiles
}; 