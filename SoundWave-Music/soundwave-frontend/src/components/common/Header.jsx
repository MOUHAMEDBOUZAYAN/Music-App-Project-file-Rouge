import React, { useState } from 'react';
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
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Ici vous pouvez implémenter la logique de recherche
      console.log('Recherche:', searchQuery);
    }
  };

  return (
    <header className="bg-bemusic-secondary/95 backdrop-blur-sm border-b border-bemusic-primary px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Navigation et recherche */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Boutons de navigation */}
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-bemusic-tertiary hover:bg-bemusic-hover transition-bemusic">
              <SkipBack className="h-5 w-5 text-bemusic-primary" />
            </button>
            <button className="p-2 rounded-full bg-bemusic-tertiary hover:bg-bemusic-hover transition-bemusic">
              <SkipForward className="h-5 w-5 text-bemusic-primary" />
            </button>
          </div>
          
          {/* Barre de recherche */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-bemusic-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Que souhaitez-vous écouter ou regarder ?"
                className="w-full bg-bemusic-tertiary text-bemusic-primary placeholder-bemusic-secondary rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-bemusic transition-bemusic"
              />
            </form>
          </div>
        </div>

        {/* Actions utilisateur */}
        <div className="flex items-center space-x-4">
          {/* Bouton Premium */}
          <button className="px-4 py-2 bg-accent-bemusic text-bemusic-primary rounded-full font-semibold hover:scale-105 transition-transform hover:bg-accent-secondary">
            Découverte Premium
          </button>
          
          {/* Notifications */}
          <button className="p-2 rounded-full bg-bemusic-tertiary hover:bg-bemusic-hover transition-bemusic">
            <Bell className="h-5 w-5 text-bemusic-primary" />
          </button>
          
          {/* File d'attente */}
          <button className="p-2 rounded-full bg-bemusic-tertiary hover:bg-bemusic-hover transition-bemusic">
            <List className="h-5 w-5 text-bemusic-primary" />
          </button>
          
          {/* Profil utilisateur */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-full bg-bemusic-tertiary hover:bg-bemusic-hover transition-bemusic">
              <div className="w-8 h-8 bg-gradient-to-r from-accent-bemusic to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-bemusic-primary">
                  {user?.username?.charAt(0) || 'U'}
                </span>
              </div>
            </button>
            
            {/* Menu déroulant du profil */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-bemusic-tertiary border border-bemusic-primary rounded-lg shadow-bemusic-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-bemusic z-50">
              <div className="py-2">
                <div className="px-4 py-3 border-b border-bemusic-primary">
                  <div className="text-sm font-medium text-bemusic-primary">
                    {user?.username || 'Utilisateur'}
                  </div>
                  <div className="text-xs text-bemusic-secondary">
                    {user?.email || 'email@example.com'}
                  </div>
                </div>
                
                <div className="py-1">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-bemusic-secondary hover:bg-bemusic-hover hover:text-bemusic-primary transition-bemusic">
                    <User className="h-4 w-4" />
                    <span>Profil</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-bemusic-secondary hover:bg-bemusic-hover hover:text-bemusic-primary transition-bemusic">
                    <Settings className="h-4 w-4" />
                    <span>Paramètres</span>
                  </button>
                </div>
                
                <div className="border-t border-bemusic-primary pt-1">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-bemusic-secondary hover:bg-bemusic-hover hover:text-bemusic-primary transition-bemusic">
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