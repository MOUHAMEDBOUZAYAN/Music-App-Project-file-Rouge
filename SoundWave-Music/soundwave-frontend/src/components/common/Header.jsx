import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  SkipBack, 
  SkipForward, 
  List, 
  Bell,
  User,
  Settings,
  Grid3X3,
  Globe,
  MessageSquare,
  Crown,
  LayoutDashboard,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Logo from './Logo';

const Header = () => {
  const { user, logout, isArtist, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const isSubscriptions = location.pathname === '/subscriptions';

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Ici vous pouvez implémenter la logique de recherche
      console.log('Recherche:', searchQuery);
      // Rediriger vers la page de recherche avec la requête
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleSearchClick = () => {
    // Focus automatique sur l'input quand on clique sur la barre
    document.getElementById('search-input')?.focus();
  };

  return (
    <header className="bg-black border-b border-gray-800/50 py-6 sticky top-0 z-50 hidden lg:block" style={{ margin: 0, padding: 0, marginLeft: 0, marginRight: 0 }}>
      <div className="flex items-center justify-between px-8 pl-8">
        {/* Navigation et recherche */}
        <div className="flex items-center space-x-8 flex-1">
          {/* Logo */}
          <div className="hidden xl:block">
            <Logo size={40} withText={true} />
          </div>
          {/* Boutons de navigation avec espacement augmenté */}
          <div className="flex space-x-3 ml-10">
            {isSubscriptions && (
              <button
                className="p-2.5 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                onClick={() => navigate(-1)}
                aria-label="Retour"
                title="Retour"
              >
                <ArrowLeft className="h-5 w-5 text-white" />
              </button>
            )}
            <button className="p-2.5 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 hover:scale-105">
              <SkipBack className="h-5 w-5 text-white" />
            </button>
            <button className="p-2.5 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 hover:scale-105">
              <SkipForward className="h-5 w-5 text-white" />
            </button>
          </div>
          
          {/* Barre de recherche - Fonctionnalité améliorée */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative group">
              <div 
                className="relative cursor-text"
                onClick={handleSearchClick}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-white transition-colors duration-200" />
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  placeholder="Que souhaitez-vous écouter ou regarder ?"
                  className="w-full bg-gray-800/60 hover:bg-gray-800/80 focus:bg-gray-800 text-white placeholder-gray-400 rounded-full pl-12 pr-16 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 border border-transparent hover:border-gray-600 focus:border-green-500/30 shadow-lg cursor-text"
                  autoComplete="off"
                  spellCheck="false"
                />
                {/* Icône de découverte à droite */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <button
                    type="button"
                    className="p-2 rounded-full bg-gray-700/50 hover:bg-gray-600/70 transition-colors duration-200 hover:scale-110 group-hover:bg-gray-600/70"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Logique pour l'icône de découverte
                      console.log('Icône de découverte cliquée');
                    }}
                  >
                    <Grid3X3 className="h-4 w-4 text-gray-300 group-hover:text-white" />
                  </button>
                </div>
              </div>
              
              {/* Effet de focus amélioré */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500/0 via-green-500/0 to-green-500/0 group-focus-within:from-green-500/5 group-focus-within:via-green-500/3 group-focus-within:to-green-500/5 transition-all duration-500 pointer-events-none"></div>
            </form>
          </div>
        </div>

        {/* Actions utilisateur avec espacement augmenté */}
        <div className="flex items-center space-x-6 ml-8">
          {/* Bouton Premium - Taille et espacement optimisés */}
          <Link to="/subscriptions" className="px-5 py-2.5 bg-green-500 text-black rounded-full font-semibold hover:scale-105 transition-all duration-200 hover:bg-green-400 shadow-lg hover:shadow-green-500/25 text-sm">
            Découverte Premium
          </Link>
          
          {/* Notifications */}
          <Link to="/new-releases" className="p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 hover:scale-105 relative group">
            <Bell className="h-5 w-5 text-white" />
            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
              Nouveautés
            </div>
          </Link>
          
          {/* File d'attente */}
          <button className="p-2.5 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 hover:scale-105">
            <List className="h-5 w-5 text-white" />
          </button>
          
          {/* Profil utilisateur */}
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
                  
                  {(isArtist() || isAdmin()) && (
                    <Link to="/artist-dashboard" className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200 group">
                      <div className="flex items-center space-x-3">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard Artiste</span>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </Link>
                  )}
                  
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
                  
                  <Link to="/subscriptions" className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200 group">
                    <div className="flex items-center space-x-3">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <span>Abonnements</span>
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
                  <Link to="/subscriptions" className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800/80 hover:text-white transition-all duration-200 group">
                    <div className="flex items-center space-x-3">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <span>Passer à Premium</span>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </Link>
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
  );
};

export default Header; 