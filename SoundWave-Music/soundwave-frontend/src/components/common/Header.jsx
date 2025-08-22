import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  SkipBack, 
  SkipForward, 
  List, 
  Bell,
  User,
  Settings
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Ici vous pouvez implémenter la logique de recherche
      console.log('Recherche:', searchQuery);
    }
  };

  return (
    <header className="bg-black/80 backdrop-blur-xl border-b border-gray-800/50 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Navigation et recherche */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Boutons de navigation */}
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <SkipBack className="h-5 w-5 text-white" />
            </button>
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <SkipForward className="h-5 w-5 text-white" />
            </button>
          </div>
          
          {/* Barre de recherche */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Que souhaitez-vous écouter ou regarder ?"
                className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </form>
          </div>
        </div>

        {/* Actions utilisateur */}
        <div className="flex items-center space-x-4">
          {/* Bouton Premium */}
          <button className="px-4 py-2 bg-green-500 text-black rounded-full font-semibold hover:scale-105 transition-transform hover:bg-green-400">
            Découverte Premium
          </button>
          
          {/* Notifications */}
          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <Bell className="h-5 w-5 text-white" />
          </button>
          
          {/* File d'attente */}
          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <List className="h-5 w-5 text-white" />
          </button>
          
          {/* Profil utilisateur */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-black">
                  {user?.username?.charAt(0) || 'U'}
                </span>
              </div>
            </button>
            
            {/* Menu déroulant du profil */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div className="py-2">
                <div className="px-4 py-3 border-b border-gray-700">
                  <div className="text-sm font-medium text-white">
                    {user?.username || 'Utilisateur'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {user?.email || 'email@example.com'}
                  </div>
                </div>
                
                <div className="py-1">
                  <Link to="/profile" className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                    <User className="h-4 w-4" />
                    <span>Profil</span>
                  </Link>
                  <Link to="/settings" className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors">
                    <Settings className="h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </div>
                
                <div className="border-t border-gray-700 pt-1">
                  <button 
                    onClick={() => { logout(); navigate('/login'); }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
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