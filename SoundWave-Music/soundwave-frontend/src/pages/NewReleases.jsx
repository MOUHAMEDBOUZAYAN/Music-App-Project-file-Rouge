import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Play, 
  Heart, 
  MoreHorizontal,
  ArrowLeft,
  Search,
  Home,
  Library,
  User,
  Settings,
  Globe,
  MessageSquare,
  Crown,
  Music2,
  Calendar,
  Star,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NewReleases = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Données simulées pour les nouvelles sorties
  const newReleases = [
    {
      id: 1,
      title: "Tinnitus",
      artist: "Damost",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      category: "album",
      releaseDate: "2024-01-15",
      genre: "Hip-Hop",
      duration: "45:30"
    },
    {
      id: 2,
      title: "NGRTD",
      artist: "Youssoupha",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      category: "album",
      releaseDate: "2024-01-12",
      genre: "Rap",
      duration: "52:15"
    },
    {
      id: 3,
      title: "Bridges Between",
      artist: "Au5",
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
      category: "album",
      releaseDate: "2024-01-10",
      genre: "Electronic",
      duration: "38:45"
    },
    {
      id: 4,
      title: "Kalben",
      artist: "Kalben",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      category: "single",
      releaseDate: "2024-01-08",
      genre: "Pop",
      duration: "3:45"
    },
    {
      id: 5,
      title: "Hurry Up Tom...",
      artist: "The Weeknd",
      cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      category: "single",
      releaseDate: "2024-01-05",
      genre: "R&B",
      duration: "4:20"
    },
    {
      id: 6,
      title: "Sonsuza Kadar",
      artist: "Kalben",
      cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
      category: "album",
      releaseDate: "2024-01-03",
      genre: "Pop",
      duration: "41:30"
    }
  ];

  const categories = [
    { id: 'all', name: 'Tout', icon: Music2 },
    { id: 'album', name: 'Albums', icon: Calendar },
    { id: 'single', name: 'Singles', icon: Star },
    { id: 'ep', name: 'EPs', icon: TrendingUp }
  ];

  const filteredReleases = selectedCategory === 'all' 
    ? newReleases 
    : newReleases.filter(release => release.category === selectedCategory);

  const handlePlaySong = (release) => {
    // Logique pour jouer la musique
    console.log('Playing:', release.title);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Full Header with Navigation */}
      <header className={`bg-black border-b border-gray-800/50 py-4 px-6 sticky top-0 z-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 hover:scale-105 mr-4"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
              
              <Link to="/" className="text-2xl font-bold text-white hover:text-green-400 transition-colors">
                SoundWave
              </Link>
              
              <nav className="hidden md:flex items-center space-x-6">
                <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <Home className="h-4 w-4" />
                  <span>Accueil</span>
                </Link>
                <Link to="/search" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <Search className="h-4 w-4" />
                  <span>Recherche</span>
                </Link>
                <Link to="/library" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
                  <Library className="h-4 w-4" />
                  <span>Bibliothèque</span>
                </Link>
              </nav>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-green-500 text-black rounded-full font-semibold hover:scale-105 transition-all duration-200 hover:bg-green-400 text-sm">
                Découverte Premium
              </button>
              
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
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/10 to-purple-500/20 animate-pulse"></div>
        <div className="relative px-6 py-20 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className={`flex justify-center mb-8 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}>
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce-slow">
                <Bell className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-green-100 to-blue-100 bg-clip-text text-transparent transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Nouveautés
            </h1>
            <p className={`text-xl sm:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              Découvrez les dernières sorties musicales et restez à jour avec les nouveautés de vos artistes préférés.
            </p>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`flex flex-wrap gap-4 justify-center transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-green-500 text-black shadow-lg shadow-green-500/25'
                      : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Releases Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}>
            {filteredReleases.map((release) => (
              <div key={release.id} className="group cursor-pointer hover:bg-gray-800/60 p-4 transition-all duration-300 overflow-hidden">
                <div className="relative mb-4 flex justify-center">
                  <div className="w-full aspect-square bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 flex items-center justify-center">
                    <img
                      src={release.cover}
                      alt={release.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay sombre au hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>
                  </div>
                  
                  {/* Bouton play */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlaySong(release);
                    }}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl transform translate-y-2 group-hover:translate-y-0 z-10"
                  >
                    <Play className="h-6 w-6 text-black ml-0.5" />
                  </button>

                  {/* Badge de catégorie */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
                    {release.category === 'album' ? 'Album' : 'Single'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-lg group-hover:text-white transition-colors text-white truncate">
                    {release.title}
                  </h3>
                  <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                    {release.artist}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatDate(release.releaseDate)}</span>
                    <span>{release.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                      {release.genre}
                    </span>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <MoreHorizontal className="h-4 w-4 text-gray-400 hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-12 text-white transition-all duration-1000 delay-800 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}>
            Statistiques des nouveautés
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, label: 'Sorties cette semaine', value: '12', color: 'text-green-400' },
              { icon: Music2, label: 'Albums', value: '8', color: 'text-blue-400' },
              { icon: Star, label: 'Singles', value: '4', color: 'text-purple-400' }
            ].map((stat, index) => (
              <div key={index} className={`transition-all duration-1000 delay-${900 + index * 100} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
              }`}>
                <div className="w-16 h-16 bg-gray-800/60 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewReleases;
