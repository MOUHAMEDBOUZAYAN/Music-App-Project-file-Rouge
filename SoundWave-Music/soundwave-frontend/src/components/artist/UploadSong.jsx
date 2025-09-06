import React, { useState } from 'react';
import { Upload, Music, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { songService } from '../../services/songService';
import toast from 'react-hot-toast';

const UploadSong = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    duration: '',
    description: '',
    album: ''
  });
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
    
    if (!audioFile) {
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

      // Simuler le progrès d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await songService.uploadSong(uploadData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success('Chanson uploadée avec succès !');
      
      if (onSuccess) {
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
        onClose();
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
            <h2 className="text-2xl font-bold text-white">Uploader une chanson</h2>
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
              Fichier audio *
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
                    {audioFile ? audioFile.name : 'Cliquez pour sélectionner un fichier audio'}
                  </p>
                  <p className="text-sm text-gray-400">
                    MP3, WAV, M4A (max 50MB)
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
                    {coverFile ? coverFile.name : 'Cliquez pour sélectionner une image'}
                  </p>
                  <p className="text-sm text-gray-400">
                    JPG, PNG, GIF (max 10MB)
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
              disabled={isUploading || !audioFile || !formData.title.trim()}
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Upload...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Uploader</span>
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
