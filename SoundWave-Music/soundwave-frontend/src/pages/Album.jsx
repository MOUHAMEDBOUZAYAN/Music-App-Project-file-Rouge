import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Play, 
  Heart, 
  Plus, 
  MoreHorizontal,
  Clock,
  Shuffle,
  Repeat
} from 'lucide-react';
import { useMusic } from '../store/MusicContext';
import toast from 'react-hot-toast';

const Album = () => {
  const { id } = useParams();
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

  // Simuler le chargement d'un album (à remplacer par l'API)
  useEffect(() => {
    const loadAlbum = async () => {
      setIsLoading(true);
      try {
        // Simulation d'un album
        const mockAlbum = {
          id: id,
          name: 'SALGOAT',
          artist: 'LFERDA',
          coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
          year: 2024,
          genre: 'Rap',
          tracks: [
            {
              id: 1,
              title: 'Intro',
              artist: 'LFERDA',
              duration: 180,
              isLiked: false
            },
            {
              id: 2,
              title: 'SALGOAT',
              artist: 'LFERDA',
              duration: 240,
              isLiked: true
            },
            {
              id: 3,
              title: 'Flow',
              artist: 'LFERDA',
              duration: 200,
              isLiked: false
            },
            {
              id: 4,
              title: 'Vibes',
              artist: 'LFERDA',
              duration: 220,
              isLiked: false
            },
            {
              id: 5,
              title: 'Outro',
              artist: 'LFERDA',
              duration: 160,
              isLiked: false
            }
          ]
        };
        
        setAlbum(mockAlbum);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'album:', error);
        toast.error('Erreur lors du chargement de l\'album');
      } finally {
        setIsLoading(false);
      }
    };

    loadAlbum();
  }, [id]);

  const handlePlayAlbum = () => {
    if (album) {
      playAlbum(album);
      toast.success(`Lecture de l'album ${album.name}`);
    }
  };

  const handlePlayTrack = (track) => {
    playTrack(track);
    toast.success(`Lecture de ${track.title}`);
  };

  const handleAddToQueue = (track) => {
    addToQueue(track);
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

  if (!album) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">Album non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header de l'album */}
      <div className="relative h-96 bg-gradient-to-b from-gray-900 to-black">
        <div className="absolute inset-0 bg-black/50"></div>
        
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
                  className="px-8 py-3 bg-green-500 text-black rounded-full font-semibold hover:bg-green-400 transition-colors flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
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
              >
                <Shuffle className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setRepeat('all')}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Repeat className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* En-têtes de colonnes */}
          <div className="grid grid-cols-[50px_1fr_100px_100px] gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800">
            <div>#</div>
            <div>Titre</div>
            <div className="flex justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <div></div>
          </div>
        </div>
        
        {/* Liste des pistes */}
        <div className="space-y-1">
          {album.tracks.map((track, index) => (
            <div 
              key={track.id}
              className="grid grid-cols-[50px_1fr_100px_100px] gap-4 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors group"
            >
              <div className="flex items-center justify-center">
                <span className="text-sm text-gray-400 group-hover:hidden">{index + 1}</span>
                <button 
                  onClick={() => handlePlayTrack(track)}
                  className="hidden group-hover:block w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Play className="h-4 w-4 text-black ml-0.5" />
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded flex-shrink-0">
                  {/* Placeholder pour la cover de la piste */}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-white truncate">
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
              
              <div className="flex items-center justify-center space-x-2">
                <button 
                  onClick={() => handleToggleLike(track)}
                  className={`p-2 rounded-full transition-colors ${
                    likedTracks.includes(track.id) 
                      ? 'text-green-500' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Heart className="h-4 w-4" fill={likedTracks.includes(track.id) ? 'currentColor' : 'none'} />
                </button>
                
                <button 
                  onClick={() => handleAddToQueue(track)}
                  className="p-2 rounded-full text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Album;
