import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart, 
  Music,
  User,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigationItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Search', icon: Search, path: '/search' },
    { name: 'Your Library', icon: Library, path: '/library' },
    { name: 'Create Playlist', icon: Plus, path: '/playlist' },
    { name: 'Liked Songs', icon: Heart, path: '/liked' },
    { name: 'Artists', icon: User, path: '/artist' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-gray-800 min-h-screen p-4 hidden lg:block">
      <div className="space-y-6">
        {/* Navigation Menu */}
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-3">
            Playlists
          </h3>
          
          {/* Placeholder for playlists */}
          <div className="space-y-2">
            <div className="text-gray-400 text-sm px-3 py-1">
              No playlists yet
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;