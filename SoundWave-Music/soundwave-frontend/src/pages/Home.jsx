import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Play, 
  Heart, 
  Plus,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Clock,
  Music2,
  Radio,
  Mic,
  Headphones
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useMusic } from '../store/MusicContext';
import { useSidebar } from '../store/SidebarContext';
import { useNavigate } from 'react-router-dom';
import { songService } from '../services/songService';
import { albumService } from '../services/albumService';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const { playTrack, playAlbum, playPlaylist, addToQueue, toggleLike, likedTracks } = useMusic();
  const { isSidebarOpen } = useSidebar();
  const navigate = useNavigate();
  
  const [currentFilter, setCurrentFilter] = useState('Tout');
  
  // Données des créations des artistes
  const [popularArtists, setPopularArtists] = useState([]);
  const [popularAlbums, setPopularAlbums] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [likedAlbums, setLikedAlbums] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refs pour le défilement horizontal
  const radioScrollRef = useRef(null);
  const artistsScrollRef = useRef(null);
  const albumsScrollRef = useRef(null);
  const newReleasesScrollRef = useRef(null);

  useEffect(() => {
    console.log('🏠 Home - État de la sidebar:', isSidebarOpen);
    loadHomeData();
  }, [isSidebarOpen]);

  // Charger les albums likés
  useEffect(() => {
    const loadLikedAlbums = () => {
      try {
        const likedAlbumsFromStorage = JSON.parse(localStorage.getItem('likedAlbums') || '[]');
        setLikedAlbums(likedAlbumsFromStorage);
        console.log('💿 Loaded liked albums:', likedAlbumsFromStorage);
      } catch (error) {
        console.error('Error loading liked albums:', error);
        setLikedAlbums([]);
      }
    };
    
    loadLikedAlbums();
  }, []);

  // Charger les données de la page d'accueil
  const loadHomeData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [songsResponse, albumsResponse, trendingResponse] = await Promise.all([
        songService.getAllSongs({ limit: 20, sortBy: 'createdAt', sortOrder: 'desc' }),
        albumService.getAllAlbums({ limit: 20, sortBy: 'createdAt', sortOrder: 'desc' }),
        songService.getTrendingSongs({ limit: 10 })
      ]);

      // Organiser les données pour l'affichage
      const songs = songsResponse.data || [];
      const albums = albumsResponse.data || [];
      const trendingSongs = trendingResponse.data || [];

      // Extraire les artistes uniques des chansons avec leurs tracks
      const artistsMap = new Map();
      songs.forEach(song => {
        console.log('🎵 Song data:', { title: song.title, artist: song.artist });
        if (song.artist && song.artist._id) {
          const artistId = song.artist._id;
          if (!artistsMap.has(artistId)) {
            artistsMap.set(artistId, {
              id: artistId,
              _id: artistId,
              name: song.artist.username || song.artist.name,
              picture: song.artist.profilePicture ? `http://localhost:5000${song.artist.profilePicture}` : song.artist.avatar,
              cover: song.coverImage ? `http://localhost:5000${song.coverImage}` : (song.album?.coverImage ? `http://localhost:5000${song.album.coverImage}` : null),
              tracks: [] // Initialiser avec un tableau vide
            });
          }
          // Ajouter la chanson aux tracks de l'artiste
          const artist = artistsMap.get(artistId);
          // Utiliser le nom de l'artiste du Map plutôt que de la chanson
          const trackArtist = artist.name || 'Artiste inconnu';
          console.log('🎵 Track artist:', trackArtist, 'from artist.name:', artist.name, 'song.artist:', song.artist);
          artist.tracks.push({
            _id: song._id,
            title: song.title,
            artist: trackArtist,
            audioUrl: song.audioUrl ? `http://localhost:5000${song.audioUrl}` : null,
            cover: song.coverImage ? `http://localhost:5000${song.coverImage}` : artist.cover,
            duration: song.duration || 180
          });
        }
      });

      setPopularArtists(Array.from(artistsMap.values()));
      setPopularAlbums(albums.map(album => ({
        id: album._id,
        _id: album._id,
        title: album.title,
        name: album.title,
        cover: album.coverImage ? `http://localhost:5000${album.coverImage}` : null,
        picture: album.coverImage ? `http://localhost:5000${album.coverImage}` : null,
        artist: {
          name: album.artist?.username || album.artist?.name || 'Artiste inconnu'
        },
        tracks: album.songs || [] // Ajouter les tracks de l'album
      })));
      setNewReleases(songs.slice(0, 10).map(song => ({
        id: song._id,
        _id: song._id,
        title: song.title,
        name: song.title,
        cover: song.coverImage ? `http://localhost:5000${song.coverImage}` : null,
        picture: song.coverImage ? `http://localhost:5000${song.coverImage}` : null,
        artist: {
          name: song.artist?.username || song.artist?.name || 'Artiste inconnu'
        },
        audioUrl: song.audioUrl ? `http://localhost:5000${song.audioUrl}` : null,
        duration: song.duration || 180
      })));
      setFeaturedPlaylists(trendingSongs.map(song => ({
        id: song._id,
        _id: song._id,
        title: song.title,
        name: song.title,
        cover: song.coverImage ? `http://localhost:5000${song.coverImage}` : null,
        picture: song.coverImage ? `http://localhost:5000${song.coverImage}` : null,
        audioUrl: song.audioUrl ? `http://localhost:5000${song.audioUrl}` : null,
        duration: song.duration || 180,
        artist: {
          name: song.artist?.username || song.artist?.name || 'Artiste inconnu'
        }
      })));

    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      
      // Gestion spécifique des erreurs de connexion
      if (err.message?.includes('timeout') || err.message?.includes('ECONNABORTED')) {
        setError('Le serveur backend ne répond pas. Veuillez démarrer le backend avec: cd soundwave-backend && npm run dev');
      } else if (err.message?.includes('ERR_NETWORK') || err.message?.includes('ECONNREFUSED')) {
        setError('Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur le port 5000.');
      } else {
        setError('Erreur lors du chargement des données. Vérifiez la connexion au serveur.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonctions de défilement
  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handlePlaySong = (item) => {
    // Fonction pour construire l'URL correcte
    const buildAudioUrl = (audioUrl) => {
      if (!audioUrl) return null;
      // Si l'URL commence déjà par http, la retourner telle quelle
      if (audioUrl.startsWith('http')) return audioUrl;
      // Sinon, ajouter le baseUrl seulement si nécessaire
      const baseUrl = 'http://localhost:5000';
      return audioUrl.startsWith('/') ? `${baseUrl}${audioUrl}` : `${baseUrl}/${audioUrl}`;
    };

    // Vérifier si c'est un album (a des tracks)
    if (item.tracks && item.tracks.length > 0) {
      // C'est un album - utiliser playAlbum
      const albumWithTracks = {
        ...item,
        tracks: item.tracks.map(track => ({
          ...track,
          audioUrl: buildAudioUrl(track.audioUrl),
          cover: track.cover || track.coverImage || item.cover || item.coverImage,
          artist: track.artist?.name || track.artist?.username || item.artist?.name || item.artist?.username || 'Artiste inconnu'
        }))
      };
      playAlbum(albumWithTracks);
      toast.success(`Lecture de l'album ${item.title || item.name}`);
      return;
    }
    
    // Vérifier si c'est une playlist (a des tracks)
    if (item.tracks && Array.isArray(item.tracks)) {
      // C'est une playlist - utiliser playPlaylist
      const playlistWithTracks = {
        ...item,
        tracks: item.tracks.map(track => ({
          ...track,
          audioUrl: buildAudioUrl(track.audioUrl),
          cover: track.cover || track.coverImage || item.cover || item.coverImage,
          artist: track.artist?.name || track.artist?.username || item.artist?.name || item.artist?.username || 'Artiste inconnu'
        }))
      };
      playPlaylist(playlistWithTracks);
      toast.success(`Lecture de la playlist ${item.title || item.name}`);
      return;
    }
    
    // Sinon, c'est une chanson individuelle
    const localSong = {
      _id: item.id || item._id,
      title: item.title || item.name,
      artist: item.artist?.name || item.artist?.username || 'Artiste inconnu',
      cover: item.cover || item.coverImage || item.picture,
      audioUrl: buildAudioUrl(item.audioUrl),
      duration: item.duration || item.duration_ms,
      album: item.album?.title || item.album?.name,
      isLocal: true
    };
    
    playTrack(localSong);
    toast.success(`Lecture de ${localSong.title}`);
  };

  const handleArtistClick = (artist) => {
    navigate(`/artist/${artist.id}`);
  };

  const handleAlbumClick = (album) => {
    const albumId = album._id || album.id;
    console.log('💿 Album clicked:', { album, albumId });
    navigate(`/album/${albumId}`);
  };

  const handleAddToQueue = (song) => {
    // Fonction pour construire l'URL correcte
    const buildAudioUrl = (audioUrl) => {
      if (!audioUrl) return null;
      // Si l'URL commence déjà par http, la retourner telle quelle
      if (audioUrl.startsWith('http')) return audioUrl;
      // Sinon, ajouter le baseUrl seulement si nécessaire
      const baseUrl = 'http://localhost:5000';
      return audioUrl.startsWith('/') ? `${baseUrl}${audioUrl}` : `${baseUrl}/${audioUrl}`;
    };

    const localSong = {
      _id: song.id || song._id,
      title: song.title || song.name,
      artist: song.artist?.name || song.artist?.username || 'Artiste inconnu',
      cover: song.cover || song.coverImage || song.picture,
      audioUrl: buildAudioUrl(song.audioUrl),
      duration: song.duration || song.duration_ms,
      album: song.album?.title || song.album?.name,
      isLocal: true
    };
    
    addToQueue(localSong);
    toast.success('Ajouté à la file d\'attente');
  };

  const handleToggleLike = async (song) => {
    try {
      const songId = song._id || song.id;
      const wasLiked = likedTracks.includes(songId);
      
      console.log('🎵 handleToggleLike called:', { song, songId, wasLiked, currentLikedTracks: likedTracks });
      
      await toggleLike(song);
      
      // Afficher le message immédiatement basé sur l'état précédent
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

  const handleToggleAlbumLike = async (album) => {
    try {
      const albumId = album._id || album.id;
      console.log('💿 handleToggleAlbumLike called:', { album, albumId });
      
      const response = await albumService.likeAlbum(albumId);
      
      if (response.success) {
        const wasLiked = response.data.isLiked;
        
        // Mettre à jour l'état local
        if (wasLiked) {
          const newLikedAlbums = [...likedAlbums, albumId];
          setLikedAlbums(newLikedAlbums);
          localStorage.setItem('likedAlbums', JSON.stringify(newLikedAlbums));
          toast.success('Album ajouté aux favoris');
        } else {
          const newLikedAlbums = likedAlbums.filter(id => id !== albumId);
          setLikedAlbums(newLikedAlbums);
          localStorage.setItem('likedAlbums', JSON.stringify(newLikedAlbums));
          toast.success('Album retiré des favoris');
        }
      } else {
        toast.error(response.error || 'Erreur lors de la mise à jour des favoris');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris de l\'album:', error);
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Chargement de votre musique...</p>
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
          <h2 className="text-2xl font-bold text-white mb-4">Erreur de connexion</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={loadHomeData}
              className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-lg font-medium transition-colors mr-3"
            >
              Réessayer
            </button>
            <div className="text-sm text-gray-400 mt-4">
              <p>💡 <strong>Solution rapide :</strong></p>
              <p>1. Ouvrir un terminal</p>
              <p>2. Aller dans le dossier soundwave-backend</p>
              <p>3. Exécuter : npm run dev</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white overflow-x-hidden transition-all duration-300 ${
      isSidebarOpen ? '' : 'lg:ml-0'
    }`}>
      {/* Header avec recherche - Design Spotify */}
      <div className="">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/search?q=trending')}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors group"
                title="Tendances"
              >
                <TrendingUp className="h-5 w-5 text-gray-300 group-hover:text-white" />
              </button>
              <button 
                onClick={() => navigate('/library?tab=recent')}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors group"
                title="Récents"
              >
                <Clock className="h-5 w-5 text-gray-300 group-hover:text-white" />
              </button>
            </div>
            
            {/* Barre de recherche supprimée - maintenant seulement dans le header principal */}
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/new-releases')}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors group"
                title="Nouveautés"
              >
                <Music2 className="h-5 w-5 text-gray-300 group-hover:text-white" />
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                title="Profil"
              >
                <span className="text-sm font-bold text-white">{user?.username?.charAt(0) || 'U'}</span>
              </button>
            </div>
          </div>

          {/* Filtres - Style Spotify */}
          <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
            {['Tout', 'Musique', 'Podcasts'].map((filter) => (
              <button
                key={filter}
                onClick={() => setCurrentFilter(filter)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  currentFilter === filter
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal - Design Spotify */}
      <div className="space-y-10 pb-32" style={{ margin: 0, padding: 0, marginLeft: 0, marginRight: 0 }}>
        {/* Section Bienvenue - Style Spotify */}
        <section className="pt-8">
          <div className="px-6">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Bonjour, {user?.username || 'Utilisateur'} 🎵
            </h1>
            <p className="text-gray-400 text-xl">Découvrez la musique qui vous correspond sur SoundWave</p>
          </div>
        </section>

        {/* Section Radio populaire avec flèches - Design Spotify */}
        <section>
          <div className="px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center">
                <Radio className="h-7 w-7 mr-3 text-green-500" />
                Radio populaire
              </h2>
              <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center hover:underline">
                Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            {/* Flèche gauche - Visible au survol */}
            <button 
              onClick={() => scrollLeft(radioScrollRef)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            
            {/* Flèche droite - Visible au survol */}
            <button 
              onClick={() => scrollRight(radioScrollRef)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
            >
              <ArrowRight className="h-6 w-6 text-white" />
            </button>
            
            {/* Grille des radios avec défilement horizontal */}
            <div 
              ref={radioScrollRef}
              className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {popularArtists.slice(0, 8).map((artist) => (
                <div 
                  key={artist.id} 
                  className="group cursor-pointer text-center flex-shrink-0 w-40 hover:bg-gray-800 rounded-lg p-4 transition-all duration-300 overflow-hidden"
                  onClick={() => handleArtistClick(artist)}
                >
                  <div className="relative mb-4 flex justify-center">
                    <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25 flex items-center justify-center">
                      <img
                        src={artist.picture || artist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                        alt={artist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Bouton play - Style Spotify */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySong(artist);
                      }}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl transform translate-y-2 group-hover:translate-y-0"
                    >
                      <Play className="h-5 w-5 text-black ml-0.5" />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-base mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">
                    Artiste
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Artistes populaires avec flèches - Design Spotify */}
        {popularArtists.length > 0 && (
          <section>
            <div className="px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Mic className="h-7 w-7 mr-3 text-green-500" />
                  Artistes populaires
                </h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center hover:underline">
                  Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              {/* Flèche gauche - Visible au survol */}
              <button 
                onClick={() => scrollLeft(artistsScrollRef)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              
              {/* Flèche droite - Visible au survol */}
              <button 
                onClick={() => scrollRight(artistsScrollRef)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </button>
              
              {/* Grille des artistes avec défilement horizontal */}
              <div 
                ref={artistsScrollRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {popularArtists.map((artist) => (
                  <div 
                    key={artist.id} 
                    className="group cursor-pointer text-center flex-shrink-0 w-40 hover:bg-gray-800 rounded-lg p-4 transition-all duration-300 overflow-hidden"
                    onClick={() => handleArtistClick(artist)}
                  >
                    <div className="relative mb-4 flex justify-center">
                      <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25 flex items-center justify-center">
                        <img
                          src={artist.picture || artist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                          alt={artist.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay sombre au hover pour meilleur contraste */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                      </div>
                      
                      {/* Bouton play - Style Spotify exact */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySong(artist);
                        }}
                        className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl transform translate-y-2 group-hover:translate-y-0"
                      >
                        <Play className="h-5 w-5 text-black ml-0.5" />
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-base mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">
                      Artiste
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section Albums et singles populaires avec flèches - Design Spotify */}
        {popularAlbums.length > 0 && (
          <section>
            <div className="px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Headphones className="h-7 w-7 mr-3 text-green-500" />
                  Albums et singles populaires
                </h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center hover:underline">
                  Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              {/* Flèche gauche - Visible au survol */}
              <button 
                onClick={() => scrollLeft(albumsScrollRef)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              
              {/* Flèche droite - Visible au survol */}
              <button 
                onClick={() => scrollRight(albumsScrollRef)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </button>
              
              {/* Grille des albums avec défilement horizontal */}
              <div 
                ref={albumsScrollRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {popularAlbums.map((album) => (
                  <div 
                    key={album.id} 
                    className="group cursor-pointer flex-shrink-0 w-40 hover:bg-gray-800/60 p-4 transition-all duration-300 overflow-hidden"
                    onClick={() => handleAlbumClick(album)}
                  >
                    <div className="relative mb-4 flex justify-center">
                      <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 flex items-center justify-center">
                        <img
                          src={album.cover || album.picture || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                          alt={album.title || album.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Overlay sombre au hover pour meilleur contraste */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>
                      </div>
                      
                      {/* Boutons d'action - Style Spotify exact */}
                      <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAlbumLike(album);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl ${
                            likedAlbums.includes(album._id || album.id) 
                              ? 'bg-green-500 text-white' 
                              : 'bg-black/80 text-white hover:bg-gray-700'
                          }`}
                        >
                          <Heart className="h-4 w-4" fill={likedAlbums.includes(album._id || album.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaySong(album);
                          }}
                          className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 hover:bg-green-400 shadow-2xl"
                        >
                          <Play className="h-4 w-4 text-black" style={{ marginLeft: '1px' }} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-base mb-1 truncate group-hover:text-white transition-colors text-white">
                      {album.title || album.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors">
                      {album.artist?.name || 'Artiste inconnu'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section Summer season avec flèches - Design Spotify */}
        {newReleases.length > 0 && (
          <section>
            <div className="px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Summer season</h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center hover:underline">
                  Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              {/* Flèche gauche - Visible au survol */}
              <button 
                onClick={() => scrollLeft(newReleasesScrollRef)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              
              {/* Flèche droite - Visible au survol */}
              <button 
                onClick={() => scrollRight(newReleasesScrollRef)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </button>
              
              {/* Grille des nouvelles sorties avec défilement horizontal */}
              <div 
                ref={newReleasesScrollRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {newReleases.map((release) => (
                  <div 
                    key={release.id} 
                    className="group cursor-pointer flex-shrink-0 w-40 hover:bg-gray-800 p-4 transition-all duration-300 overflow-hidden"
                    onClick={() => handleAlbumClick(release)}
                  >
                    <div className="relative mb-4 flex justify-center">
                      <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden border-2 border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25 flex items-center justify-center">
                        <img
                          src={release.cover || release.picture || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                          alt={release.title || release.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay sombre au hover pour meilleur contraste */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                      </div>
                      
                      {/* Boutons d'action - Style Spotify exact */}
                      <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleLike(release);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl ${
                            likedTracks.includes(release._id || release.id) 
                              ? 'bg-green-500 text-white' 
                              : 'bg-black/80 text-white hover:bg-gray-700'
                          }`}
                        >
                          <Heart className="h-4 w-4" fill={likedTracks.includes(release._id || release.id) ? 'currentColor' : 'none'} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlaySong(release);
                          }}
                          className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 hover:bg-green-400 shadow-2xl"
                        >
                          <Play className="h-4 w-4 text-black" style={{ marginLeft: '1px' }} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-base mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                      {release.title || release.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {release.artist?.name || 'Artiste inconnu'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section Playlists en vedette avec flèches - Design Spotify */}
        {featuredPlaylists.length > 0 && (
          <section>
            <div className="px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Music2 className="h-7 w-7 mr-3 text-green-500" />
                  Playlists en vedette
                </h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center hover:underline">
                  Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              {/* Flèche gauche - Visible au survol */}
              <button 
                onClick={() => scrollLeft(albumsScrollRef)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              
              {/* Flèche droite - Visible au survol */}
              <button 
                onClick={() => scrollRight(albumsScrollRef)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </button>
              
              {/* Grille des playlists avec défilement horizontal */}
              <div 
                ref={albumsScrollRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {featuredPlaylists.map((playlist) => (
                  <div key={playlist.id} className="group cursor-pointer flex-shrink-0 w-40 hover:bg-gray-800 p-4 transition-all duration-300 overflow-hidden">
                    <div className="relative mb-4 flex justify-center">
                      <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden border-2 border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25 flex items-center justify-center">
                        <img
                          src={playlist.picture || playlist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                          alt={playlist.title || playlist.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Overlay sombre au hover pour meilleur contraste */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                      </div>
                      
                      {/* Bouton play - Style Spotify exact */}
                      <button 
                        onClick={() => handlePlaySong(playlist)}
                        className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl transform translate-y-2 group-hover:translate-y-0"
                      >
                        <Play className="h-4 w-4 text-black" style={{ marginLeft: '1px' }} />
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-base mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                      {playlist.title || playlist.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      Playlist
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Message si pas de données */}
        {newReleases.length === 0 && popularArtists.length === 0 && featuredPlaylists.length === 0 && (
          <section className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Music2 className="h-16 w-16 text-bemusic-tertiary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-bemusic-primary mb-2">
                Aucune musique disponible
              </h3>
              <p className="text-bemusic-tertiary mb-6">
                Ajoutez des artistes et des sorties internes pour commencer
              </p>
              <button 
                onClick={() => navigate('/create')}
                className="bg-accent-bemusic text-white px-6 py-3 rounded-full font-medium hover:bg-accent-bemusic/80 transition-colors"
              >
                Ajouter du contenu
              </button>
            </div>
          </section>
        )}
      </div>

      {/* CSS pour masquer la scrollbar */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Barre de lecture de musique fixe - Design Spotify */}
      <div className={`fixed hidden bottom-0 bg-black border-t border-gray-800 z-[9999] transition-all  duration-300 ${
        isSidebarOpen ? 'left-64 right-0' : 'left-0 right-0'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between ">
            {/* Informations de la piste actuelle */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
                <Music2 className="h-7 w-7 text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  Aucune piste sélectionnée
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Sélectionnez une musique pour commencer
                </p>
              </div>
            </div>

            {/* Contrôles de lecture centrés - Style Spotify */}
            <div className="flex items-center space-x-6">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4L12 12.6l3.3-3.3z"/>
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </button>
              <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-2xl">
                <Play className="h-4 w-4 text-black" style={{ marginLeft: '1px' }} />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 3.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 9H9a5 5 0 00-5 5v2a1 1 0 11-2 0v-2a7 7 0 017-7h5.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            {/* Barre de progression et contrôles supplémentaires - Style Spotify */}
            <div className="flex items-center space-x-6 flex-1 justify-end">
              {/* Barre de progression */}
              <div className="flex items-center space-x-3 min-w-0 flex-1 max-w-xs">
                <span className="text-xs text-gray-400 font-medium">0:00</span>
                <div className="flex-1 bg-gray-700 rounded-full h-1">
                  <div className="bg-white h-1 rounded-full w-0"></div>
                </div>
                <span className="text-xs text-gray-400 font-medium">0:00</span>
              </div>

              {/* Contrôles supplémentaires */}
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.76L4.67 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.67l3.713-2.76a1 1 0 011.383.036zM12.293 7.293a1 1 0 011.414 0L16 10.586l2.293-2.293a1 1 0 111.414 1.414L17.414 12l2.293 2.293a1 1 0 01-1.414 1.414L16 13.414l-2.293 2.293a1 1 0 01-1.414-1.414L14.586 12l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L13.586 13H12z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 