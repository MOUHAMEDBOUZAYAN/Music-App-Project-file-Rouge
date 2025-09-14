const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Song = require('../models/Song');
const User = require('../models/User');
const Artist = require('../models/Artist');
const { AppError } = require('../middleware/error.middleware');
// const { uploadToCloudinary } = require('../services/cloudinary.service'); // not used with local storage

// @desc    Rechercher des chansons
// @route   GET /api/songs
// @access  Public
const searchSongs = async (req, res, next) => {
  try {
    console.log('🔍 Recherche de chansons demandée:', req.query);
    
    // Vérifier si la base de données est connectée
    console.log('🔍 État de la base de données:', mongoose.connection.readyState);
    if (!mongoose.connection.readyState) {
      console.log('⚠️ Base de données non connectée, tentative de connexion...');
      
      // Essayer de se reconnecter
      try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/soundwave', {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('✅ Reconnexion à la base de données réussie');
      } catch (error) {
        console.log('❌ Échec de la reconnexion:', error.message);
        return res.json({
          success: true,
          data: [],
          pagination: {
            page: 1,
            limit: 15,
            total: 0,
            pages: 0
          }
        });
      }
    }
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { q, genre, artist, album, sortBy = 'createdAt', sortOrder = 'desc', sort, order } = req.query;
    
    // Construire le filtre
    const filter = {};
    if (q && q.trim()) {
      const searchQuery = q.trim();
      console.log('🔍 Recherche avec query:', searchQuery);
      
      filter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { album: { $regex: searchQuery, $options: 'i' } },
        { genre: { $regex: searchQuery, $options: 'i' } }
      ];
      
      // Si la recherche est très courte, ajouter des variantes
      if (searchQuery.length <= 3) {
        filter.$or.push(
          { title: { $regex: `^${searchQuery}`, $options: 'i' } },
          { album: { $regex: `^${searchQuery}`, $options: 'i' } }
        );
      }
      
      // Recherche dans les artistes (populate)
      try {
        const artists = await Artist.find({
          $or: [
            { username: { $regex: searchQuery, $options: 'i' } },
            { name: { $regex: searchQuery, $options: 'i' } }
          ]
        }).select('_id');
        
        if (artists.length > 0) {
          const artistIds = artists.map(artist => artist._id);
          filter.$or.push({ artist: { $in: artistIds } });
        }
      } catch (error) {
        console.log('⚠️ Erreur lors de la recherche d\'artistes:', error.message);
      }
      
      console.log('🔍 Filtre de recherche:', JSON.stringify(filter, null, 2));
    }
    if (genre) {
      filter.genre = { $regex: genre, $options: 'i' };
    }
    if (artist) {
      filter.artist = { $regex: artist, $options: 'i' };
    }
    if (album) {
      filter.album = { $regex: album, $options: 'i' };
    }
    
    console.log('🔍 Filtre construit:', filter);
    console.log('🔍 Query q:', q);
    console.log('🔍 Filtre vide?', Object.keys(filter).length === 0);
    
    // Si pas de filtre, récupérer toutes les chansons
    if (Object.keys(filter).length === 0) {
      console.log('🔍 Aucun filtre, récupération de toutes les chansons');
    }
    
    // Construire le tri (gérer les deux formats: sortBy/sortOrder et sort/order)
    const sortField = sort || sortBy;
    const sortDirection = order || sortOrder;
    
    // Validation des champs de tri autorisés
    const allowedSortFields = ['createdAt', 'releaseDate', 'title', 'artist', 'genre', 'views', 'playCount', 'likes'];
    const allowedSortOrders = ['asc', 'desc', '1', '-1'];
    
    if (sortField && !allowedSortFields.includes(sortField)) {
      return res.status(400).json({
        success: false,
        message: 'Champ de tri non autorisé',
        details: `Champs autorisés: ${allowedSortFields.join(', ')}`
      });
    }
    
    if (sortDirection && !allowedSortOrders.includes(sortDirection)) {
      return res.status(400).json({
        success: false,
        message: 'Ordre de tri non autorisé',
        details: 'Ordres autorisés: asc, desc, 1, -1'
      });
    }
    
    const sortObj = {};
    if (sortField) {
      sortObj[sortField] = sortDirection === 'desc' || sortDirection === '-1' ? -1 : 1;
    } else {
      sortObj.createdAt = -1; // Tri par défaut
    }
    
    console.log('🔍 Tentative de recherche dans la base de données...');
    console.log('🔍 Filtre utilisé:', JSON.stringify(filter, null, 2));
    console.log('🔍 Tri utilisé:', JSON.stringify(sortObj, null, 2));
    
    let songs = [];
    let total = 0;
    
    try {
      // Compter d'abord le total
      total = await Song.countDocuments(filter);
      console.log('📊 Total de chansons trouvées:', total);
      
      // Puis récupérer les chansons
      songs = await Song.find(filter)
        .populate('artist', 'username avatar')
        .sort(sortObj)
        .skip(skip)
        .limit(limit);
      
      console.log('✅ Recherche réussie:', songs.length, 'chansons récupérées');
      console.log('🎵 Première chanson:', songs[0] ? songs[0].title : 'Aucune');
      
      // Si pas de résultats et pas de filtre, essayer sans populate
      if (songs.length === 0 && Object.keys(filter).length === 0) {
        console.log('🔄 Tentative sans populate...');
        songs = await Song.find(filter)
          .sort(sortObj)
          .skip(skip)
          .limit(limit);
        console.log('🎵 Chansons sans populate:', songs.length);
      }
      
      // Si toujours pas de résultats, essayer sans tri
      if (songs.length === 0 && Object.keys(filter).length === 0) {
        console.log('🔄 Tentative sans tri...');
        songs = await Song.find(filter)
          .skip(skip)
          .limit(limit);
        console.log('🎵 Chansons sans tri:', songs.length);
      }
      
      // Si toujours pas de résultats, essayer sans skip/limit
      if (songs.length === 0 && Object.keys(filter).length === 0) {
        console.log('🔄 Tentative sans skip/limit...');
        songs = await Song.find(filter);
        console.log('🎵 Chansons sans skip/limit:', songs.length);
      }
      
      // Si toujours pas de résultats, essayer sans filtre du tout
      if (songs.length === 0 && Object.keys(filter).length === 0) {
        console.log('🔄 Tentative sans filtre du tout...');
        songs = await Song.find();
        console.log('🎵 Chansons sans filtre:', songs.length);
      }
    } catch (dbError) {
      console.log('⚠️ Erreur de base de données:', dbError.message);
      
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 15,
          total: 0,
          pages: 0
        }
      });
    }
    
    // Si aucune chanson trouvée, retourner une liste vide
    if (songs.length === 0) {
      console.log('ℹ️ Aucune chanson trouvée dans la base de données');
    }
    
    console.log('🎵 Chansons finales:', songs.length);
    
    res.json({
      success: true,
      data: songs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Erreur dans searchSongs:', error);
    console.error('❌ Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la recherche de chansons',
      message: error.message
    });
  }
};


