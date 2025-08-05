const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, '../../uploads');
const imagesDir = path.join(uploadsDir, 'images');
const audioDir = path.join(uploadsDir, 'audio');

if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir);

/**
 * Upload un fichier vers le stockage local
 * @param {Object} file - Le fichier à uploader
 * @param {string} folder - Le dossier de destination
 * @returns {Promise<Object>} - Résultat de l'upload
 */
const uploadToLocal = async (file, folder = 'uploads') => {
  try {
    const fileName = Date.now() + '-' + file.originalname;
    const filePath = path.join(__dirname, '../../', folder, fileName);
    
    // Copier le fichier
    fs.copyFileSync(file.path, filePath);
    
    return {
      url: `/uploads/${fileName}`,
      public_id: fileName,
      secure_url: `/uploads/${fileName}`
    };
  } catch (error) {
    throw new Error(`Erreur lors de l'upload local: ${error.message}`);
  }
};

/**
 * Supprimer un fichier local
 * @param {string} fileName - Le nom du fichier
 * @returns {Promise<Object>} - Résultat de la suppression
 */
const deleteFromLocal = async (fileName) => {
  try {
    const filePath = path.join(__dirname, '../../uploads', fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { result: 'ok' };
  } catch (error) {
    throw new Error(`Erreur lors de la suppression locale: ${error.message}`);
  }
};

/**
 * Configuration du stockage local pour Multer
 */
const createLocalStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../uploads', folder));
    },
    filename: (req, file, cb) => {
      const fileName = Date.now() + '-' + file.originalname;
      cb(null, fileName);
    }
  });
};

/**
 * Middleware Multer pour l'upload d'images
 */
const uploadImage = multer({
  storage: createLocalStorage('images'),
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
  storage: createLocalStorage('audio'),
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
 * Optimiser une image (simulation)
 * @param {string} fileName - Le nom du fichier
 * @param {Object} options - Options d'optimisation
 * @returns {string} - URL de l'image
 */
const optimizeImage = (fileName, options = {}) => {
  return `/uploads/images/${fileName}`;
};

/**
 * Créer une miniature d'image (simulation)
 * @param {string} fileName - Le nom du fichier
 * @param {number} width - Largeur de la miniature
 * @param {number} height - Hauteur de la miniature
 * @returns {string} - URL de la miniature
 */
const createThumbnail = (fileName, width = 300, height = 300) => {
  return `/uploads/images/${fileName}`;
};

/**
 * Obtenir les informations d'un fichier
 * @param {string} fileName - Le nom du fichier
 * @returns {Promise<Object>} - Informations du fichier
 */
const getFileInfo = async (fileName) => {
  try {
    const filePath = path.join(__dirname, '../../uploads', fileName);
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      return {
        public_id: fileName,
        url: `/uploads/${fileName}`,
        secure_url: `/uploads/${fileName}`,
        bytes: stats.size,
        created_at: stats.birthtime
      };
    }
    throw new Error('Fichier non trouvé');
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
    const folderPath = path.join(__dirname, '../../uploads', folder);
    if (!fs.existsSync(folderPath)) {
      return { resources: [] };
    }
    
    const files = fs.readdirSync(folderPath);
    const resources = files.map(file => ({
      public_id: file,
      url: `/uploads/${folder}/${file}`,
      secure_url: `/uploads/${folder}/${file}`
    }));
    
    return { resources };
  } catch (error) {
    throw new Error(`Erreur lors de la liste des fichiers: ${error.message}`);
  }
};

module.exports = {
  uploadToLocal,
  deleteFromLocal,
  uploadImage,
  uploadAudio,
  optimizeImage,
  createThumbnail,
  getFileInfo,
  listFiles
}; 