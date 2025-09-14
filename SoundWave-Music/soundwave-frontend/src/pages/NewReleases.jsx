import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Heart, 
  Plus,
  ArrowLeft,
  Search,
  Home,
  Library,
  Settings,
  User,
  Globe,
  MessageSquare,
  Crown,
  Music2,
  Calendar,
  TrendingUp,
  Bell,
  Mic,
  Headphones,
  MoreHorizontal
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useMusic } from '../store/MusicContext';
import { songService } from '../services/songService';
import { artistService } from '../services/artistService';
import toast from 'react-hot-toast';
// import { useDeezer } from '../store/DeezerContext'; // removed

const NewReleases = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { playTrack, addToQueue, toggleLike, likedTracks } = useMusic();
  // const { getNewReleases, loading, error } = useDeezer(); // removed
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('music');
  const [newReleases, setNewReleases] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);
  const [followedArtistsSongs, setFollowedArtistsSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    fetchNewReleases();
    loadFollowedArtistsSongs();
  }, []);

  // Charger les artistes المتابعين والأغاني الجديدة
  const loadFollowedArtistsSongs = async () => {
    try {
      console.log('🎵 Loading followed artists songs...');
      
      // الحصول على الفنانين المتابعين
      const followedResponse = await artistService.getFollowedArtists();
      console.log('🎤 Followed artists response:', followedResponse);
      
      if (followedResponse.success && followedResponse.data) {
        const artists = followedResponse.data;
        setFollowedArtists(artists);
        console.log('🎤 Followed artists:', artists);
        
        // الحصول على الأغاني الجديدة من كل فنان
        const allSongs = [];
        for (const artist of artists) {
          try {
            console.log(`🎵 Loading songs for artist: ${artist.name} (${artist._id})`);
            const songsResponse = await songService.getSongsByArtist(artist._id, { 
              limit: 10, 
              sortBy: 'createdAt', 
              sortOrder: 'desc' 
            });
            console.log(`🎵 Songs response for ${artist.name}:`, songsResponse);
            
            if (songsResponse.success && songsResponse.data) {
              console.log('🎵 Songs response data:', songsResponse.data);
              console.log('🎵 Songs response data type:', typeof songsResponse.data);
              console.log('🎵 Is array?', Array.isArray(songsResponse.data));
              
              // التحقق من أن البيانات هي array
              let songsData = [];
              if (Array.isArray(songsResponse.data)) {
                songsData = songsResponse.data;
              } else if (songsResponse.data && Array.isArray(songsResponse.data.data)) {
                // إذا كانت البيانات في songsResponse.data.data
                songsData = songsResponse.data.data;
                console.log('🎵 Found data in songsResponse.data.data');
              } else if (songsResponse.data && songsResponse.data.songs) {
                // إذا كانت البيانات في songsResponse.data.songs
                songsData = songsResponse.data.songs;
                console.log('🎵 Found data in songsResponse.data.songs');
              } else {
                console.log('🎵 No valid array found in response');
                songsData = [];
              }
              
              console.log('🎵 Final songsData:', songsData);
              console.log('🎵 Final songsData length:', songsData.length);
              
              const artistSongs = songsData.map(song => ({
                ...song,
                artistName: artist.username || artist.name,
                artistAvatar: artist.profilePicture ? 
                  `http://localhost:5000${artist.profilePicture}` : 
                  `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&${Math.random()}`
              }));
              allSongs.push(...artistSongs);
              console.log(`🎵 Added ${artistSongs.length} songs for artist ${artist.name}`);
            } else {
              console.log('🎵 No songs data found for artist:', artist.name);
              console.log('🎵 Response success:', songsResponse.success);
              console.log('🎵 Response data:', songsResponse.data);
            }
          } catch (error) {
            console.error(`❌ Error loading songs for artist ${artist.name}:`, error);
            console.error(`❌ Error details:`, {
              message: error.message,
              response: error.response?.data,
              status: error.response?.status
            });
          }
        }
        
        // ترتيب الأغاني حسب التاريخ (الأحدث أولاً)
        allSongs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setFollowedArtistsSongs(allSongs);
        console.log('🎵 Followed artists songs loaded:', allSongs);
      }
    } catch (error) {
      console.error('❌ Error loading followed artists songs:', error);
      toast.error('Erreur lors du chargement des nouveautés des artistes suivis');
    }
  };

  // Remplacer par récupération interne (placeholder pour l'instant)
  const fetchNewReleases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setNewReleases([]);
    } catch (e) {
      setError('Erreur lors du chargement');
      setNewReleases([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer getFallbackData() - plus de données hardcodées

  const handlePlaySong = (song) => {
    console.log('Playing:', song.title);
    playTrack(song);
    toast.success(`Lecture de "${song.title}"`);
  };

  const handleAddToQueue = (song) => {
    console.log('Adding to queue:', song.title);
    addToQueue(song);
    toast.success(`"${song.title}" ajouté à la file d'attente`);
  };

  const handleToggleLike = (song) => {
    console.log('Toggling like for:', song.title);
    toggleLike(song._id);
    toast.success(likedTracks.includes(song._id) ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const handleAddToLibrary = (release) => {
    console.log('Added to library:', release.title || release.name);
    // Ici vous pouvez intégrer votre logique d'ajout à la bibliothèque
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString) return "Date inconnue";
    
    const releaseDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - releaseDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "hier";
    if (diffDays <= 7) return `il y a ${diffDays} jours`;
    if (diffDays <= 30) return `il y a ${Math.ceil(diffDays / 7)} semaines`;
    
    return releaseDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getArtistNames = (artists) => {
    if (Array.isArray(artists)) {
      return artists.map(artist => artist.name).join(', ');
    } else if (artists && artists.name) {
      return artists.name;
    }
    return 'Artiste inconnu';
  };

  const getReleaseTitle = (release) => {
    return release.title || release.name || 'Titre inconnu';
  };

  const getReleaseCover = (release) => {
    if (release.images && release.images[0] && release.images[0].url) {
      return release.images[0].url;
    }
    if (release.cover) {
      return release.cover;
    }
    return 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop';
  };

  const getReleaseType = (release) => {
    if (release.album_type) {
      return release.album_type === 'single' ? 'Single' : 'Album';
    }
    if (release.type) {
      return release.type === 'single' ? 'Single' : 'Album';
    }
    return 'Titre';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des nouveautés...</p>
        </div>
      </div>
    );
  }

  // Si pas de données après le chargement
  if (!newReleases || newReleases.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-black border-b border-gray-800/50 py-4 px-6 sticky top-0 z-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              
              <Link to="/" className="text-2xl font-bold text-white hover:text-green-400 transition-colors">
                SoundWave
              </Link>
            </div>
          </div>
        </header>

        {/* Message d'erreur ou pas de données */}
        <main className="px-6 py-20">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music2 className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Aucune nouveauté trouvée</h2>
            <p className="text-gray-400 mb-6">
              {error ? 
                "Erreur lors du chargement des nouveautés. Veuillez réessayer plus tard." : 
                "Aucune nouvelle sortie disponible pour le moment."
              }
            </p>
            <button 
              onClick={fetchNewReleases}
              className="px-6 py-3 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400 transition-all duration-200 hover:scale-105"
            >
              Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header simplifié comme Spotify */}
      <header className="bg-black border-b border-gray-800/50 py-4 px-6 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          {/* Logo et Navigation */}
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
            
            <Link to="/" className="text-2xl font-bold text-white hover:text-green-400 transition-colors">
              SoundWave
            </Link>
          </div>
          
          {/* User Menu (retained from global Header) */}
          <div className="flex items-center space-x-4">
            <Link to="/subscriptions" className="px-4 py-2 bg-green-500 text-black rounded-full font-semibold hover:scale-105 transition-all duration-200 hover:bg-green-400 text-sm">
              Découverte Premium
            </Link>
            
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 hover:scale-105">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-black">
                    {user?.username?.charAt(0) || 'U'}
                  </span>
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-3">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-gray-700/50">
                    <div className="text-sm font-medium text-white mb-1">
                      {user?.username || 'Utilisateur'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {user?.email || 'email@example.com'}
                    </div>
                  </div>
                  
                  {/* Main Menu Items */}
                  <div className="py-2">
                    <Link to="/profile" className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200 group">
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4" />
                        <span>Profil</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </Link>
                    
                    <Link to="/about" className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200 group">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-4 w-4" />
                        <span>À propos</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </Link>
                    
                    <Link to="/contact" className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200 group">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-4 w-4" />
                        <span>Contact</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </Link>
                    
                    <Link to="/settings" className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200 group">
                      <div className="flex items-center space-x-3">
                        <Settings className="h-4 w-4" />
                        <span>Paramètres</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Premium Section */}
                  <div className="border-t border-gray-700/50 pt-2">
                    <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200 group">
                      <div className="flex items-center space-x-3">
                        <Crown className="h-4 w-4 text-yellow-400" />
                        <span>Passer à Premium</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </button>
                  </div>
                  
                  {/* Logout Section */}
                  <div className="border-t border-gray-700/50 pt-2">
                    <button 
                      onClick={() => { logout(); navigate('/login'); }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200"
                    >
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Design Spotify amélioré */}
      <main className="px-6 py-8">
        {/* Title and Description */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Nouveautés</h1>
          <p className="text-xl text-gray-300">
            Les dernières sorties des artistes, podcasts et émissions auxquels vous êtes abonné.
          </p>
        </div>
        
        {/* Tabs comme Spotify */}
        <div className="border-b border-gray-800 mb-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setSelectedTab('music')}
              className={`pb-4 px-2 font-medium transition-all duration-200 ${
                selectedTab === 'music'
                  ? 'text-white border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Music2 className="h-5 w-5" />
                <span>Musique</span>
              </div>
            </button>
            <button
              onClick={() => setSelectedTab('podcasts')}
              className={`pb-4 px-2 font-medium transition-all duration-200 ${
                selectedTab === 'podcasts'
                  ? 'text-white border-b-2 border-green-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Mic className="h-5 w-5" />
                <span>Podcasts et émissions</span>
              </div>
            </button>
          </div>
        </div>
        
        {/* Section Nouveautés des Artistes Suivis */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Nouveautés des artistes suivis
          </h2>
          
          {followedArtistsSongs.length > 0 ? (
            <div className="space-y-2">
              {followedArtistsSongs.slice(0, 10).map((song) => (
                <div key={song._id} className="group flex items-center space-x-4 p-3 hover:bg-gray-800/60 rounded-lg transition-all duration-200 cursor-pointer">
                  {/* Cover Image */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={song.coverImage ? `http://localhost:5000${song.coverImage}` : song.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'}
                      alt={song.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-lg truncate group-hover:text-green-400 transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      {song.artistName || (song.artist?.username || song.artist?.name) || 'Artiste inconnu'}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                        Single
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatReleaseDate(song.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleLike(song);
                      }}
                      className={`p-2 rounded-full transition-colors ${
                        likedTracks.includes(song._id) 
                          ? 'bg-red-500 hover:bg-red-400' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      title={likedTracks.includes(song._id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <Heart className={`h-4 w-4 ${likedTracks.includes(song._id) ? 'text-white fill-white' : 'text-white'}`} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToQueue(song);
                      }}
                      className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                      title="Ajouter à la file d'attente"
                    >
                      <Plus className="h-4 w-4 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySong(song);
                      }}
                      className="p-2 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
                      title="Écouter"
                    >
                      <Play className="h-4 w-4 text-black ml-0.5" />
                    </button>
                    <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music2 className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Aucune nouveauté des artistes suivis
              </h3>
              <p className="text-gray-500 mb-6">
                Les nouvelles sorties des artistes que vous suivez apparaîtront ici
              </p>
              <button 
                onClick={loadFollowedArtistsSongs}
                className="px-6 py-3 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400 transition-all duration-200 hover:scale-105"
              >
                Actualiser
              </button>
            </div>
          )}
        </section>

        {/* Section Précédemment - Design Spotify amélioré */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Précédemment</h2>
          
          <div className="space-y-2">
            {newReleases.map((release) => (
              <div key={release.id} className="group flex items-center space-x-4 p-3 hover:bg-gray-800/60 rounded-lg transition-all duration-200 cursor-pointer">
                {/* Cover Image */}
                <div className="relative flex-shrink-0">
                  <img
                    src={getReleaseCover(release)}
                    alt={getReleaseTitle(release)}
                    className="w-16 h-16 object-cover"
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-lg truncate group-hover:text-green-400 transition-colors">
                    {getReleaseTitle(release)}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">
                    {getArtistNames(release.artists || release.artist)}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                      {getReleaseType(release)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatReleaseDate(release.release_date)}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToLibrary(release);
                    }}
                    className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                    title="Ajouter à la bibliothèque"
                  >
                    <Plus className="h-4 w-4 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySong(release);
                    }}
                    className="p-2 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
                    title="Écouter"
                  >
                    <Play className="h-4 w-4 text-black ml-0.5" />
                  </button>
                  <button className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="h-4 w-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default NewReleases;