// @desc    Tester la base de données
// @route   GET /api/songs/test
// @access  Public
const testDatabase = async (req, res, next) => {
  try {
    console.log('🔍 Test de la base de données...');
    console.log('🔍 État de la connexion:', mongoose.connection.readyState);
    
    // Compter toutes les chansons
    const totalSongs = await Song.countDocuments();
    console.log('📊 Total de chansons dans la base:', totalSongs);
    
    // Récupérer quelques chansons
    const songs = await Song.find().limit(3);
    console.log('🎵 Chansons trouvées:', songs.map(s => s.title));
    
    res.json({
      success: true,
      message: 'Test de base de données réussi',
      data: {
        connectionState: mongoose.connection.readyState,
        totalSongs,
        sampleSongs: songs.map(s => ({ title: s.title, artist: s.artist }))
      }
    });
  } catch (error) {
    console.error('❌ Erreur lors du test de base de données:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du test de base de données',
      message: error.message
    });
  }
};

// @desc    Obtenir les détails d'une chanson
// @route   GET /api/songs/:id
// @access  Public
const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const song = await Song.findById(id)
      .populate('artist', 'username avatar bio');
    
    if (!song) {
      return next(new AppError('Chanson non trouvée', 404));
    }
    
    // Incrémenter le nombre de vues (plays)
    song.plays = (song.plays || 0) + 1;
    await song.save();
    
    res.json({
      success: true,
      data: song
    });
  } catch (error) {
    console.error('❌ Get Song By ID Error:', error);
    next(new AppError(`Erreur lors de la récupération de la chanson: ${error.message}`, 500));
  }
};

