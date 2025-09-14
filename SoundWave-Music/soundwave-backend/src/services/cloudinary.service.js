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
    
    console.log('📁 Upload Local - Détails:', {
      originalname: file.originalname,
      fileName,
      folder,
      filePath,
      sourcePath: file.path
    });
    
    // Copier le fichier
    fs.copyFileSync(file.path, filePath);
    
    console.log('✅ Upload Local - Fichier copié avec succès');
    
    return {
      url: `/uploads/${fileName}`,
      public_id: fileName,
      secure_url: `/uploads/${fileName}`
    };
  } catch (error) {
    console.error('❌ Upload Local - Erreur:', error);
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
    console.log('🗑️ Suppression locale - Détails:', {
      fileName,
      filePath,
      exists: fs.existsSync(filePath)
    });
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✅ Suppression locale - Fichier supprimé avec succès');
    } else {
      console.log('⚠️ Suppression locale - Fichier non trouvé');
    }
    
    return { result: 'ok' };
  } catch (error) {
    console.error('❌ Suppression locale - Erreur:', error);
    throw new Error(`Erreur lors de la suppression locale: ${error.message}`);
  }
};

/**
 * Configuration du stockage local pour Multer
 */
const createLocalStorage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../../uploads', folder);
      console.log('📁 Création du stockage local:', {
        folder,
        uploadPath,
        fieldname: file.fieldname,
        originalname: file.originalname
      });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const fileName = Date.now() + '-' + file.originalname;
      console.log('📝 Nom de fichier généré:', fileName);
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
    console.log('📁 Upload Image - Fichier reçu:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    if (file.mimetype.startsWith('image/')) {
      console.log('✅ Fichier image accepté');
      cb(null, true);
    } else {
      console.log('❌ Fichier non-image rejeté');
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
    console.log('🔍 Upload Audio - Fichier reçu:', {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    if (file.mimetype.startsWith('audio/')) {
      console.log('✅ Fichier audio accepté');
      cb(null, true);
    } else {
      console.log('❌ Fichier non-audio rejeté');
      cb(new Error('Seuls les fichiers audio sont autorisés'), false);
    }
  }
});

/**
 * Middleware Multer pour l'upload multiple (audio + images)
 */
const uploadMultiple = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      try {
        let folder = 'uploads';
        if (file.fieldname === 'audio') {
          folder = 'uploads/audio';
        } else if (file.fieldname === 'cover') {
          folder = 'uploads/images';
        }
        console.log('📁 Upload Multiple - Destination:', {
          fieldname: file.fieldname,
          folder,
          originalname: file.originalname
        });
        
        const fullPath = path.join(__dirname, '../../', folder);
        console.log('📁 Upload Multiple - Full path:', fullPath);
        
        // إنشاء المجلد إذا لم يكن موجوداً
        const fs = require('fs');
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
          console.log('📁 Upload Multiple - Created directory:', fullPath);
        }
        
        // التحقق من أن المجلد قابل للكتابة
        try {
          fs.accessSync(fullPath, fs.constants.W_OK);
          console.log('📁 Upload Multiple - Directory is writable:', fullPath);
        } catch (error) {
          console.error('❌ Upload Multiple - Directory not writable:', fullPath, error);
          return cb(new Error(`Directory not writable: ${fullPath}`));
        }
        
        cb(null, fullPath);
      } catch (error) {
        console.error('❌ Upload Multiple - Destination error:', error);
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      try {
        const fileName = Date.now() + '-' + file.originalname;
        console.log('📝 Upload Multiple - Nom de fichier:', fileName);
        cb(null, fileName);
      } catch (error) {
        console.error('❌ Upload Multiple - Filename error:', error);
        cb(error);
      }
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 2, // Maximum 2 files (audio + cover)
    parts: 10, // Maximum 10 parts in the form
    fieldNameSize: 100, // Maximum field name size
    fieldSize: 1000000, // Maximum field value size
    fields: 10 // Maximum number of fields
  },
  fileFilter: (req, file, cb) => {
    console.log('🔍 Upload Multiple - Filtrage:', {
      fieldname: file.fieldname,
      mimetype: file.mimetype,
      originalname: file.originalname
    });
    
    try {
      if (file.fieldname === 'audio') {
        if (file.mimetype.startsWith('audio/')) {
          console.log('✅ Upload Multiple - Audio file accepted');
          cb(null, true);
        } else {
          console.log('❌ Upload Multiple - Audio file rejected:', file.mimetype);
          cb(new Error('Seuls les fichiers audio sont autorisés'), false);
        }
      } else if (file.fieldname === 'cover') {
        if (file.mimetype.startsWith('image/')) {
          console.log('✅ Upload Multiple - Image file accepted');
          cb(null, true);
        } else {
          console.log('❌ Upload Multiple - Image file rejected:', file.mimetype);
          cb(new Error('Seules les images sont autorisées'), false);
        }
      } else {
        console.log('❌ Upload Multiple - Unknown field:', file.fieldname);
        cb(new Error('Champ de fichier non reconnu'), false);
      }
    } catch (error) {
      console.error('❌ Upload Multiple - File filter error:', error);
      cb(error, false);
    }
  },
  onError: (err, next) => {
    console.error('❌ Multer Error:', err);
    console.error('❌ Multer Error details:', {
      message: err.message,
      code: err.code,
      field: err.field,
      stack: err.stack
    });
    
    // معالجة أفضل للأخطاء
    if (err.code === 'LIMIT_FILE_SIZE') {
      console.error('❌ Multer Error - File too large');
      return next(new Error('Fichier trop volumineux (max 50MB)'));
    }
    
    if (err.code === 'LIMIT_FILE_COUNT') {
      console.error('❌ Multer Error - Too many files');
      return next(new Error('Trop de fichiers (max 2)'));
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      console.error('❌ Multer Error - Unexpected file field');
      return next(new Error('Champ de fichier inattendu'));
    }
    
    if (err.code === 'LIMIT_PART_COUNT') {
      console.error('❌ Multer Error - Too many parts');
      return next(new Error('Trop de parties dans le formulaire'));
    }
    
    if (err.code === 'LIMIT_FIELD_KEY') {
      console.error('❌ Multer Error - Field name too long');
      return next(new Error('Nom de champ trop long'));
    }
    
    if (err.code === 'LIMIT_FIELD_VALUE') {
      console.error('❌ Multer Error - Field value too long');
      return next(new Error('Valeur de champ trop longue'));
    }
    
    if (err.code === 'ENOENT') {
      console.error('❌ Multer Error - Directory not found');
      return next(new Error('Répertoire non trouvé'));
    }
    
    if (err.code === 'EACCES') {
      console.error('❌ Multer Error - Permission denied');
      return next(new Error('Permission refusée'));
    }
    
    if (err.code === 'EMFILE') {
      console.error('❌ Multer Error - Too many open files');
      return next(new Error('Trop de fichiers ouverts'));
    }
    
    next(err);
  }
});

