import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart, 
  Download, 
  User,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useMusic } from '../../store/MusicContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const { likedTracks } = useMusic();
  const location = useLocation();
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(true);
  const [isUserExpanded, setIsUserExpanded] = useState(false);

  const navigationItems = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: Search, label: 'Rechercher', path: '/search' },
    { icon: Library, label: 'Votre Bibliothèque', path: '/library' }
  ];

  const libraryItems = [
    { icon: Plus, label: 'Créer une playlist', path: '/create-playlist' },
    { icon: Heart, label: 'Titres likés', path: '/liked-songs', count: likedTracks.length },
    { icon: Download, label: 'Téléchargements', path: '/downloads' }
  ];

  const userItems = [
    { icon: User, label: 'Profil', path: '/profile' },
    { icon: Settings, label: 'Paramètres', path: '/settings' }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
             {/* Sidebar */}
       <div className={`
         fixed lg:static inset-y-0 left-0 z-50
         w-64 bg-bemusic-secondary border-r border-bemusic-primary 
         flex flex-col transform transition-transform duration-300 ease-in-out
         h-screen overflow-y-auto
         ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
       `}>
        {/* Header mobile avec bouton fermer */}
        <div className="flex items-center justify-between p-4 lg:hidden">
          <div className="text-xl font-bold text-bemusic-primary">
            SoundWave
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-md text-bemusic-primary hover:bg-bemusic-tertiary"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Logo (caché sur mobile car déjà dans le header) */}
        <div className="p-6 hidden lg:block">
          <div className="text-2xl font-bold text-bemusic-primary">
            SoundWave
          </div>
        </div>

      {/* Navigation principale */}
      <nav className="px-6 mb-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-bemusic ${
                    isActive
                      ? 'text-bemusic-primary bg-bemusic-tertiary'
                      : 'text-bemusic-secondary hover:text-bemusic-primary hover:bg-bemusic-tertiary'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bibliothèque */}
      <div className="px-6 mb-6">
        <button
          onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
          className="flex items-center justify-between w-full px-3 py-2 text-bemusic-secondary hover:text-bemusic-primary transition-bemusic"
        >
          <span className="font-medium">Bibliothèque</span>
          {isLibraryExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {isLibraryExpanded && (
          <ul className="mt-2 space-y-1">
            {libraryItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                                      className={`flex items-center justify-between px-3 py-2 rounded-md transition-bemusic ${
                    isActive
                      ? 'text-bemusic-primary bg-bemusic-tertiary'
                      : 'text-bemusic-secondary hover:text-bemusic-primary hover:bg-bemusic-tertiary'
                  }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className="text-xs text-bemusic-tertiary">{item.count}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Section utilisateur */}
      <div className="px-6 mb-6 mt-auto">
        <button
          onClick={() => setIsUserExpanded(!isUserExpanded)}
          className="flex items-center justify-between w-full px-3 py-2 text-bemusic-secondary hover:text-bemusic-primary transition-bemusic"
        >
          <span className="font-medium">Utilisateur</span>
          {isUserExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        {isUserExpanded && (
          <ul className="mt-2 space-y-1">
            {userItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'text-white bg-gray-800'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </li>
              );
            })}
            
            <li>
                          <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-3 py-2 text-bemusic-secondary hover:text-bemusic-primary hover:bg-bemusic-tertiary rounded-md transition-bemusic"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm">Déconnexion</span>
            </button>
            </li>
          </ul>
        )}
      </div>

      {/* Informations utilisateur */}
      <div className="px-6 py-4 border-t border-bemusic-primary pb-24">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-accent-bemusic to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-bemusic-primary">
              {user?.username?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-bemusic-primary truncate">
              {user?.username || 'Utilisateur'}
            </div>
            <div className="text-xs text-bemusic-secondary truncate">
              {user?.email || 'email@example.com'}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Sidebar;