// @desc    Uploader une nouvelle chanson
// @route   POST /api/songs
// @access  Private
const uploadSong = async (req, res, next) => {
  try {
    // Vérifier que l'utilisateur est connecté
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Vous devez être connecté pour uploader une chanson'
      });
    }

    const { title, genre, duration, description, album } = req.body;
    const artistId = req.user._id;
    
    console.log('🎵 Upload Song - Données reçues:', {
      title,
      genre,
      duration,
      description,
      album,
      artistId,
      files: req.files,
      file: req.file
    });
    
    console.log('🔍 Vérification des fichiers:', {
      hasFiles: !!req.files,
      filesKeys: req.files ? Object.keys(req.files) : 'no files',
      audioFile: req.files?.audio ? req.files.audio[0] : 'no audio',
      coverFile: req.files?.cover ? req.files.cover[0] : 'no cover'
    });
    
    // Vérifier que le fichier audio est présent
    if (!req.files || !req.files.audio || !req.files.audio[0]) {
      return res.status(400).json({
        success: false,
        message: 'Fichier audio requis'
      });
    }
    
    // Upload du fichier audio
    const audioFile = req.files.audio[0];
    const audioUrl = `/uploads/audio/${audioFile.filename}`;
    
    // Upload de l'image de couverture si présente
    let coverImage = null;
    if (req.files.cover && req.files.cover[0]) {
      const coverFile = req.files.cover[0];
      coverImage = `/uploads/images/${coverFile.filename}`;
    }
    
    // Créer la chanson
    const song = await Song.create({
      title,
      artist: artistId,
      album: album || '',
      genre: genre ? [genre] : [],
      duration: duration ? parseInt(duration) : undefined,
      description,
      audioUrl,
      coverImage,
      isPublic: true
    });
    
    console.log('✅ Chanson créée avec succès:', song._id);
    
    const populatedSong = await Song.findById(song._id)
      .populate('artist', 'username profilePicture bio')
      .populate('album', 'title coverImage');
    
    res.status(201).json({
      success: true,
      data: populatedSong
    });
  } catch (error) {
    console.error('❌ Erreur lors de l\'upload de la chanson:', error);
    console.error('❌ Stack trace:', error.stack);
    
    // Retourner une réponse d'erreur détaillée
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload de la chanson',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur',
      details: process.env.NODE_ENV === 'development' ? error.stack : null
    });
  }
};

