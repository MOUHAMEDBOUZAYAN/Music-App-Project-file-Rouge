import React, { useState, useEffect } from 'react';
import { Plus, Music, X, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { albumService } from '../../services/albumService';
import { songService } from '../../services/songService';
import toast from 'react-hot-toast';

const CreateAlbum = ({ onClose, onSuccess, editingAlbum }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    releaseDate: '',
    description: ''
  });
  const [coverFile, setCoverFile] = useState(null);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [loadingSongs, setLoadingSongs] = useState(false);

  useEffect(() => {
    loadUserSongs();
  }, []);

  // Pré-remplir le formulaire si on modifie un album existant
  useEffect(() => {
    if (editingAlbum) {
      setFormData({
        title: editingAlbum.title || '',
        genre: editingAlbum.genre || '',
        releaseDate: editingAlbum.releaseDate ? new Date(editingAlbum.releaseDate).toISOString().split('T')[0] : '',
        description: editingAlbum.description || ''
      });
      setSelectedSongs(editingAlbum.songs ? editingAlbum.songs.map(song => song._id || song) : []);
    }
  }, [editingAlbum]);

  const loadUserSongs = async () => {
    setLoadingSongs(true);
    try {
      const response = await songService.getUserSongs();
      setAvailableSongs(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des chansons:', error);
      toast.error('Erreur lors du chargement de vos chansons');
    } finally {
      setLoadingSongs(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSongToggle = (songId) => {
    setSelectedSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      } else {
        return [...prev, songId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Veuillez saisir un titre d\'album');
      return;
    }

    if (!editingAlbum && !coverFile) {
      toast.error('Veuillez sélectionner une image de couverture');
      return;
    }

    if (selectedSongs.length === 0) {
      toast.error('Veuillez sélectionner au moins une chanson');
      return;
    }

    setIsCreating(true);

    try {
      if (editingAlbum) {
        // Modification d'un album existant
        const albumData = new FormData();
        albumData.append('title', formData.title);
        albumData.append('genre', formData.genre);
        albumData.append('releaseDate', formData.releaseDate);
        albumData.append('description', formData.description);
        albumData.append('songs', JSON.stringify(selectedSongs));
        
        // Ajouter l'image de couverture seulement si une nouvelle image est sélectionnée
        if (coverFile) {
          albumData.append('cover', coverFile);
        }

        const response = await albumService.updateAlbum(editingAlbum._id, albumData);
        
        toast.success('Album modifié avec succès !');
        
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        // Création d'un nouvel album
        const albumData = new FormData();
        albumData.append('title', formData.title);
        albumData.append('genre', formData.genre);
        albumData.append('releaseDate', formData.releaseDate);
        albumData.append('description', formData.description);
        albumData.append('songs', JSON.stringify(selectedSongs));
        albumData.append('cover', coverFile);

        const response = await albumService.createAlbum(albumData);
        
        toast.success('Album créé avec succès !');
        
        if (onSuccess) {
          onSuccess(response.data);
        }
      }
      
      // Réinitialiser le formulaire
      setFormData({
        title: '',
        genre: '',
        releaseDate: '',
        description: ''
      });
      setCoverFile(null);
      setSelectedSongs([]);
      
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error) {
      console.error(`Erreur lors de la ${editingAlbum ? 'modification' : 'création'} de l'album:`, error);
      toast.error(error.response?.data?.message || `Erreur lors de la ${editingAlbum ? 'modification' : 'création'} de l'album`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Music className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {editingAlbum ? 'Modifier l\'album' : 'Créer un album'}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations de l'album */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Informations de l'album</h3>
              
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titre de l'album *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  placeholder="Titre de l'album"
                  required
                  disabled={isCreating}
                />
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genre
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  disabled={isCreating}
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

              {/* Date de sortie */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date de sortie
                </label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  disabled={isCreating}
                />
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
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Description de l'album (optionnel)"
                  disabled={isCreating}
                />
              </div>

              {/* Image de couverture */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image de couverture {!editingAlbum && '*'}
                </label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileChange}
                    className="hidden"
                    id="cover-upload"
                    disabled={isCreating}
                  />
                  <label
                    htmlFor="cover-upload"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">
                        {coverFile ? coverFile.name : (editingAlbum ? 'Cliquez pour changer l\'image' : 'Cliquez pour sélectionner une image')}
                      </p>
                      <p className="text-sm text-gray-400">
                        JPG, PNG, GIF (max 10MB)
                        {editingAlbum && ' - Laissez vide pour garder l\'image actuelle'}
                      </p>
                    </div>
                  </label>
                </div>
                {editingAlbum && editingAlbum.coverImage && !coverFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400 mb-2">Image actuelle :</p>
                    <img 
                      src={`http://localhost:5000${editingAlbum.coverImage}`} 
                      alt="Couverture actuelle"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sélection des chansons */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Sélectionner les chansons</h3>
              
              {loadingSongs ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : availableSongs.length === 0 ? (
                <div className="text-center py-8">
                  <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Aucune chanson disponible</p>
                  <p className="text-sm text-gray-500">
                    Vous devez d'abord uploader des chansons pour créer un album
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {availableSongs.map((song) => (
                    <div
                      key={song._id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedSongs.includes(song._id)
                          ? 'bg-blue-500/20 border-blue-500'
                          : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
                      }`}
                      onClick={() => handleSongToggle(song._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {song.title}
                          </p>
                          <p className="text-sm text-gray-400">
                            {song.genre && `${song.genre} • `}
                            {song.duration && `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`}
                          </p>
                        </div>
                        <div className="ml-3">
                          {selectedSongs.includes(song._id) ? (
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                          ) : (
                            <div className="h-5 w-5 border-2 border-gray-400 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedSongs.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-blue-400 text-sm font-medium">
                    {selectedSongs.length} chanson{selectedSongs.length > 1 ? 's' : ''} sélectionnée{selectedSongs.length > 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Boutons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              disabled={isCreating}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors font-medium flex items-center justify-center space-x-2"
              disabled={isCreating || !formData.title.trim() || (!editingAlbum && !coverFile) || selectedSongs.length === 0}
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{editingAlbum ? 'Modification...' : 'Création...'}</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>{editingAlbum ? 'Modifier l\'album' : 'Créer l\'album'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlbum;
