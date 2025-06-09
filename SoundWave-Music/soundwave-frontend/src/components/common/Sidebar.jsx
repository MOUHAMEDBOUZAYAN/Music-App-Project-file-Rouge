// Sidebar component will be implemented here 
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Grid3X3, 
  BookOpen, 
  Heart, 
  Plus,
  Music,
  Disc3,
  Mic
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';

const Sidebar = ({ className = "" }) => {
  const location = useLocation();
  const { user, isArtist } = useAuth();
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(true);

  // Navigation principale
  const mainNavItems = [
    {
      id: 'home',
      label: 'Accueil',
      icon: Home,
      path: '/',
      active: location.pathname === '/'
    },
    {
      id: 'search',
      label: 'Rechercher',
      icon: Search,
      path: '/search',
      active: location.pathname.startsWith('/search')
    },
    {
      id: 'explore',
      label: 'Explorer',
      icon: Grid3X3,
      path: '/explore',
      active: location.pathname.startsWith('/explore')
    }
  ];

  // Navigation bibliothèque
  const libraryItems = [
    {
      id: 'library',
      label: 'Votre bibliothèque',
      icon: BookOpen,
      path: '/library',
      active: location.pathname.startsWith('/library')
    },
    {
      id: 'liked',
      label: 'Titres likés',
      icon: Heart,
      path: '/liked',
      active: location.pathname === '/liked',
      color: 'text-green-500'
    }
  ];

  // Navigation artiste (si l'utilisateur est un artiste)
  const artistItems = isArtist() ? [
    {
      id: 'dashboard',
      label: 'Tableau de bord',
      icon: Disc3,
      path: '/artist/dashboard',
      active: location.pathname.startsWith('/artist/dashboard')
    },
    {
      id: 'upload',
      label: 'Ajouter un titre',
      icon: Mic,
      path: '/artist/upload',
      active: location.pathname === '/artist/upload'
    }
  ] : [];

  // Playlists de démonstration
  const [playlists] = useState([
    { 
      id: 1, 
      name: "Ma playlist #1", 
      count: 12,
      isPublic: true
    },
    { 
      id: 2, 
      name: "Favoris 2024", 
      count: 34,
      isPublic: false
    },
    { 
      id: 3, 
      name: "Workout Mix", 
      count: 28,
      isPublic: true
    }
  ]);

  const NavItem = ({ item, className = "" }) => (
    <Link
      to={item.path}
      className={`
        flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
        ${item.active 
          ? 'bg-gray-800 text-white' 
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
        }
        ${item.color || ''}
        ${className}
      `}
    >
      <item.icon size={20} />
      <span className="font-medium">{item.label}</span>
    </Link>
  );

  return (
    <div className={`w-64 bg-black flex flex-col h-full ${className}`}>
      <div className="p-6 flex flex-col h-full">
        {/* Logo */}
        <div className="mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <Music size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">SoundWave</span>
          </Link>
        </div>

        {/* Navigation principale */}
        <nav className="space-y-1 mb-8">
          {mainNavItems.map((item) => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        {/* Navigation artiste */}
        {artistItems.length > 0 && (
          <>
            <div className="border-t border-gray-800 my-4"></div>
            <div className="mb-6">
              <h3 className="text-gray-400 text-sm font-semibold mb-3 px-3">ARTISTE</h3>
              <nav className="space-y-1">
                {artistItems.map((item) => (
                  <NavItem key={item.id} item={item} />
                ))}
              </nav>
            </div>
          </>
        )}

        {/* Bibliothèque */}
        <div className="flex-1 min-h-0">
          <div className="mb-4">
            <div className="flex items-center justify-between px-3 mb-3">
              <button
                onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <BookOpen size={20} />
                <span className="font-semibold text-sm">VOTRE BIBLIOTHÈQUE</span>
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Plus size={20} />
              </button>
            </div>

            {isLibraryExpanded && (
              <nav className="space-y-1">
                {libraryItems.map((item) => (
                  <NavItem key={item.id} item={item} />
                ))}
              </nav>
            )}
          </div>

          {/* Filtres de playlist */}
          {isLibraryExpanded && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 px-3 mb-3">
                <button className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full">
                  Playlists
                </button>
                <button className="text-gray-400 hover:text-white text-xs px-3 py-1 rounded-full transition-colors">
                  Albums
                </button>
                <button className="text-gray-400 hover:text-white text-xs px-3 py-1 rounded-full transition-colors">
                  Artistes
                </button>
              </div>
            </div>
          )}

          {/* Liste des playlists */}
          {isLibraryExpanded && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="space-y-2 px-1">
                {playlists.map((playlist) => (
                  <Link
                    key={playlist.id}
                    to={`/playlist/${playlist.id}`}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center flex-shrink-0">
                      <Music size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {playlist.name}
                      </div>
                      <div className="text-gray-400 text-xs">
                        Playlist • {playlist.count} titres
                      </div>
                    </div>
                  </Link>
                ))}
                
                {/* Bouton créer playlist */}
                <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors w-full text-left">
                  <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
                    <Plus size={16} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-400 text-sm font-medium">
                      Créer une playlist
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Utilisateur connecté */}
        {user && (
          <div className="mt-auto pt-4 border-t border-gray-800">
            <Link
              to="/profile"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">
                  {user.firstName || user.username}
                </div>
                <div className="text-gray-400 text-xs capitalize">
                  {user.role}
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;