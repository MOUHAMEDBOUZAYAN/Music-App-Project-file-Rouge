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
import { useDeezer } from '../store/DeezerContext';

const NewReleases = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getNewReleases, loading, error } = useDeezer();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('music');
  const [newReleases, setNewReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchNewReleases();
  }, []);

  // Fonction pour récupérer les nouvelles sorties depuis l'API Deezer
  const fetchNewReleases = async () => {
    try {
      setIsLoading(true);
      
      // Utiliser le service Deezer existant
      const result = await getNewReleases(20);
      if (result && result.data) {
        setNewReleases(result.data);
      } else {
        // Si pas de données, afficher un message
        setNewReleases([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des nouvelles sorties Deezer:', error);
      // En cas d'erreur, afficher un message d'erreur
      setNewReleases([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer getFallbackData() - plus de données hardcodées

  const handlePlaySong = (release) => {
    console.log('Playing:', release.title || release.name);
    // Ici vous pouvez intégrer votre logique de lecture
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
