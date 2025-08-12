import React, { useState, useEffect } from 'react';
import { Search, Play, Heart, MoreHorizontal, Shuffle, SkipBack, SkipForward, Repeat, Volume2, List, Monitor, Maximize2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { songService } from '../services/songService';
import { artistService } from '../services/artistService';
import { playlistService } from '../services/playlistService';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const [currentFilter, setCurrentFilter] = useState('Tout');
  const [isPlaying, setIsPlaying] = useState(false);
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données au montage du composant
  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setIsLoading(true);
    try {
      // Charger les chansons tendance
      const trendingResult = await songService.getTrendingSongs({ limit: 6 });
      if (trendingResult.success) {
        setTrendingSongs(trendingResult.data.songs || []);
      }

      // Charger les artistes populaires depuis l'API
      const artistsResult = await artistService.getPopularArtists({ limit: 5 });
      if (artistsResult.success) {
        setPopularArtists(artistsResult.data.artists || []);
      } else {
        // Fallback si l'API n'est pas disponible
        console.warn('Impossible de charger les artistes depuis l\'API:', artistsResult.error);
        setPopularArtists([]);
      }

      // Charger les playlists recommandées depuis l'API
      const playlistsResult = await playlistService.getRecommendedPlaylists({ limit: 6 });
      if (playlistsResult.success) {
        setPlaylists(playlistsResult.data.playlists || []);
      } else {
        // Fallback si l'API n'est pas disponible
        console.warn('Impossible de charger les playlists depuis l\'API:', playlistsResult.error);
        setPlaylists([]);
      }

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  // Données simulées pour les radios populaires (en attendant l'API)
  const popularRadios = [
    {
      id: 1,
      name: 'Cheb Hasni',
      description: 'Rai, Pop',
      color: 'from-green-400 to-green-600',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Cheba Warda',
      description: 'Rai, Traditionnel',
      color: 'from-yellow-400 to-yellow-600',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Draganov',
      description: 'Rap, Hip-Hop',
      color: 'from-pink-400 to-pink-600',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Bilel Tacchini',
      description: 'Pop, Rock',
      color: 'from-purple-400 to-purple-600',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'Manal',
      description: 'R&B, Soul',
      color: 'from-orange-400 to-orange-600',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: 6,
      name: 'LFERDA',
      description: 'Rap, Trap',
      color: 'from-blue-400 to-blue-600',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const handlePlaySong = (song) => {
    // Ici vous pouvez implémenter la logique de lecture
    console.log('Lecture de la chanson:', song);
    toast.success(`Lecture de ${song.title || song.name}`);
  };

  const handleLikeSong = async (songId) => {
    try {
      const result = await songService.likeSong(songId);
      if (result.success) {
        toast.success('Chanson ajoutée aux favoris');
        // Recharger les données si nécessaire
        loadHomeData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors de l\'ajout aux favoris');
    }
  };

  const handleFollowArtist = async (artistId) => {
    try {
      const result = await artistService.followArtist(artistId);
      if (result.success) {
        toast.success('Artiste ajouté à vos suivis');
        // Recharger les données pour mettre à jour l'état
        loadHomeData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors du suivi de l\'artiste');
    }
  };

  const handleFollowPlaylist = async (playlistId) => {
    try {
      const result = await playlistService.followPlaylist(playlistId);
      if (result.success) {
        toast.success('Playlist ajoutée à vos suivis');
        // Recharger les données pour mettre à jour l'état
        loadHomeData();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors du suivi de la playlist');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Chargement de votre musique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header avec recherche */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                  <SkipBack className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Que souhaitez-vous écouter ou regarder ?"
                  className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <List className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{user?.username?.charAt(0) || 'U'}</span>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex space-x-4 mt-4">
            {['Tout', 'Musique', 'Podcasts'].map((filter) => (
              <button
                key={filter}
                onClick={() => setCurrentFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  currentFilter === filter
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-6 py-8 space-y-8 pb-24">
        {/* Section Radio populaire */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Radio populaire</h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Tout afficher
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularRadios.map((radio) => (
              <div
                key={radio.id}
                className={`group relative bg-gradient-to-br ${radio.color} p-4 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200`}
                onClick={() => handlePlaySong(radio)}
              >
                <div className="aspect-square mb-4">
                  <img
                    src={radio.image}
                    alt={radio.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-white/80 mb-1">RADIO</div>
                  <h3 className="font-bold text-white mb-1">{radio.name}</h3>
                  <p className="text-xs text-white/70">{radio.description}</p>
                </div>
                <button className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-5 w-5 text-black ml-1" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section Chansons tendance */}
        {trendingSongs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Chansons tendance</h2>
              <button className="text-sm text-gray-400 hover:text-white transition-colors">
                Tout afficher
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {trendingSongs.map((song) => (
                <div key={song._id} className="group bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="aspect-square mb-4 relative">
                    <img
                      src={song.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop`}
                      alt={song.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySong(song);
                      }}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Play className="h-5 w-5 text-black ml-1" />
                    </button>
                  </div>
                  <h3 className="font-medium text-sm mb-1 truncate">{song.title}</h3>
                  <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section Artistes populaires */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Artistes populaires</h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Tout afficher
            </button>
          </div>
          
          {popularArtists.length > 0 ? (
            <div className="flex space-x-6 overflow-x-auto pb-4">
              {popularArtists.map((artist) => (
                <div key={artist._id || artist.id} className="flex-shrink-0 text-center group">
                  <div className="relative mb-3">
                    <img
                      src={artist.avatar || artist.image || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face`}
                      alt={artist.username || artist.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 flex space-x-1">
                      <button 
                        onClick={() => handlePlaySong(artist)}
                        className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="h-4 w-4 text-black ml-0.5" />
                      </button>
                      <button 
                        onClick={() => handleFollowArtist(artist._id || artist.id)}
                        className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Suivre l'artiste"
                      >
                        <Heart className="h-4 w-4 text-white" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm">{artist.username || artist.name}</h3>
                  {artist.followersCount && (
                    <p className="text-xs text-gray-400">{artist.followersCount} abonnés</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Aucun artiste populaire disponible pour le moment</p>
            </div>
          )}
        </section>

        {/* Section Playlists recommandées */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Playlists recommandées</h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors">
              Tout afficher
            </button>
          </div>
          
          {playlists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {playlists.map((playlist) => (
                <div key={playlist._id || playlist.id} className="group bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                  <div className="aspect-square mb-4 relative">
                    <img
                      src={playlist.coverUrl || playlist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop`}
                      alt={playlist.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute bottom-2 right-2 flex space-x-1">
                      <button 
                        onClick={() => handlePlaySong(playlist)}
                        className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="h-5 w-5 text-black ml-1" />
                      </button>
                      <button 
                        onClick={() => handleFollowPlaylist(playlist._id || playlist.id)}
                        className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Suivre la playlist"
                      >
                        <Heart className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm mb-1">{playlist.name}</h3>
                  <p className="text-xs text-gray-400">{playlist.description}</p>
                  {playlist.songCount && (
                    <p className="text-xs text-gray-500 mt-1">{playlist.songCount} chansons</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Aucune playlist recommandée disponible pour le moment</p>
            </div>
          )}
        </section>
      </div>

      {/* Barre de lecture (fixe en bas) */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Informations de la chanson */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
            <div>
              <div className="text-sm font-medium">Nom de la chanson</div>
              <div className="text-xs text-gray-400">Nom de l'artiste</div>
            </div>
            <button className="text-gray-400 hover:text-white">
              <Heart className="h-4 w-4" />
            </button>
          </div>

          {/* Contrôles de lecture */}
          <div className="flex flex-col items-center space-y-2 flex-1">
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-white">
                <Shuffle className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <SkipBack className="h-5 w-5" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <div className="w-4 h-4 bg-black"></div>
                ) : (
                  <Play className="h-5 w-5 text-black ml-1" />
                )}
              </button>
              <button className="text-gray-400 hover:text-white">
                <SkipForward className="h-5 w-5" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Repeat className="h-5 w-5" />
              </button>
            </div>
            
            {/* Barre de progression */}
            <div className="flex items-center space-x-2 w-full max-w-md">
              <span className="text-xs text-gray-400">-:-</span>
              <div className="flex-1 bg-gray-600 rounded-full h-1">
                <div className="bg-white h-1 rounded-full w-1/3"></div>
              </div>
              <span className="text-xs text-gray-400">-:-</span>
            </div>
          </div>

          {/* Contrôles supplémentaires */}
          <div className="flex items-center space-x-4 flex-1 justify-end">
            <button className="text-gray-400 hover:text-white">
              <List className="h-4 w-4" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <Monitor className="h-4 w-4" />
            </button>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-4 w-4 text-gray-400" />
              <div className="w-20 bg-gray-600 rounded-full h-1">
                <div className="bg-white h-1 rounded-full w-2/3"></div>
              </div>
            </div>
            <button className="text-gray-400 hover:text-white">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 