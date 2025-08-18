import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Play, 
  Heart, 
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Music2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useMusic } from '../../store/MusicContext';
import spotifyService from '../../services/spotifyService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SpotifyHome = () => {
  const { user } = useAuth();
  const { playTrack, addToQueue, toggleLike, likedTracks } = useMusic();
  const navigate = useNavigate();
  
  const [currentFilter, setCurrentFilter] = useState('Tout');
  const [trendingSongs, setTrendingSongs] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSpotifyData();
  }, []);

  const loadSpotifyData = async () => {
    setIsLoading(true);
    try {
      // Charger les nouvelles sorties Spotify
      const newReleasesResult = await spotifyService.getNewReleases({ limit: 20 });
      if (newReleasesResult.success) {
        setNewReleases(newReleasesResult.data.albums?.items || []);
      }

      // Charger les playlists en vedette
      const featuredResult = await spotifyService.getFeaturedPlaylists({ limit: 10 });
      if (featuredResult.success) {
        setFeaturedPlaylists(featuredResult.data.playlists?.items || []);
      }

      // Charger les recommandations personnalisées
      const recommendationsResult = await spotifyService.getRecommendations(
        [], // seed artists
        ['pop', 'rock', 'hip-hop'], // seed genres
        [], // seed tracks
        20
      );
      if (recommendationsResult.success) {
        setTrendingSongs(recommendationsResult.data.tracks || []);
      }

    } catch (error) {
      console.error('Erreur lors du chargement des données Spotify:', error);
      toast.error('Erreur lors du chargement des données Spotify');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaySong = (song) => {
    const spotifySong = {
      _id: song.id,
      title: song.name,
      artist: song.artists?.[0]?.name || 'Artiste inconnu',
      cover: song.album?.images?.[0]?.url,
      audioUrl: song.preview_url,
      duration: song.duration_ms,
      album: song.album?.name,
      spotifyId: song.id,
      isSpotify: true
    };
    
    playTrack(spotifySong);
    toast.success(`Lecture de ${song.name}`);
  };

  const handleAddToQueue = (song) => {
    const spotifySong = {
      _id: song.id,
      title: song.name,
      artist: song.artists?.[0]?.name || 'Artiste inconnu',
      cover: song.album?.images?.[0]?.url,
      audioUrl: song.preview_url,
      duration: song.duration_ms,
      album: song.album?.name,
      spotifyId: song.id,
      isSpotify: true
    };
    
    addToQueue(spotifySong);
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
          <p className="text-white">Chargement de votre musique Spotify...</p>
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
                  <TrendingUp className="h-5 w-5" />
                </button>
                <button className="p-2 rounded-full bg-bemusic-secondary hover:bg-bemusic-tertiary transition-colors">
                  <Clock className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-bemusic-tertiary" />
                <input
                  type="text"
                  placeholder="Rechercher sur Spotify..."
                  className="w-full bg-bemusic-secondary text-bemusic-primary placeholder-bemusic-tertiary rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-bemusic"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-bemusic-secondary hover:bg-bemusic-tertiary transition-colors">
                <Music2 className="h-5 w-5" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-accent-bemusic to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">{user?.username?.charAt(0) || 'U'}</span>
              </div>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex space-x-4 mt-4 overflow-x-auto pb-2">
            {['Tout', 'Musique', 'Podcasts', 'Spotify'].map((filter) => (
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
            Bonjour, {user?.username || 'Utilisateur'} 🎵
          </h1>
          <p className="text-bemusic-tertiary">Découvrez la musique qui vous correspond sur Spotify</p>
        </section>

        {/* Section Recommandations Spotify */}
        {trendingSongs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-bemusic-primary">Recommandations Spotify</h2>
              <button className="text-sm text-bemusic-tertiary hover:text-bemusic-primary transition-colors flex items-center">
                Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {trendingSongs.slice(0, 10).map((song) => (
                <div key={song.id} className="group bg-bemusic-secondary p-4 rounded-lg hover:bg-bemusic-tertiary/20 transition-all duration-200 cursor-pointer border border-bemusic-tertiary/20">
                  <div className="relative mb-4">
                    <div className="aspect-square bg-bemusic-tertiary/20 rounded-lg overflow-hidden">
                      <img
                        src={song.album?.images?.[0]?.url || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                        alt={song.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    {/* Bouton play */}
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
                        handleToggleLike(song.id);
                      }}
                      className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                        likedTracks.includes(song.id) 
                          ? 'text-accent-bemusic bg-bemusic-primary/50' 
                          : 'text-bemusic-tertiary bg-bemusic-primary/50 hover:text-bemusic-primary'
                      }`}
                    >
                      <Heart className="h-4 w-4" fill={likedTracks.includes(song.id) ? 'currentColor' : 'none'} />
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
                    {song.name}
                  </h3>
                  <p className="text-xs text-bemusic-tertiary truncate">
                    {song.artists?.[0]?.name || 'Artiste inconnu'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section Nouvelles sorties */}
        {newReleases.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-bemusic-primary">Nouvelles sorties</h2>
              <button className="text-sm text-bemusic-tertiary hover:text-bemusic-primary transition-colors flex items-center">
                Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {newReleases.map((album) => (
                <div key={album.id} className="group cursor-pointer">
                  <div className="relative mb-3">
                    <div className="aspect-square bg-bemusic-tertiary/20 rounded-lg overflow-hidden border border-bemusic-tertiary/30">
                      <img
                        src={album.images?.[0]?.url || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                        alt={album.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    {/* Bouton play */}
                    <button 
                      onClick={() => handlePlaySong(album)}
                      className="absolute bottom-2 right-2 w-12 h-12 bg-accent-bemusic rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-accent-bemusic/80 shadow-lg"
                    >
                      <Play className="h-6 w-6 text-bemusic-primary ml-1" />
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-accent-bemusic transition-colors text-bemusic-primary">
                    {album.name}
                  </h3>
                  <p className="text-xs text-bemusic-tertiary truncate">
                    {album.artists?.[0]?.name || 'Artiste inconnu'}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section Playlists en vedette */}
        {featuredPlaylists.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-bemusic-primary">Playlists en vedette</h2>
              <button className="text-sm text-bemusic-tertiary hover:text-bemusic-primary transition-colors flex items-center">
                Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {featuredPlaylists.map((playlist) => (
                <div key={playlist.id} className="group cursor-pointer">
                  <div className="relative mb-3">
                    <div className="aspect-square bg-bemusic-tertiary/20 rounded-lg overflow-hidden border border-bemusic-tertiary/30">
                      <img
                        src={playlist.images?.[0]?.url || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    
                    {/* Bouton play */}
                    <button 
                      onClick={() => handlePlaySong(playlist)}
                      className="absolute bottom-2 right-2 w-12 h-12 bg-accent-bemusic rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-accent-bemusic/80 shadow-lg"
                    >
                      <Play className="h-6 w-6 text-bemusic-primary ml-1" />
                    </button>
                  </div>
                  
                  <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-accent-bemusic transition-colors text-bemusic-primary">
                    {playlist.name}
                  </h3>
                  <p className="text-xs text-bemusic-tertiary truncate">
                    {playlist.description || 'Playlist Spotify'}
                  </p>
                  {playlist.tracks?.total && (
                    <p className="text-xs text-bemusic-tertiary/70 mt-1">
                      {playlist.tracks.total} chansons
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Message si pas de données */}
        {trendingSongs.length === 0 && newReleases.length === 0 && featuredPlaylists.length === 0 && (
          <section className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Music2 className="h-16 w-16 text-bemusic-tertiary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-bemusic-primary mb-2">
                Aucune musique disponible
              </h3>
              <p className="text-bemusic-tertiary mb-6">
                Connectez-vous à Spotify pour découvrir de la musique personnalisée
              </p>
              <button 
                onClick={() => navigate('/spotify-login')}
                className="bg-accent-bemusic text-white px-6 py-3 rounded-full font-medium hover:bg-accent-bemusic/80 transition-colors"
              >
                Se connecter à Spotify
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SpotifyHome;