// @desc    Mettre à jour une chanson
// @route   PUT /api/songs/:id
// @access  Private
const updateSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, artist, album, genre, duration, description } = req.body;
    const userId = req.user._id;
    
    console.log('🔄 Update Song - ID:', id, 'User:', userId);
    console.log('🔄 Update Song - Body:', req.body);
    console.log('🔄 Update Song - Files:', req.files);
    
    // التحقق من وجود الملفات
    if (req.files) {
      console.log('🔄 Update Song - Files details:', {
        audio: req.files.audio ? req.files.audio[0] : null,
        cover: req.files.cover ? req.files.cover[0] : null
      });
      
      // التحقق من صحة الملفات
      if (req.files.audio && req.files.audio[0]) {
        console.log('🔄 Update Song - Audio file details:', {
          originalname: req.files.audio[0].originalname,
          mimetype: req.files.audio[0].mimetype,
          size: req.files.audio[0].size
        });
      }
      
      if (req.files.cover && req.files.cover[0]) {
        console.log('🔄 Update Song - Cover file details:', {
          originalname: req.files.cover[0].originalname,
          mimetype: req.files.cover[0].mimetype,
          size: req.files.cover[0].size
        });
      }
    }
    
    const song = await Song.findById(id);
    
    if (!song) {
      return next(new AppError('Chanson non trouvée', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire ou un admin
    if (song.artist.toString() !== userId.toString() && req.user.role !== 'admin') {
      return next(new AppError('Vous n\'êtes pas autorisé à modifier cette chanson', 403));
    }
    
    // Préparer les données de mise à jour
    const updateData = {
      title: title || song.title,
      artist: artist || song.artist,
      album: album || song.album,
      genre: genre || song.genre,
      duration: duration ? parseInt(duration) : song.duration,
      description: description || song.description
    };
    
    // Traiter le fichier audio s'il est fourni
    if (req.files && req.files.audio) {
      console.log('🔄 Update Song - Processing audio file:', req.files.audio[0]);
      const audioFile = req.files.audio[0];
      
      // التحقق من صحة الملف
      if (!audioFile || !audioFile.originalname) {
        console.error('❌ Update Song - Invalid audio file');
        throw new Error('Fichier audio invalide');
      }
      
      // التحقق من نوع الملف
      if (!audioFile.mimetype.startsWith('audio/')) {
        console.error('❌ Update Song - Invalid audio file type:', audioFile.mimetype);
        throw new Error('Le fichier audio doit être un fichier audio');
      }
      
      const audioPath = `uploads/audio/${Date.now()}-${audioFile.originalname}`;
      console.log('🔄 Update Song - Audio path:', audioPath);
      
      try {
        // Vérifier que le dossier existe
        const audioDir = path.dirname(audioPath);
        if (!fs.existsSync(audioDir)) {
          fs.mkdirSync(audioDir, { recursive: true });
          console.log('🔄 Update Song - Created directory:', audioDir);
        }
        
        // التحقق من وجود دالة mv
        if (typeof audioFile.mv !== 'function') {
          console.error('❌ Update Song - audioFile.mv is not a function');
          throw new Error('Fonction de déplacement de fichier non disponible');
        }
        
        console.log('🔄 Update Song - Moving audio file to:', audioPath);
        await audioFile.mv(audioPath);
        updateData.audioUrl = `/${audioPath}`;
        console.log('✅ Update Song - Audio file saved successfully:', audioPath);
      } catch (error) {
        console.error('❌ Update Song - Error saving audio file:', error);
        console.error('❌ Update Song - Error details:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        throw new Error(`Erreur lors de la sauvegarde du fichier audio: ${error.message}`);
      }
    }
    
    // Traiter l'image de couverture s'il est fournie
    if (req.files && req.files.cover) {
      console.log('🔄 Update Song - Processing cover file:', req.files.cover[0]);
      const coverFile = req.files.cover[0];
      
      // التحقق من صحة الملف
      if (!coverFile || !coverFile.originalname) {
        console.error('❌ Update Song - Invalid cover file');
        throw new Error('Fichier de couverture invalide');
      }
      
      // التحقق من نوع الملف
      if (!coverFile.mimetype.startsWith('image/')) {
        console.error('❌ Update Song - Invalid cover file type:', coverFile.mimetype);
        throw new Error('Le fichier de couverture doit être une image');
      }
      
      const coverPath = `uploads/images/${Date.now()}-${coverFile.originalname}`;
      console.log('🔄 Update Song - Cover path:', coverPath);
      
      try {
        // Vérifier que le dossier existe
        const imageDir = path.dirname(coverPath);
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
          console.log('🔄 Update Song - Created directory:', imageDir);
        }
        
        // التحقق من وجود دالة mv
        if (typeof coverFile.mv !== 'function') {
          console.error('❌ Update Song - coverFile.mv is not a function');
          throw new Error('Fonction de déplacement de fichier non disponible');
        }
        
        console.log('🔄 Update Song - Moving cover file to:', coverPath);
        
        // التحقق من أن الملف قابل للكتابة
        try {
          fs.accessSync(imageDir, fs.constants.W_OK);
          console.log('✅ Update Song - Directory is writable:', imageDir);
        } catch (error) {
          console.error('❌ Update Song - Directory not writable:', imageDir, error);
          throw new Error(`Directory not writable: ${imageDir}`);
        }
        
        await coverFile.mv(coverPath);
        updateData.coverImage = `/${coverPath}`;
        console.log('✅ Update Song - Cover file saved successfully:', coverPath);
      } catch (error) {
        console.error('❌ Update Song - Error saving cover file:', error);
        console.error('❌ Update Song - Error details:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        throw new Error(`Erreur lors de la sauvegarde de l'image de couverture: ${error.message}`);
      }
    }
    
    console.log('🔄 Update Song - Final updateData:', updateData);
    
    let updatedSong;
    try {
      updatedSong = await Song.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).populate('artist', 'username avatar');
      
      if (!updatedSong) {
        console.error('❌ Update Song - Song not found after update');
        throw new Error('Chanson non trouvée après la mise à jour');
      }
      
      console.log('✅ Update Song - Database update successful:', updatedSong.title);
      console.log('✅ Update Song - Updated cover image:', updatedSong.coverImage);
    } catch (error) {
      console.error('❌ Update Song - Database error:', error);
      console.error('❌ Update Song - Database error details:', {
        message: error.message,
        name: error.name,
        code: error.code
      });
      throw new Error(`Erreur lors de la mise à jour en base de données: ${error.message}`);
    }
    
    res.json({
      success: true,
      message: 'Chanson modifiée avec succès',
      data: updatedSong
    });
  } catch (error) {
    console.error('❌ Update Song Error:', error);
    console.error('❌ Update Song Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack
    });
    
    // إرسال استجابة خطأ مباشرة بدلاً من استخدام next()
    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la chanson',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Supprimer une chanson
// @route   DELETE /api/songs/:id
// @access  Private
const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    console.log('🗑️ Delete Song - ID:', id, 'User:', userId);
    
    const song = await Song.findById(id);
    
    if (!song) {
      return next(new AppError('Chanson non trouvée', 404));
    }
    
    // Vérifier si l'utilisateur est le propriétaire ou un admin
    if (song.artist.toString() !== userId.toString() && req.user.role !== 'admin') {
      return next(new AppError('Vous n\'êtes pas autorisé à supprimer cette chanson', 403));
    }
    
    // Supprimer les fichiers associés
    if (song.audioUrl) {
      const audioPath = path.join(__dirname, '../../', song.audioUrl);
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    }
    
    if (song.coverImage) {
      const coverPath = path.join(__dirname, '../../', song.coverImage);
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }
    
    await Song.findByIdAndDelete(id);
    
    console.log('✅ Chanson supprimée avec succès:', id);
    
    res.json({
      success: true,
      message: 'Chanson supprimée avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de la chanson:', error);
    next(new AppError('Erreur lors de la suppression de la chanson', 500));
  }
};

// @desc    Aimer/ne plus aimer une chanson
// @route   POST /api/songs/:id/like
// @access  Private
const likeUnlikeSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    console.log('❤️ likeUnlikeSong called:', { songId: id, userId });
    
    const song = await Song.findById(id);
    
    if (!song) {
      console.log('❌ Song not found:', id);
      return next(new AppError('Chanson non trouvée', 404));
    }
    
    const isLiked = song.likes.map(id => id.toString()).includes(userId.toString());
    console.log('💖 Current like status:', { isLiked, currentLikes: song.likes.length });
    
    if (isLiked) {
      // Ne plus aimer
      song.likes = song.likes.filter(likeId => likeId.toString() !== userId.toString());
      console.log('➖ Removing like, new likes count:', song.likes.length);
    } else {
      // Aimer
      song.likes.push(userId);
      console.log('➕ Adding like, new likes count:', song.likes.length);
    }
    
    await song.save();
    console.log('💾 Song saved successfully');
    
    res.json({
      success: true,
      data: {
        liked: !isLiked,
        likesCount: song.likes.length
      }
    });
  } catch (error) {
    console.error('❌ Error in likeUnlikeSong:', error);
    next(new AppError('Erreur lors de l\'action like', 500));
  }
};

// @desc    Obtenir les chansons likées par l'utilisateur connecté
// @route   GET /api/songs/liked
// @access  Private
const getLikedSongs = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log('🔍 getLikedSongs called for user:', userId);
    
    const ExternalFavorite = require('../models/ExternalFavorite');

    const songs = await Song.find({ likes: userId })
      .populate('artist', 'username name profilePicture')
      .populate('album', 'title name cover');
    
    console.log('🎵 Found liked songs:', songs.length, songs.map(s => ({ 
      id: s._id, 
      title: s.title, 
      coverImage: s.coverImage,
      albumCover: s.album?.cover,
      fullSong: s.toObject()
    })));

    // Fetch external favorites (e.g., Deezer) and return as lightweight entries
    const externals = await ExternalFavorite.find({ user: userId });

    const response = [
      ...songs.map(s => ({
        type: 'local',
        _id: s._id,
        title: s.title,
        artist: s.artist?.username || s.artist?.name || 'Artiste inconnu',
        album: s.album?.title || s.album?.name,
        cover: s.coverImage ? `http://localhost:5000${s.coverImage}` : (s.album?.cover ? `http://localhost:5000${s.album.cover}` : null),
        coverImage: s.coverImage ? `http://localhost:5000${s.coverImage}` : null,
        audioUrl: s.audioUrl ? `http://localhost:5000${s.audioUrl}` : null,
        duration: s.duration,
        createdAt: s.createdAt
      })),
      ...externals.map(e => ({
        type: 'external',
        provider: e.provider,
        externalId: e.externalId,
        title: e.title,
        artist: e.artist,
        album: e.album,
        cover: e.cover,
        duration: e.duration,
        createdAt: e.createdAt
      }))
    ];

    console.log('📤 Sending response with', response.length, 'items:', response.map(r => ({ type: r.type, title: r.title })));
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des chansons likées', 500));
  }
};

