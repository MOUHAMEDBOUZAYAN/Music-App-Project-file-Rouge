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
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
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
        setPopularArtists(artistsResult.data || []);
      } else {
        console.warn('Impossible de charger les artistes depuis l\'API:', artistsResult.error);
        setPopularArtists([]);
      }

      // Charger les playlists recommandées depuis l'API
      const playlistsResult = await playlistService.getRecommendedPlaylists({ limit: 10 });
      if (playlistsResult.success) {
        setPlaylists(playlistsResult.data || []);
      } else {
        console.warn('Impossible de charger les playlists depuis l\'API:', playlistsResult.error);
        setPlaylists([]);
      }

      // Charger les albums récents depuis l'API
      try {
        const albumsResult = await songService.getRecentAlbums({ limit: 4 });
        if (albumsResult.success) {
          setRecentAlbums(albumsResult.data || []);
        } else {
          console.warn('Impossible de charger les albums récents depuis l\'API:', albumsResult.error);
          setRecentAlbums([]);
        }
      } catch (error) {
        console.warn('Erreur lors du chargement des albums récents:', error);
        setRecentAlbums([]);
      }

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

  const handleArtistClick = (artist) => {
    // Naviguer vers la page de l'artiste
    navigate(`/artist/${artist._id || artist.id}`);
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
    <div className="min-h-screen bg-bemusic-primary text-bemusic-primary overflow-x-hidden">
      {/* Header avec recherche */}
      <div className="sticky top-0 z-10 bg-bemusic-primary/95 backdrop-blur-sm border-b border-bemusic-tertiary/20">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-bemusic-secondary hover:bg-bemusic-tertiary transition-colors">
                  <SkipBack className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-bemusic-secondary hover:bg-bemusic-tertiary transition-colors">
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-bemusic-tertiary" />
                <input
                  type="text"
                  placeholder="Que souhaitez-vous écouter ou regarder ?"
                  className="w-full bg-bemusic-secondary text-bemusic-primary placeholder-bemusic-tertiary rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-bemusic"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-bemusic-secondary hover:bg-bemusic-tertiary transition-colors">
                <List className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-accent-bemusic to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">{user?.username?.charAt(0) || 'U'}</span>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex space-x-4 mt-4 overflow-x-auto pb-2">
            {['Tout', 'Musique', 'Podcasts'].map((filter) => (
              <button
                key={filter}
                onClick={() => setCurrentFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  currentFilter === filter
                    ? 'bg-accent-bemusic text-white'
                    : 'bg-bemusic-secondary text-bemusic-tertiary hover:bg-bemusic-tertiary hover:text-bemusic-primary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 lg:px-6 py-6 lg:py-8 space-y-6 lg:space-y-8 pb-24">
        {/* Section Bienvenue */}
        <section>
          <h1 className="text-2xl lg:text-3xl font-bold mb-6">
            Bonjour, {user?.username || 'Utilisateur'}
          </h1>
        </section>

        {/* Section Chansons tendance */}
        {trendingSongs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-bemusic-primary">Chansons tendance</h2>
              <button className="text-sm text-bemusic-tertiary hover:text-bemusic-primary transition-colors flex items-center">
                Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {trendingSongs.slice(0, 10).map((song, index) => (
                <div key={song._id} className="group bg-bemusic-secondary p-4 rounded-lg hover:bg-bemusic-tertiary/20 transition-all duration-200 cursor-pointer border border-bemusic-tertiary/20">
                  <div className="relative mb-4">
                    <div className="aspect-square bg-bemusic-tertiary/20 rounded-lg overflow-hidden">
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
                      className="absolute bottom-2 right-2 w-12 h-12 bg-accent-bemusic rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-accent-bemusic/80 shadow-lg"
                    >
                      <Play className="h-6 w-6 text-bemusic-primary ml-1" />
                    </button>

                    {/* Bouton like */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(song._id);
                      }}
                      className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                        likedTracks.includes(song._id) 
                          ? 'text-accent-bemusic bg-bemusic-primary/50' 
                          : 'text-bemusic-tertiary bg-bemusic-primary/50 hover:text-bemusic-primary'
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
                      className="absolute top-2 left-2 p-2 rounded-full text-bemusic-tertiary bg-bemusic-primary/50 hover:text-bemusic-primary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-accent-bemusic transition-colors text-bemusic-primary">
                    {song.title}
                  </h3>
                  <p className="text-xs text-bemusic-tertiary truncate">
                    {song.artist}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section Artistes populaires */}
        <section>
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-bold">Artistes populaires</h2>
            <button className="text-sm text-bemusic-tertiary hover:text-bemusic-primary transition-colors flex items-center">
              Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          {popularArtists.length > 0 ? (
            <div className="flex space-x-4 lg:space-x-6 overflow-x-auto pb-4 scrollbar-hide">
              {popularArtists.map((artist) => (
                <div key={artist._id || artist.id} className="flex-shrink-0 text-center group">
                  <div className="relative mb-3">
                    <div 
                      className="w-24 h-24 lg:w-32 lg:h-32 bg-bemusic-secondary rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => handleArtistClick(artist)}
                    >
                      <img
                        src={artist.profilePicture || artist.avatar || artist.image || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&h=128&fit=crop&crop=face`}
                        alt={artist.username || artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Bouton play */}
                    <button 
                      onClick={() => handlePlayArtist(artist)}
                      className="absolute bottom-0 right-0 w-8 h-8 lg:w-10 lg:h-10 bg-accent-bemusic rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                    >
                      <Play className="h-4 w-4 lg:h-5 lg:w-5 text-white ml-0.5 lg:ml-1" />
                    </button>
                  </div>
                  <h3 
                    className="font-semibold text-sm group-hover:text-accent-bemusic transition-colors cursor-pointer truncate max-w-24 lg:max-w-32"
                    onClick={() => handleArtistClick(artist)}
                  >
                    {artist.username || artist.name}
                  </h3>
                  <p className="text-xs text-bemusic-tertiary">Artiste</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-bemusic-tertiary">Aucun artiste populaire disponible pour le moment</p>
            </div>
          )}
        </section>

        {/* Section Albums récents */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-bemusic-primary">Albums et singles populaires</h2>
            <button className="text-sm text-bemusic-tertiary hover:text-bemusic-primary transition-colors flex items-center">
              Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {recentAlbums.map((album) => (
              <div key={album.id} className="group cursor-pointer">
                <div className="relative mb-3">
                  <div className="aspect-square bg-bemusic-tertiary/20 rounded-lg overflow-hidden border border-bemusic-tertiary/30">
                    <img
                      src={album.coverUrl}
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  {/* Bouton play */}
                  <button 
                    onClick={() => handlePlayAlbum(album)}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-accent-bemusic rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-accent-bemusic/80 shadow-lg"
                  >
                    <Play className="h-6 w-6 text-bemusic-primary ml-1" />
                  </button>
                </div>
                
                <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-accent-bemusic transition-colors text-bemusic-primary">
                  {album.name}
                </h3>
                <p className="text-xs text-bemusic-tertiary truncate">
                  {album.artist}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section Playlists recommandées */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-bemusic-primary">Playlists recommandées</h2>
            <button className="text-sm text-bemusic-tertiary hover:text-bemusic-primary transition-colors flex items-center">
              Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          {playlists.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {playlists.map((playlist) => (
                <div key={playlist._id || playlist.id} className="group cursor-pointer">
                  <div className="relative mb-3">
                    <div className="aspect-square bg-bemusic-tertiary/20 rounded-lg overflow-hidden border border-bemusic-tertiary/30">
                      <img
                        src={playlist.coverUrl || playlist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    {/* Bouton play */}
                    <button 
                      onClick={() => handlePlayPlaylist(playlist)}
                      className="absolute bottom-2 right-2 w-12 h-12 bg-accent-bemusic rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-accent-bemusic/80 shadow-lg"
                    >
                      <Play className="h-6 w-6 text-bemusic-primary ml-1" />
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-accent-bemusic transition-colors text-bemusic-primary">
                    {playlist.name}
                  </h3>
                  <p className="text-xs text-bemusic-tertiary truncate">
                    {playlist.description || 'Playlist personnalisée'}
                  </p>
                  {playlist.songCount && (
                    <p className="text-xs text-bemusic-tertiary/70 mt-1">
                      {playlist.songCount} chansons
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-bemusic-tertiary">Aucune playlist recommandée disponible pour le moment</p>
            </div>
          )}
        </section>

        {/* Section Summer Season */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-bemusic-primary">Summer season</h2>
            <button className="text-sm text-bemusic-tertiary hover:text-bemusic-primary transition-colors flex items-center">
              Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {recentAlbums.slice(0, 6).map((album, index) => (
              <div key={`summer-${album.id}`} className="group cursor-pointer">
                <div className="relative mb-3">
                  <div className="aspect-square bg-bemusic-tertiary/20 rounded-lg overflow-hidden border border-bemusic-tertiary/30">
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
                    className="absolute bottom-2 right-2 w-12 h-12 bg-accent-bemusic rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-accent-bemusic/80 shadow-lg"
                  >
                    <Play className="h-6 w-6 text-bemusic-primary ml-1" />
                  </button>
                </div>
                
                <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-accent-bemusic transition-colors text-bemusic-primary">
                  {album.name}
                </h3>
                <p className="text-xs text-bemusic-tertiary truncate">
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