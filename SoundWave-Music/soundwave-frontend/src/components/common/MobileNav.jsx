import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, User, Music, Crown, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const MobileNav = () => {
  const location = useLocation();
  const { user, isArtist, isAdmin } = useAuth();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-black/98 backdrop-blur-md border-t border-gray-700/80 z-50 lg:hidden">
      <nav className="h-full px-2 flex items-center justify-between overflow-x-auto">
        <Link to="/" className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-0 flex-shrink-0 ${isActive('/') ? 'text-white bg-gray-800/50' : 'text-gray-400 hover:text-white'}`}>
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">Accueil</span>
        </Link>
        <Link to="/search" className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-0 flex-shrink-0 ${isActive('/search') ? 'text-white bg-gray-800/50' : 'text-gray-400 hover:text-white'}`}>
          <Search className="h-5 w-5" />
          <span className="text-xs font-medium">Rechercher</span>
        </Link>
        <Link to="/library" className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-0 flex-shrink-0 ${isActive('/library') ? 'text-white bg-gray-800/50' : 'text-gray-400 hover:text-white'}`}>
          <Library className="h-5 w-5" />
          <span className="text-xs font-medium">Bibliothèque</span>
        </Link>
        {(isArtist() || isAdmin()) && (
          <Link to="/artist-dashboard" className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-0 flex-shrink-0 ${isActive('/artist-dashboard') ? 'text-white bg-gray-800/50' : 'text-gray-400 hover:text-white'}`}>
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
        )}
        <Link to="/new-releases" className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-0 flex-shrink-0 ${isActive('/new-releases') ? 'text-white bg-gray-800/50' : 'text-gray-400 hover:text-white'}`}>
          <Music className="h-5 w-5" />
          <span className="text-xs font-medium">Nouveautés</span>
        </Link>
        <Link to="/subscriptions" className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-0 flex-shrink-0 ${isActive('/subscriptions') ? 'text-white bg-gray-800/50' : 'text-gray-400 hover:text-white'}`}>
          <Crown className="h-5 w-5" />
          <span className="text-xs font-medium">Abonnements</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors min-w-0 flex-shrink-0 ${isActive('/profile') ? 'text-white bg-gray-800/50' : 'text-gray-400 hover:text-white'}`}>
          <User className="h-5 w-5" />
          <span className="text-xs font-medium">Profil</span>
        </Link>
      </nav>
    </div>
  );
};

export default MobileNav;


