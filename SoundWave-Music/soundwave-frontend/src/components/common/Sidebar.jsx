import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart, 
  Download, 
  User,
  ChevronRight,
  ChevronDown,
  Cog,
  Disc3,
  Users,
  Crown
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../store/SidebarContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebar();
  const [isLibraryExpanded, setIsLibraryExpanded] = useState(true);
  const [isUserExpanded, setIsUserExpanded] = useState(true);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Logique de déconnexion
    navigate('/login');
  };

  const handleProfileClick = () => {
    console.log('Profile clicked - navigating to /profile');
    console.log('Current user:', user);
    console.log('Current location:', location.pathname);
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked - navigating to /settings');
    navigate('/settings');
  };

  return (
    <div className={`
      fixed lg:static inset-y-0 left-0 z-[9998] 
      w-64 bg-black border-r border-gray-800/50
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `} style={{ margin: 0, padding: 0, marginLeft: 0, marginRight: 0 }}>
      <div className="flex flex-col h-full">
        {/* Logo et navigation principale */}
        <div className="flex-shrink-0 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white" onClick={() => navigate('/')}>SoundWave</h1>
          </div>
          
          <nav className="space-y-2">
            <Link
              to="/"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Home className="h-5 w-5" />
              <span>Accueil</span>
            </Link>
            
            <Link
              to="/search"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/search') 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Search className="h-5 w-5" />
              <span>Rechercher</span>
            </Link>
            
            <Link
              to="/library"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/library') 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Library className="h-5 w-5" />
              <span>Votre Bibliothèque</span>
            </Link>
            
            <Link
              to="/subscriptions"
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/subscriptions') 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Crown className="h-5 w-5" />
              <span>Abonnements</span>
            </Link>
          </nav>
        </div>

        {/* Section Bibliothèque - avec flex-1 pour occuper l'espace disponible */}
        <div className="flex-1 px-6 overflow-y-auto">
          <div className="space-y-2">
            <button
              onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
              className="flex items-center justify-between w-full px-3 py-2 text-gray-400 hover:text-white transition-colors"
            >
              <span className="font-medium">Bibliothèque</span>
              {isLibraryExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {isLibraryExpanded && (
              <div className="ml-4 space-y-2">
                <Link
                  to="/create-playlist"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">Créer une playlist</span>
                </Link>
                
                <Link
                  to="/liked-songs"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">Titres likés</span>
                  <span className="ml-auto text-xs bg-gray-700 px-2 py-1 rounded-full">0</span>
                </Link>
                
                <Link
                  to="/downloads"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Téléchargements</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Section Utilisateur - simplifiée et toujours visible */}
        <div className="flex-shrink-0 p-4 border-t border-gray-800/50">
          {/* Profil utilisateur principal */}
          <div className="p-3 bg-gray-800/50 rounded-lg mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-black font-bold text-sm">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {user?.username || 'Utilisateur'}
                </p>
                <p className="text-gray-400 text-xs truncate">
                  {user?.email ? user.email.substring(0, 20) + '...' : 'email@example.com'}
                </p>
              </div>
              <button
                onClick={handleProfileClick}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Options utilisateur simples */}
          <div className="space-y-2">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-left"
            >
              <User className="h-4 w-4" />
              <span className="text-sm">Profil</span>
            </button>
            
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center space-x-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors text-left"
            >
              <Cog className="h-4 w-4" />
              <span className="text-sm">Paramètres</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;