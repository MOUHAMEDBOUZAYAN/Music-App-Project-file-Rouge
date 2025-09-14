import React, { useState, useEffect } from 'react';
import { Upload, Music, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { songService } from '../../services/songService';
import toast from 'react-hot-toast';

const UploadSong = ({ onClose, onSuccess, onUpdate, editingSong = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: editingSong?.title || '',
    genre: Array.isArray(editingSong?.genre) ? editingSong.genre[0] : (editingSong?.genre || ''),
    duration: editingSong?.duration || '',
    description: editingSong?.description || '',
    album: Array.isArray(editingSong?.album) ? editingSong.album[0] : (editingSong?.album?._id || editingSong?.album || '')
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(!!editingSong);
  const [existingAudioUrl, setExistingAudioUrl] = useState(editingSong?.audioUrl || null);
  const [existingCoverUrl, setExistingCoverUrl] = useState(editingSong?.coverImage || null);

  // تحديث formData عندما يتغير editingSong
  useEffect(() => {
    if (editingSong) {
      console.log('🔄 UploadSong - Updating formData for editing:', editingSong);
      setFormData({
        title: editingSong.title || '',
        genre: Array.isArray(editingSong.genre) ? editingSong.genre[0] : (editingSong.genre || ''),
        duration: editingSong.duration || '',
        description: editingSong.description || '',
        album: Array.isArray(editingSong.album) ? editingSong.album[0] : (editingSong.album?._id || editingSong.album || '')
      });
      setIsEditing(true);
      setExistingAudioUrl(editingSong.audioUrl || null);
      setExistingCoverUrl(editingSong.coverImage || null);
    } else {
      console.log('🔄 UploadSong - Resetting formData for new upload');
      setFormData({
        title: '',
        genre: '',
        duration: '',
        description: '',
        album: ''
      });
      setIsEditing(false);
      setExistingAudioUrl(null);
      setExistingCoverUrl(null);
    }
  }, [editingSong]);

  const handleClose = () => {
    setFormData({
      title: '',
      genre: '',
      duration: '',
      description: '',
      album: ''
    });
    setAudioFile(null);
    setCoverFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setIsEditing(false);
    setExistingAudioUrl(null);
    setExistingCoverUrl(null);
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAudioFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('audio/')) {
        toast.error('Veuillez sélectionner un fichier audio valide');
        return;
      }
      
      // Vérifier la taille (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error('Le fichier audio ne doit pas dépasser 50MB');
        return;
      }
      
      setAudioFile(file);
      
      // Essayer d'obtenir la durée du fichier audio
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        setFormData(prev => ({
          ...prev,
          duration: Math.round(audio.duration)
        }));
      };
      audio.src = URL.createObjectURL(file);
    }
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner un fichier image valide');
        return;
      }
      
      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('L\'image de couverture ne doit pas dépasser 10MB');
        return;
      }
      
      setCoverFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier que l'utilisateur est connecté
    if (!user) {
      toast.error('Vous devez être connecté pour uploader une chanson');
      return;
    }
    
    // Pour l'édition, le fichier audio n'est pas obligatoire
    if (!isEditing && !audioFile) {
      toast.error('Veuillez sélectionner un fichier audio');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Veuillez saisir un titre');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let response;
      
      if (isEditing) {
        // Mode édition - utiliser updateSong
        console.log('🔄 UploadSong - Editing mode, coverFile:', coverFile);
        console.log('🔄 UploadSong - Existing cover URL:', existingCoverUrl);
        
        const updateData = new FormData();
        updateData.append('title', formData.title);
        updateData.append('genre', formData.genre);
        updateData.append('duration', formData.duration);
        updateData.append('description', formData.description);
        updateData.append('album', formData.album);
        
        // Ajouter les fichiers seulement s'ils sont fournis
        if (audioFile) {
          console.log('🔄 UploadSong - Adding audio file:', audioFile.name);
          updateData.append('audio', audioFile);
        }
        if (coverFile) {
          console.log('🔄 UploadSong - Adding cover file:', coverFile.name);
          updateData.append('cover', coverFile);
        }
        
        response = await songService.updateSong(editingSong._id, updateData);
      } else {
        // Mode création - utiliser uploadSonºº

        const uploadData = new FormData();
        uploadData.append('title', formData.title);
        uploadData.append('genre', formData.genre);
        uploadData.append('duration', formData.duration);
        uploadData.append('description', formData.description);
        uploadData.append('album', formData.album);
        uploadData.append('audio', audioFile);
        if (coverFile) {
          uploadData.append('cover', coverFile);
        }
        
        response = await songService.uploadSong(uploadData);
      }
      
      // Simuler le progrès d'upload seulement pour la création
      if (!isEditing) {
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return prev + 10;
          });
        }, 200);
        
        clearInterval(progressInterval);
      }
      
      setUploadProgress(100);
      
      toast.success(isEditing ? 'Chanson modifiée avec succès !' : 'Chanson uploadée avec succès !');
      
      if (isEditing && onUpdate) {
        onUpdate(response.data);
      } else if (!isEditing && onSuccess) {
        onSuccess(response.data);
      }
      
      // Réinitialiser le formulaire
      setFormData({
        title: '',
        genre: '',
        duration: '',
        description: '',
        album: ''
      });
      setAudioFile(null);
      setCoverFile(null);
      
      setTimeout(() => {
        handleClose();
      }, 1000);
      
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload de la chanson');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <Music className="h-5 w-5 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isEditing ? 'Modifier la chanson' : 'Uploader une chanson'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Fichier audio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fichier audio {isEditing ? '(optionnel)' : '*'}
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileChange}
                className="hidden"
                id="audio-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="audio-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-white font-medium">
                    {audioFile ? audioFile.name : (isEditing && existingAudioUrl ? 'Fichier actuel conservé' : 'Cliquez pour sélectionner un fichier audio')}
                  </p>
                  <p className="text-sm text-gray-400">
                    {isEditing ? 'Laissez vide pour conserver le fichier actuel' : 'MP3, WAV, M4A (max 50MB)'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Titre *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                placeholder="Titre de la chanson"
                required
                disabled={isUploading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Genre
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                disabled={isUploading}
              >
                <option value="">Sélectionner un genre</option>
                <option value="Pop">Pop</option>
                <option value="Rock">Rock</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Rap">Rap</option>
                <option value="R&B">R&B</option>
                <option value="Electronic">Electronic</option>
                <option value="Jazz">Jazz</option>
                <option value="Classical">Classical</option>
                <option value="Country">Country</option>
                <option value="Reggae">Reggae</option>
                <option value="Blues">Blues</option>
                <option value="Folk">Folk</option>
                <option value="Alternative">Alternative</option>
                <option value="Indie">Indie</option>
                <option value="Metal">Metal</option>
                <option value="Punk">Punk</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Durée (secondes)
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                placeholder="Durée en secondes"
                disabled={isUploading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Album
              </label>
              <input
                type="text"
                name="album"
                value={formData.album}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                placeholder="Nom de l'album (optionnel)"
                disabled={isUploading}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
              placeholder="Description de la chanson (optionnel)"
              disabled={isUploading}
            />
          </div>

          {/* Image de couverture */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image de couverture
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
              {/* عرض الصورة الحالية في وضع التعديل */}
              {isEditing && existingCoverUrl && !coverFile && (
                <div className="mb-4">
                  <img 
                    src={`http://localhost:5000${existingCoverUrl}`} 
                    alt="Image actuelle" 
                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-sm text-gray-400 mt-2">Image actuelle</p>
                </div>
              )}
              
              {/* عرض الصورة الجديدة إذا تم اختيارها */}
              {coverFile && (
                <div className="mb-4">
                  <img 
                    src={URL.createObjectURL(coverFile)} 
                    alt="Nouvelle image" 
                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                  />
                  <p className="text-sm text-gray-400 mt-2">Nouvelle image sélectionnée</p>
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="hidden"
                id="cover-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="cover-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-white font-medium">
                    {coverFile ? coverFile.name : (isEditing && existingCoverUrl ? 'Remplacer l\'image actuelle' : 'Cliquez pour sélectionner une image')}
                  </p>
                  <p className="text-sm text-gray-400">
                    {isEditing ? 'Laissez vide pour conserver l\'image actuelle' : 'JPG, PNG, GIF (max 10MB)'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Barre de progression */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>Upload en cours...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Boutons */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={isUploading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors font-medium flex items-center justify-center space-x-2"
              disabled={isUploading || (!isEditing && !audioFile) || !formData.title.trim()}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>{isEditing ? 'Modification...' : 'Upload...'}</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>{isEditing ? 'Modifier' : 'Uploader'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadSong;