/**
 * Optimiser une image (simulation)
 * @param {string} fileName - Le nom du fichier
 * @param {Object} options - Options d'optimisation
 * @returns {string} - URL de l'image
 */
const optimizeImage = (fileName, options = {}) => {
  console.log('🖼️ Optimisation d\'image - Détails:', {
    fileName,
    options
  });
  
  const url = `/uploads/images/${fileName}`;
  console.log('✅ Optimisation d\'image - URL générée:', url);
  
  return url;
};

/**
 * Créer une miniature d'image (simulation)
 * @param {string} fileName - Le nom du fichier
 * @param {number} width - Largeur de la miniature
 * @param {number} height - Hauteur de la miniature
 * @returns {string} - URL de la miniature
 */
const createThumbnail = (fileName, width = 300, height = 300) => {
  console.log('🖼️ Création de miniature - Détails:', {
    fileName,
    width,
    height
  });
  
  const url = `/uploads/images/${fileName}`;
  console.log('✅ Création de miniature - URL générée:', url);
  
  return url;
};

/**
 * Obtenir les informations d'un fichier
 * @param {string} fileName - Le nom du fichier
 * @returns {Promise<Object>} - Informations du fichier
 */
const getFileInfo = async (fileName) => {
  try {
    const filePath = path.join(__dirname, '../../uploads', fileName);
    console.log('📄 Récupération d\'informations de fichier - Détails:', {
      fileName,
      filePath,
      exists: fs.existsSync(filePath)
    });
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const info = {
        public_id: fileName,
        url: `/uploads/${fileName}`,
        secure_url: `/uploads/${fileName}`,
        bytes: stats.size,
        created_at: stats.birthtime
      };
      
      console.log('✅ Informations de fichier récupérées:', info);
      return info;
    }
    
    console.log('❌ Fichier non trouvé');
    throw new Error('Fichier non trouvé');
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des informations:', error);
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
    console.log('📁 Liste des fichiers - Détails:', {
      folder,
      folderPath,
      exists: fs.existsSync(folderPath),
      options
    });
    
    if (!fs.existsSync(folderPath)) {
      console.log('⚠️ Dossier non trouvé, retour d\'une liste vide');
      return { resources: [] };
    }
    
    const files = fs.readdirSync(folderPath);
    const resources = files.map(file => ({
      public_id: file,
      url: `/uploads/${folder}/${file}`,
      secure_url: `/uploads/${folder}/${file}`
    }));
    
    console.log('✅ Liste des fichiers récupérée:', {
      count: resources.length,
      files: files
    });
    
    return { resources };
  } catch (error) {
    console.error('❌ Erreur lors de la liste des fichiers:', error);
    throw new Error(`Erreur lors de la liste des fichiers: ${error.message}`);
  }
};

module.exports = {
  uploadToLocal,
  deleteFromLocal,
  uploadImage,
  uploadAudio,
  uploadMultiple,
  optimizeImage,
  createThumbnail,
  getFileInfo,
  listFiles
}; 