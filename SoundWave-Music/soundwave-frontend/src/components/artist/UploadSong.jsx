import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Music, 
  FileAudio, 
  Image, 
  Tag, 
  Globe, 
  Calendar,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Lock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { songService } from '../../services/songService';
import { useNavigate } from 'react-router-dom';

const UploadSong = () => {
  const { isAuthenticated, user, canUploadMusic } = useAuth();
  const navigate = useNavigate();
  
  const [uploadStep, setUploadStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    artist: user?.username || '',
    album: '',
    genre: '',
    releaseDate: '',
    description: '',
    lyrics: '',
    isExplicit: false,
    isPublic: true,
    price: 0,
    tags: []
  });
  const [files, setFiles] = useState({
    audio: null,
    cover: null
  });
  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState('');
  
  const audioRef = useRef(null);
  const coverRef = useRef(null);

  const genres = [
    'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Electronic', 'Jazz', 'Classical',
    'Country', 'Folk', 'Reggae', 'Blues', 'Metal', 'Punk', 'Indie'
  ];

  // Vérifier l'authentification et les permissions
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          message: 'Vous devez être connecté pour uploader une chanson',
          redirectTo: '/upload'
        }
      });
      return;
    }

    if (!canUploadMusic()) {
      navigate('/profile', { 
        state: { 
          message: 'Seuls les artistes peuvent uploader des chansons. Mettez à jour votre profil pour devenir artiste.',
          type: 'warning'
        }
      });
      return;
    }

    // Pré-remplir le nom d'artiste avec le nom d'utilisateur
    if (user?.username && !formData.artist) {
      setFormData(prev => ({ ...prev, artist: user.username }));
    }
  }, [isAuthenticated, canUploadMusic, user, navigate]);

  const handleFileSelect = (type, file) => {
    if (type === 'audio') {
      if (file && file.type.startsWith('audio/')) {
        // Vérifier la taille du fichier (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, audio: 'Le fichier audio ne doit pas dépasser 50MB' }));
          return;
        }
        setFiles(prev => ({ ...prev, audio: file }));
        setErrors(prev => ({ ...prev, audio: '' }));
      } else {
        setErrors(prev => ({ ...prev, audio: 'Veuillez sélectionner un fichier audio valide' }));
      }
    } else if (type === 'cover') {
      if (file && file.type.startsWith('image/')) {
        // Vérifier la taille du fichier (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setErrors(prev => ({ ...prev, cover: 'L\'image ne doit pas dépasser 5MB' }));
          return;
        }
        setFiles(prev => ({ ...prev, cover: file }));
        setErrors(prev => ({ ...prev, cover: '' }));
      } else {
        setErrors(prev => ({ ...prev, cover: 'Veuillez sélectionner une image valide' }));
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!formData.tags.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.artist.trim()) {
      newErrors.artist = 'Le nom d\'artiste est requis';
    }

    if (!formData.genre) {
      newErrors.genre = 'Le genre est requis';
    }

    if (!files.audio) {
      newErrors.audio = 'Le fichier audio est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      setUploadStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setUploadStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError('');

    try {
      // Préparer les données pour l'upload
      const songData = {
        title: formData.title,
        artist: formData.artist,
        album: formData.album || undefined,
        genre: formData.genre,
        description: formData.description || undefined,
        duration: 0, // Sera calculé côté serveur
        isPublic: formData.isPublic,
        tags: formData.tags
      };

      // Simuler la progression d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Appeler le service d'upload
      const result = await songService.uploadSong(songData, files.audio, files.cover);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setTimeout(() => {
          setUploadStep(4);
          setIsUploading(false);
        }, 500);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setUploadError(error.message || 'Erreur lors de l\'upload de la chanson');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Si l'utilisateur n'est pas authentifié ou n'a pas les permissions, afficher un message
  if (!isAuthenticated || !canUploadMusic()) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Accès restreint</h2>
        <p className="text-gray-400">
          {!isAuthenticated 
            ? 'Vous devez être connecté pour uploader une chanson'
            : 'Seuls les artistes peuvent uploader des chansons'
          }
        </p>
      </div>
    );
  }

  const renderStep = () => {
    switch (uploadStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Upload du fichier audio</h3>
              <p className="text-gray-400 mb-6">Sélectionnez le fichier audio que vous souhaitez uploader</p>
            </div>

            <div className="space-y-4">
              {/* Audio File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fichier audio *
                </label>
                <div
                  onClick={() => audioRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                >
                  {files.audio ? (
                    <div className="space-y-2">
                      <FileAudio className="h-12 w-12 text-blue-500 mx-auto" />
                      <p className="text-white font-medium">{files.audio.name}</p>
                      <p className="text-gray-400 text-sm">
                        {(files.audio.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="text-white font-medium">Cliquez pour sélectionner un fichier audio</p>
                      <p className="text-gray-400 text-sm">
                        Formats supportés : MP3, WAV, FLAC (Max 50MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={audioRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileSelect('audio', e.target.files[0])}
                  className="hidden"
                />
                {errors.audio && (
                  <p className="text-red-400 text-sm mt-1">{errors.audio}</p>
                )}
              </div>

              {/* Cover Art Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pochette (Optionnel)
                </label>
                <div
                  onClick={() => coverRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                >
                  {files.cover ? (
                    <div className="space-y-2">
                      <img
                        src={URL.createObjectURL(files.cover)}
                        alt="Aperçu de la pochette"
                        className="w-20 h-20 mx-auto rounded object-cover"
                      />
                      <p className="text-white text-sm">{files.cover.name}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Image className="h-8 w-8 text-gray-400 mx-auto" />
                      <p className="text-white text-sm">Cliquez pour sélectionner une pochette</p>
                      <p className="text-gray-400 text-xs">
                        Formats supportés : JPG, PNG (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={coverRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect('cover', e.target.files[0])}
                  className="hidden"
                />
                {errors.cover && (
                  <p className="text-red-400 text-sm mt-1">{errors.cover}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Informations de la chanson</h3>
              <p className="text-gray-400 mb-6">Fournissez les détails de votre chanson</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titre de la chanson *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Entrez le titre de la chanson"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom d'artiste *
                </label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => handleInputChange('artist', e.target.value)}
                  placeholder="Entrez le nom d'artiste"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.artist && (
                  <p className="text-red-400 text-sm mt-1">{errors.artist}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Album (Optionnel)
                </label>
                <input
                  type="text"
                  value={formData.album}
                  onChange={(e) => handleInputChange('album', e.target.value)}
                  placeholder="Entrez le nom de l'album"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genre *
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) => handleInputChange('genre', e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez un genre</option>
                  {genres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
                {errors.genre && (
                  <p className="text-red-400 text-sm mt-1">{errors.genre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date de sortie
                </label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prix (USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  placeholder="0.00"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Parlez-nous de votre chanson..."
                rows="3"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                placeholder="Appuyez sur Entrée pour ajouter des tags"
                onKeyPress={handleTagInput}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded text-sm"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-red-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isExplicit}
                  onChange={(e) => handleInputChange('isExplicit', e.target.checked)}
                  className="rounded bg-gray-800 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-300">Contient du contenu explicite</span>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                  className="rounded bg-gray-800 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-300">Rendre cette chanson publique</span>
              </label>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Vérification et publication</h3>
              <p className="text-gray-400 mb-6">Vérifiez les détails de votre chanson avant la publication</p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-4">
                {files.cover ? (
                  <img
                    src={URL.createObjectURL(files.cover)}
                    alt="Aperçu de la pochette"
                    className="w-20 h-20 rounded object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-700 rounded flex items-center justify-center">
                    <Music className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h4 className="text-white font-semibold text-lg">{formData.title}</h4>
                  <p className="text-gray-400">{formData.artist}</p>
                  {formData.album && (
                    <p className="text-gray-500 text-sm">{formData.album}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Genre:</span>
                  <span className="text-white ml-2">{formData.genre}</span>
                </div>
                <div>
                  <span className="text-gray-400">Date de sortie:</span>
                  <span className="text-white ml-2">{formData.releaseDate || 'Non définie'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Prix:</span>
                  <span className="text-white ml-2">${formData.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Visibilité:</span>
                  <span className="text-white ml-2">{formData.isPublic ? 'Publique' : 'Privée'}</span>
                </div>
              </div>

              {formData.description && (
                <div>
                  <span className="text-gray-400 text-sm">Description:</span>
                  <p className="text-white text-sm mt-1">{formData.description}</p>
                </div>
              )}

              {formData.tags.length > 0 && (
                <div>
                  <span className="text-gray-400 text-sm">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.tags.map(tag => (
                      <span key={tag} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">Upload réussi !</h3>
              <p className="text-gray-400">
                Votre chanson "{formData.title}" a été uploadée et est maintenant disponible sur SoundWave.
              </p>
            </div>
            
            <div className="space-y-4">
              <button 
                onClick={() => navigate(`/song/${formData.title.toLowerCase().replace(/\s+/g, '-')}`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir la page de la chanson
              </button>
              <button 
                onClick={() => {
                  setUploadStep(1);
                  setFormData({
                    title: '',
                    artist: user?.username || '',
                    album: '',
                    genre: '',
                    releaseDate: '',
                    description: '',
                    lyrics: '',
                    isExplicit: false,
                    isPublic: true,
                    price: 0,
                    tags: []
                  });
                  setFiles({ audio: null, cover: null });
                }}
                className="block mx-auto text-gray-400 hover:text-white transition-colors"
              >
                Uploader une autre chanson
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Upload de chanson</h1>
        <p className="text-gray-300">Partagez votre musique avec le monde</p>
      </div>

      {/* Progress Steps */}
      {uploadStep < 4 && (
        <div className="flex items-center space-x-4 mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= uploadStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-400'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < uploadStep ? 'bg-blue-600' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-white">Upload de votre chanson en cours...</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-gray-400 text-sm mt-2">{uploadProgress}% terminé</p>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="text-red-400">{uploadError}</span>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-gray-800 rounded-lg p-6">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      {uploadStep < 4 && !isUploading && (
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={uploadStep === 1}
            className="px-6 py-3 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Retour
          </button>

          <div className="flex items-center space-x-4">
            {uploadStep === 3 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Publier la chanson</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Suivant
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSong; 