// @desc    Ajouter un commentaire à une chanson
// @route   POST /api/songs/:id/comment
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
    const song = await Song.findById(id);
    
    if (!song) {
      return next(new AppError('Chanson non trouvée', 404));
    }
    
    const comment = {
      user: userId,
      content,
      createdAt: new Date()
    };
    
    song.comments.push(comment);
    song.commentsCount += 1;
    await song.save();
    
    // Récupérer le commentaire avec les informations de l'utilisateur
    const populatedSong = await Song.findById(id)
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar'
        }
      });
    
    const newComment = populatedSong.comments[populatedSong.comments.length - 1];
    
    res.status(201).json({
      success: true,
      data: newComment
    });
  } catch (error) {
    next(new AppError('Erreur lors de l\'ajout du commentaire', 500));
  }
};

// @desc    Obtenir les chansons tendance
// @route   GET /api/songs/trending
// @access  Public
const getTrendingSongs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const songs = await Song.find()
      .populate('artist', 'username avatar')
      .sort({ plays: -1, likes: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Song.countDocuments();
    
    res.json({
      success: true,
      data: songs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des chansons tendance', 500));
  }
};

// @desc    Obtenir toutes les chansons (pour les albums récents)
// @route   GET /api/songs/all
// @access  Public
const getAllSongs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { sortBy = 'createdAt', sortOrder = 'desc', sort, order } = req.query;
    
    // Construire le tri (gérer les deux formats: sortBy/sortOrder et sort/order)
    const sortField = sort || sortBy;
    const sortDirection = order || sortOrder;
    
    // Validation des champs de tri autorisés
    const allowedSortFields = ['createdAt', 'releaseDate', 'title', 'artist', 'genre', 'views', 'playCount', 'likes'];
    const allowedSortOrders = ['asc', 'desc', '1', '-1'];
    
    if (sortField && !allowedSortFields.includes(sortField)) {
      return res.status(400).json({
        success: false,
        message: 'Champ de tri non autorisé',
        details: `Champs autorisés: ${allowedSortFields.join(', ')}`
      });
    }
    
    if (sortDirection && !allowedSortOrders.includes(sortDirection)) {
      return res.status(400).json({
        success: false,
        message: 'Ordre de tri non autorisé',
        details: 'Ordres autorisés: asc, desc, 1, -1'
      });
    }
    
    const sortObj = {};
    if (sortField) {
      sortObj[sortField] = sortDirection === 'desc' || sortDirection === '-1' ? -1 : 1;
    } else {
      sortObj.createdAt = -1; // Tri par défaut
    }
    
    const songs = await Song.find({ isPublic: true })
      .populate('artist', 'username profilePicture bio')
      .populate('album', 'title coverImage')
      .sort(sortObj)
      .skip(skip)
      .limit(limit);
    
    const total = await Song.countDocuments({ isPublic: true });
    
    res.json({
      success: true,
      data: songs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération des chansons', 500));
  }
};

// @desc    Obtenir les chansons de l'utilisateur connecté
// @route   GET /api/songs/user
// @access  Private
const getUserSongs = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const songs = await Song.find({ artist: userId })
      .populate('artist', 'username profilePicture bio')
      .populate('album', 'title coverImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Song.countDocuments({ artist: userId });
    
    res.json({
      success: true,
      data: songs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(new AppError('Erreur lors de la récupération de vos chansons', 500));
  }
};

module.exports = {
  searchSongs,
  testDatabase,
  getSongById,
  uploadSong,
  updateSong,
  deleteSong,
  likeUnlikeSong,
  getLikedSongs,
  addComment,
  getTrendingSongs,
  getAllSongs,
  getUserSongs
}; 