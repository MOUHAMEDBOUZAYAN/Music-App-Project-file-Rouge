import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Play, 
  Heart, 
  MoreHorizontal, 
  Shuffle, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Volume2, 
  List, 
  Monitor, 
  Maximize2,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useMusic } from '../store/MusicContext';
import { songService } from '../services/songService';
import { artistService } from '../services/artistService';
import { playlistService } from '../services/playlistService';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    addToQueue, 
    toggleLike, 
    likedTracks,
    playPlaylist,
    playAlbum,
    playArtist
  } = useMusic();
  
  const [currentFilter, setCurrentFilter] = useState('Tout');
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [recentAlbums, setRecentAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données au montage du composant
  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setIsLoading(true);
    try {
      // Charger les chansons tendance
      const trendingResult = await songService.getTrendingSongs({ limit: 20 });
      if (trendingResult.success) {
        setTrendingSongs(trendingResult.data.songs || []);
      }

      // Charger les artistes populaires depuis l'API
      const artistsResult = await artistService.getPopularArtists({ limit: 10 });
      if (artistsResult.success) {
        setPopularArtists(artistsResult.data.artists || []);
      } else {
        console.warn('Impossible de charger les artistes depuis l\'API:', artistsResult.error);
        setPopularArtists([]);
      }

      // Charger les playlists recommandées depuis l'API
      const playlistsResult = await playlistService.getRecommendedPlaylists({ limit: 10 });
      if (playlistsResult.success) {
        setPlaylists(playlistsResult.data.playlists || []);
      } else {
        console.warn('Impossible de charger les playlists depuis l\'API:', playlistsResult.error);
        setPlaylists([]);
      }

      // Simuler des albums récents (à remplacer par l'API)
      setRecentAlbums([
        {
          id: 1,
          name: 'SALGOAT',
          artist: 'LFERDA',
          coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
          tracks: []
        },
        {
          id: 2,
          name: 'BLEDARD (Deluxe)',
          artist: 'Draganov',
          coverUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
          tracks: []
        },
        {
          id: 3,
          name: 'SYMPHONY K',
          artist: 'ElGrandeToto',
          coverUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop',
          tracks: []
        },
        {
          id: 4,
          name: 'ICEBERG',
          artist: 'Mons',
          coverUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
          tracks: []
        }
      ]);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaySong = (song) => {
    playTrack(song);
    toast.success(`Lecture de ${song.title || song.name}`);
  };

  const handlePlayPlaylist = (playlist) => {
    playPlaylist(playlist);
    toast.success(`Lecture de la playlist ${playlist.name}`);
  };

  const handlePlayAlbum = (album) => {
    playAlbum(album);
    toast.success(`Lecture de l'album ${album.name}`);
  };

  const handlePlayArtist = (artist) => {
    playArtist(artist);
    toast.success(`Lecture des meilleurs titres de ${artist.username || artist.name}`);
  };

  const handleAddToQueue = (song) => {
    addToQueue(song);
    toast.success('Ajouté à la file d\'attente');
  };

  const handleToggleLike = (songId) => {
    toggleLike(songId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Chargement de votre musique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header avec recherche */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm border-b border-gray-800">
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
        {/* Section Bienvenue */}
        <section>
          <h1 className="text-3xl font-bold mb-6">
            Bonjour, {user?.username || 'Utilisateur'}
          </h1>
        </section>

        {/* Section Chansons tendance */}
        {trendingSongs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Chansons tendance</h2>
              <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {trendingSongs.slice(0, 10).map((song, index) => (
                <div key={song._id} className="group bg-gray-900 p-4 rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer">
                  <div className="relative mb-4">
                    <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={song.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                        alt={song.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    {/* Bouton play qui apparaît au survol */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySong(song);
                      }}
                      className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-green-400 shadow-lg"
                    >
                      <Play className="h-6 w-6 text-black ml-1" />
                    </button>

                    {/* Bouton like */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(song._id);
                      }}
                      className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                        likedTracks.includes(song._id) 
                          ? 'text-green-500 bg-black/50' 
                          : 'text-gray-400 bg-black/50 hover:text-white'
                      }`}
                    >
                      <Heart className="h-4 w-4" fill={likedTracks.includes(song._id) ? 'currentColor' : 'none'} />
                    </button>

                    {/* Bouton plus d'options */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToQueue(song);
                      }}
                      className="absolute top-2 left-2 p-2 rounded-full text-gray-400 bg-black/50 hover:text-white transition-all duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-green-400 transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">
                    {song.artist}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section Artistes populaires */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Artistes populaires</h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
              Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          {popularArtists.length > 0 ? (
            <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
              {popularArtists.map((artist) => (
                <div key={artist._id || artist.id} className="flex-shrink-0 text-center group">
                  <div className="relative mb-3">
                    <div className="w-32 h-32 bg-gray-800 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200">
                      <img
                        src={artist.avatar || artist.image || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&h=128&fit=crop&crop=face`}
                        alt={artist.username || artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Bouton play */}
                    <button 
                      onClick={() => handlePlayArtist(artist)}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <Play className="h-5 w-5 text-black ml-1" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-green-400 transition-colors">
                    {artist.username || artist.name}
                  </h3>
                  <p className="text-xs text-gray-400">Artiste</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Aucun artiste populaire disponible pour le moment</p>
            </div>
          )}
        </section>

        {/* Section Albums récents */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Albums et singles populaires</h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
              Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {recentAlbums.map((album) => (
              <div key={album.id} className="group cursor-pointer">
                <div className="relative mb-3">
                  <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={album.coverUrl}
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  {/* Bouton play */}
                  <button 
                    onClick={() => handlePlayAlbum(album)}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-green-400 shadow-lg"
                  >
                    <Play className="h-6 w-6 text-black ml-1" />
                  </button>
                </div>
                
                <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-green-400 transition-colors">
                  {album.name}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {album.artist}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section Playlists recommandées */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Playlists recommandées</h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
              Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          {playlists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {playlists.map((playlist) => (
                <div key={playlist._id || playlist.id} className="group cursor-pointer">
                  <div className="relative mb-3">
                    <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                      <img
                        src={playlist.coverUrl || playlist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    {/* Bouton play */}
                    <button 
                      onClick={() => handlePlayPlaylist(playlist)}
                      className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-green-400 shadow-lg"
                    >
                      <Play className="h-6 w-6 text-black ml-1" />
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-green-400 transition-colors">
                    {playlist.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">
                    {playlist.description || 'Playlist personnalisée'}
                  </p>
                  {playlist.songCount && (
                    <p className="text-xs text-gray-500 mt-1">
                      {playlist.songCount} chansons
                    </p>
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

        {/* Section Summer Season */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Summer season</h2>
            <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
              Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {recentAlbums.slice(0, 6).map((album, index) => (
              <div key={`summer-${album.id}`} className="group cursor-pointer">
                <div className="relative mb-3">
                  <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                    <img
                      src={album.coverUrl}
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {index === 0 && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        HOT HITS
                      </div>
                    )}
                  </div>
                  
                  {/* Bouton play */}
                  <button 
                    onClick={() => handlePlayAlbum(album)}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-green-400 shadow-lg"
                  >
                    <Play className="h-6 w-6 text-black ml-1" />
                  </button>
                </div>
                
                <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-green-400 transition-colors">
                  {album.name}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {album.artist}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home; 