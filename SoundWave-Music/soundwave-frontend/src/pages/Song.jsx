import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Heart, 
  Plus, 
  MoreHorizontal,
  Clock,
  Shuffle,
  Repeat,
  ArrowLeft,
  Music2,
  User,
  Calendar,
  Headphones
} from 'lucide-react';
import { useMusic } from '../store/MusicContext';
import { songService } from '../services/songService';
import toast from 'react-hot-toast';

const Song = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    playTrack, 
    addToQueue, 
    toggleLike, 
    likedTracks,
    currentTrack
  } = useMusic();
  
  const [song, setSong] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger la chanson depuis l'API
  useEffect(() => {
    const loadSong = async () => {
      setIsLoading(true);
      setError(null);
      
      // Vérifier si l'ID est valide
      if (!id || id === 'undefined' || id === 'null') {
        console.error('❌ Invalid song ID:', id);
        setError('ID de chanson invalide');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('🎵 Chargement de la chanson avec ID:', id);
        console.log('🎵 Song ID type:', typeof id);
        console.log('🎵 Song ID length:', id?.length);
        
        const response = await songService.getSongById(id);
        console.log('✅ Song response:', response);
        console.log('✅ Song response success:', response?.success);
        console.log('✅ Song response data:', response?.data);
        
        if (response.success && response.data) {
          const songData = response.data;
          console.log('✅ Song data loaded:', songData);
          
          // Transformer les données pour correspondre au format attendu
          const formattedSong = {
            id: songData._id,
            _id: songData._id,
            title: songData.title,
            artist: songData.artist?.username || songData.artist?.name || 'Artiste inconnu',
            album: songData.album?.title || songData.album?.name || 'Album inconnu',
            duration: songData.duration || 180,
            cover: songData.coverImage ? `http://localhost:5000${songData.coverImage}` : 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
            audioUrl: songData.audioUrl ? `http://localhost:5000${songData.audioUrl}` : null,
            genre: songData.genre || 'Non spécifié',
            releaseDate: songData.releaseDate || songData.createdAt,
            description: songData.description || '',
            isLiked: likedTracks.includes(songData._id)
          };
          
          setSong(formattedSong);
        } else {
          setError('Chanson non trouvée');
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement de la chanson:', error);
        console.error('❌ Error details:', {
          status: error.response?.status,
          message: error.message,
          response: error.response?.data
        });
        
        // Handle different types of errors
        if (error.response?.status === 404) {
          console.log('❌ Song not found (404)');
          console.log('❌ Song ID that was not found:', id);
          setError('Chanson non trouvée');
        } else if (error.message?.includes('timeout') || error.message?.includes('ECONNABORTED')) {
          console.log('❌ Timeout error');
          setError('Le serveur backend ne répond pas. Veuillez démarrer le backend.');
        } else if (error.message?.includes('ERR_NETWORK') || error.message?.includes('ECONNREFUSED')) {
          console.log('❌ Network error');
          setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
        } else {
          console.log('❌ Unknown error');
          setError('Erreur lors du chargement de la chanson');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadSong();
    }
  }, [id, likedTracks]);

  const handlePlaySong = () => {
    if (song) {
      console.log('🎵 Playing song:', song);
      playTrack(song);
      toast.success(`Lecture de "${song.title}"`);
    }
  };

  const handleAddToQueue = () => {
    if (song) {
      addToQueue(song);
      toast.success(`"${song.title}" ajoutée à la file d'attente`);
    }
  };

  const handleToggleLike = async () => {
    if (song) {
      try {
        await toggleLike(song);
        toast.success(song.isLiked ? 'Retiré des favoris' : 'Ajouté aux favoris');
      } catch (error) {
        console.error('Error toggling like:', error);
        toast.error('Erreur lors de la mise à jour des favoris');
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    if (!date) return 'Date inconnue';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Chargement de la chanson...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Music2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Erreur lors du chargement de la chanson</h2>
          <p className="text-gray-300 mb-2">{error}</p>
          <p className="text-gray-400 text-sm mb-6">
            {error.includes('non trouvée') 
              ? `La chanson avec l'ID ${id} n'existe pas ou a été supprimée de la base de données` 
              : 'Une erreur est survenue lors du chargement de la chanson'}
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.history.back()}
              className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors mr-3"
            >
              <ArrowLeft className="h-4 w-4 inline mr-2" />
              Retour
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Music2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-white">Aucune chanson trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black p-6">
        <div className="flex items-center space-x-4 mb-6">
          <button 
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Détails de la chanson</h1>
        </div>

        {/* Song Info */}
        <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="w-48 h-48 bg-gray-800 rounded-lg overflow-hidden">
              {song.cover ? (
                <img 
                  src={song.cover} 
                  alt={song.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                  <Music2 className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <h2 className="text-4xl md:text-5xl font-bold mb-2 truncate">{song.title}</h2>
              <div className="flex items-center space-x-2 text-gray-300">
                <User className="h-4 w-4" />
                <button 
                  onClick={() => song.artist && navigate(`/artist/${song.artist}`)}
                  className="hover:text-white transition-colors"
                >
                  {song.artist}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handlePlaySong}
                className="bg-green-500 hover:bg-green-400 text-black rounded-full w-14 h-14 flex items-center justify-center transition-colors"
              >
                <Play className="h-6 w-6 ml-1" />
              </button>
              
              <button 
                onClick={handleToggleLike}
                className={`p-2 rounded-full transition-colors ${
                  song.isLiked 
                    ? 'text-green-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
                title={song.isLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart className="h-6 w-6" fill={song.isLiked ? 'currentColor' : 'none'} />
              </button>
              
              <button 
                onClick={handleAddToQueue}
                className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                title="Ajouter à la file d'attente"
              >
                <Plus className="h-6 w-6" />
              </button>
              
              <button className="p-2 rounded-full text-gray-400 hover:text-white transition-colors">
                <MoreHorizontal className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Song Details */}
      <div className="p-6">
        <div className="max-w-4xl">
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Informations de la chanson</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Headphones className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Durée</p>
                    <p className="text-white">{formatTime(song.duration)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Artiste</p>
                    <button 
                      onClick={() => song.artist && navigate(`/artist/${song.artist}`)}
                      className="text-white hover:text-green-400 transition-colors"
                    >
                      {song.artist}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Music2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Album</p>
                    <p className="text-white">{song.album}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Date de sortie</p>
                    <p className="text-white">{formatDate(song.releaseDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Music2 className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Genre</p>
                    <p className="text-white">{song.genre}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Statut</p>
                    <p className={`${song.isLiked ? 'text-green-400' : 'text-gray-400'}`}>
                      {song.isLiked ? 'Dans les favoris' : 'Non favoris'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {song.description && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold mb-2">Description</h4>
                <p className="text-gray-300 leading-relaxed">{song.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Song;
