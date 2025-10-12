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
  Music2
} from 'lucide-react';
import { useMusic } from '../store/MusicContext';
import { albumService } from '../services/albumService';
import toast from 'react-hot-toast';

const Album = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    playTrack, 
    addToQueue, 
    toggleLike, 
    likedTracks,
    playAlbum,
    setShuffle,
    setRepeat
  } = useMusic();
  
  const [album, setAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'album depuis l'API
  useEffect(() => {
    const loadAlbum = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('🎵 Chargement de l\'album avec ID:', id);
        console.log('🎵 Album ID type:', typeof id);
        console.log('🎵 Album ID length:', id?.length);
        
        const response = await albumService.getAlbumById(id);
        console.log('✅ Album response:', response);
        console.log('✅ Album response success:', response?.success);
        console.log('✅ Album response data:', response?.data);
        
        if (response.success && response.data) {
          const albumData = response.data;
          console.log('✅ Album data loaded:', albumData);
          
          // Transformer les données pour correspondre au format attendu
          const formattedAlbum = {
            id: albumData._id,
            name: albumData.title,
            artist: albumData.artist?.username || albumData.artist?.name || 'Artiste inconnu',
            coverUrl: albumData.coverImage ? `http://localhost:5000${albumData.coverImage}` : 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
            year: new Date(albumData.releaseDate).getFullYear(),
            genre: Array.isArray(albumData.genre) ? albumData.genre.join(', ') : albumData.genre || 'Non spécifié',
            tracks: albumData.songs?.map((song, index) => ({
              id: song._id,
              _id: song._id,
              title: song.title,
              artist: albumData.artist?.username || albumData.artist?.name || 'Artiste inconnu',
              duration: song.duration || 180,
              audioUrl: song.audioUrl ? `http://localhost:5000${song.audioUrl}` : `http://localhost:5000/uploads/audio/placeholder.mp3`,
              coverImage: song.coverImage ? `http://localhost:5000${song.coverImage}` : (albumData.coverImage ? `http://localhost:5000${albumData.coverImage}` : null),
              isLiked: false
            })) || []
          };
          
          setAlbum(formattedAlbum);
        } else {
          setError('Album non trouvé');
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement de l\'album:', error);
        console.error('❌ Error details:', {
          status: error.response?.status,
          message: error.message,
          response: error.response?.data
        });
        
        // Handle different types of errors
        if (error.response?.status === 404) {
          console.log('❌ Album not found (404)');
          console.log('❌ Album ID that was not found:', id);
          setError('Album non trouvé');
        } else if (error.message?.includes('timeout') || error.message?.includes('ECONNABORTED')) {
          console.log('❌ Timeout error');
          setError('Le serveur backend ne répond pas. Veuillez démarrer le backend.');
        } else if (error.message?.includes('ERR_NETWORK') || error.message?.includes('ECONNREFUSED')) {
          console.log('❌ Network error');
          setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.');
        } else {
          console.log('❌ Unknown error');
          setError('Erreur lors du chargement de l\'album');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadAlbum();
    }
  }, [id]);

  const handlePlayAlbum = () => {
    if (album && album.tracks.length > 0) {
      // Construire les pistes avec URLs complètes
      const baseUrl = 'http://127.0.0.1:5000';
      const formattedTracks = album.tracks.map(track => {
        // Vérifier si l'audioUrl existe et est valide
        let audioUrl = track.audioUrl;
        if (!audioUrl || audioUrl === 'null' || audioUrl === '') {
          // Essayer de construire l'URL à partir du titre
          const fileName = track.title.replace(/[^a-zA-Z0-9]/g, '_') + '.mp3';
          audioUrl = `${baseUrl}/uploads/audio/${fileName}`;
        } else if (!audioUrl.startsWith('http')) {
          audioUrl = `${baseUrl}${audioUrl}`;
        }
        
        return {
          _id: track._id || track.id,
          title: track.title,
          artist: track.artist,
          cover: track.coverImage || album.coverUrl,
          audioUrl: audioUrl,
          duration: track.duration,
          album: album.name,
          isLocal: true
        };
      });
      
      const albumToPlay = {
        ...album,
        tracks: formattedTracks
      };
      
      playAlbum(albumToPlay);
      toast.success(`Lecture de l'album ${album.name}`);
    } else {
      toast.error('Aucune piste disponible dans cet album');
    }
  };

  const handlePlayTrack = (track) => {
    console.log('🎵 handlePlayTrack called with track:', track);
    
    // Construire l'URL complète pour les fichiers locaux
    const baseUrl = 'http://127.0.0.1:5000';
    
    // Vérifier si l'audioUrl existe et est valide
    let audioUrl = track.audioUrl;
    if (!audioUrl || audioUrl === 'null' || audioUrl === '') {
      // Essayer de construire l'URL à partir du titre
      const fileName = track.title.replace(/[^a-zA-Z0-9]/g, '_') + '.mp3';
      audioUrl = `${baseUrl}/uploads/audio/${fileName}`;
    } else if (!audioUrl.startsWith('http')) {
      audioUrl = `${baseUrl}${audioUrl}`;
    }
    
    const localTrack = {
      _id: track._id || track.id,
      title: track.title,
      artist: track.artist,
      cover: track.coverImage || album.coverUrl,
      audioUrl: audioUrl,
      duration: track.duration,
      album: album.name,
      isLocal: true
    };
    
    console.log('🎵 Playing track with audioUrl:', localTrack.audioUrl);
    
    // Vérifier si l'URL audio est valide avant de jouer
    fetch(localTrack.audioUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          playTrack(localTrack);
          toast.success(`Lecture de ${track.title}`);
        } else {
          // Essayer avec un fichier placeholder
          const placeholderUrl = `${baseUrl}/uploads/audio/placeholder.mp3`;
          const placeholderTrack = { ...localTrack, audioUrl: placeholderUrl };
          
          fetch(placeholderUrl, { method: 'HEAD' })
            .then(placeholderResponse => {
              if (placeholderResponse.ok) {
                playTrack(placeholderTrack);
                toast.success(`Lecture de ${track.title} (version de démonstration)`);
              } else {
                toast.error(`Fichier audio non trouvé pour ${track.title}`);
              }
            })
            .catch(() => {
              toast.error(`Fichier audio non trouvé pour ${track.title}`);
            });
        }
      })
      .catch(error => {
        console.error('Erreur lors de la vérification du fichier audio:', error);
        // Essayer de jouer quand même
        playTrack(localTrack);
        toast.success(`Lecture de ${track.title}`);
      });
  };

  const handleAddToQueue = (track) => {
    // Construire l'URL complète pour les fichiers locaux
    const baseUrl = 'http://127.0.0.1:5000';
    
    // Vérifier si l'audioUrl existe et est valide
    let audioUrl = track.audioUrl;
    if (!audioUrl || audioUrl === 'null' || audioUrl === '') {
      // Essayer de construire l'URL à partir du titre
      const fileName = track.title.replace(/[^a-zA-Z0-9]/g, '_') + '.mp3';
      audioUrl = `${baseUrl}/uploads/audio/${fileName}`;
    } else if (!audioUrl.startsWith('http')) {
      audioUrl = `${baseUrl}${audioUrl}`;
    }
    
    const localTrack = {
      _id: track._id || track.id,
      title: track.title,
      artist: track.artist,
      cover: track.coverImage || album.coverUrl,
      audioUrl: audioUrl,
      duration: track.duration,
      album: album.name,
      isLocal: true
    };
    
    addToQueue(localTrack);
    toast.success('Ajouté à la file d\'attente');
  };

  const handleToggleLike = async (track) => {
    try {
      const trackId = track._id || track.id;
      const wasLiked = likedTracks.includes(trackId);
      
      console.log('💿 Album - handleToggleLike called:', { track, trackId, wasLiked });
      
      await toggleLike(track);
      
      if (wasLiked) {
        toast.success('Retiré des favoris');
      } else {
        toast.success('Ajouté aux favoris');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Chargement de l'album...</p>
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
          <h2 className="text-2xl font-bold text-white mb-4">Erreur lors du chargement de l'album</h2>
          <p className="text-gray-300 mb-2">{error}</p>
          <p className="text-gray-400 text-sm mb-6">
            {error.includes('non trouvé') 
              ? `L'album avec l'ID ${id} n'existe pas ou a été supprimé de la base de données` 
              : 'Une erreur est survenue lors du chargement de l\'album'}
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

  if (!album) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Album non trouvé</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header de l'album */}
      <div className="relative h-96 bg-gradient-to-b from-gray-900 to-black">
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Bouton retour */}
        <div className="absolute top-4 left-4 z-20">
          <button 
            onClick={() => navigate('/')}
            className="p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-white" />
          </button>
        </div>
        
        <div className="relative z-10 h-full flex items-end p-8">
          <div className="flex items-end space-x-6">
            {/* Cover de l'album */}
            <div className="w-64 h-64 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={album.coverUrl}
                alt={album.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Informations de l'album */}
            <div className="flex-1 min-w-0">
              <div className="mb-4">
                <h1 className="text-5xl font-bold mb-2">{album.name}</h1>
                <p className="text-xl text-gray-300">{album.artist}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400 mt-2">
                  <span>{album.year}</span>
                  <span>•</span>
                  <span>{album.genre}</span>
                  <span>•</span>
                  <span>{album.tracks.length} chansons</span>
                </div>
              </div>
              
              {/* Boutons d'action */}
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handlePlayAlbum}
                  className="px-8 py-3 bg-green-500 text-black rounded-full font-semibold hover:bg-green-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <div className="flex items-center justify-center">
                    <Play className="h-5 w-5" style={{ marginLeft: '1px' }} />
                  </div>
                  <span>Écouter</span>
                </button>
                
                <button className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                
                <button className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                  <Plus className="h-5 w-5" />
                </button>
                
                <button className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des chansons */}
      <div className="p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Chansons</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShuffle(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Mélanger"
              >
                <Shuffle className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setRepeat('all')}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Répéter"
              >
                <Repeat className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* En-têtes de colonnes */}
          <div className="grid grid-cols-[50px_1fr_100px_120px] gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
            <div>#</div>
            <div>Titre</div>
            <div className="flex justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex justify-center">Actions</div>
          </div>
        </div>
        
        {/* Liste des pistes */}
        <div className="space-y-1">
          {album.tracks.length === 0 ? (
            <div className="text-center py-12">
              <Music2 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Aucune piste dans cet album
              </h3>
              <p className="text-gray-500">
                L'artiste n'a pas encore ajouté de chansons à cet album.
              </p>
            </div>
          ) : (
            album.tracks.map((track, index) => (
            <div 
              key={track.id}
              className="grid grid-cols-[50px_1fr_100px_120px] gap-4 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-center justify-center">
                <span className="text-sm text-gray-400 group-hover:hidden font-medium">{index + 1}</span>
                <button 
                  onClick={() => handlePlayTrack(track)}
                  className="hidden group-hover:flex w-8 h-8 bg-green-500 hover:bg-green-400 rounded-full items-center justify-center transition-colors"
                  title="Lire cette piste"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <Play className="h-4 w-4 text-white" style={{ marginLeft: '1px' }} />
                  </div>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
                  {(track.coverImage && track.coverImage !== 'null') ? (
                    <img 
                      src={track.coverImage} 
                      alt={track.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center ${
                      (track.coverImage && track.coverImage !== 'null') ? 'hidden' : 'flex'
                    }`}
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(${track.title.charCodeAt(0) * 137.5 % 360}, 70%, 50%), 
                        hsl(${track.title.charCodeAt(1) * 137.5 % 360}, 70%, 30%))`
                    }}
                  >
                    <div className="text-center">
                      <Music2 className="h-5 w-5 text-white mx-auto mb-1" />
                      <div className="text-xs text-white/80 font-bold">
                        {track.title.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-white truncate group-hover:text-green-400 transition-colors">
                    {track.title}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {track.artist}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <span className="text-sm text-gray-400">
                  {formatTime(track.duration)}
                </span>
              </div>
              
              <div className="flex items-center justify-center space-x-1">
                <button 
                  onClick={() => handleToggleLike(track)}
                  className={`p-2 rounded-full transition-colors ${
                    likedTracks.includes(track.id) 
                      ? 'text-green-500' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title={likedTracks.includes(track.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart className="h-4 w-4" fill={likedTracks.includes(track.id) ? 'currentColor' : 'none'} />
                </button>
                
                <button 
                  onClick={() => handleAddToQueue(track)}
                  className="p-2 rounded-full text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  title="Ajouter à la file d'attente"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Album;
