import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Upload, 
  BarChart3,
  Menu,
  X
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout, isArtist, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const handleUpload = () => {
    navigate('/upload');
    setIsMenuOpen(false);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
    setIsMenuOpen(false);
  };

  const handleAnalytics = () => {
    navigate('/analytics');
    setIsMenuOpen(false);
  };

  const handleAdmin = () => {
    navigate('/admin');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-white font-bold text-xl">SoundWave</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Accueil
              </Link>
              <Link
                to="/search"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Rechercher
              </Link>
              {isAuthenticated && (
                <Link
                  to="/library"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Bibliothèque
                </Link>
              )}
              
              {/* Options pour les artistes */}
              {isArtist() && (
                <>
                  <button
                    onClick={handleUpload}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </button>
                  <button
                    onClick={handleDashboard}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </button>
                </>
              )}
              
              {/* Options pour les admins */}
              {isAdmin() && (
                <button
                  onClick={handleAdmin}
                  className="text-red-400 hover:text-red-300 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Admin
                </button>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Search Icon */}
              <Link
                to="/search"
                className="text-gray-400 hover:text-white p-2 rounded-md transition-colors"
              >
                <Search className="h-5 w-5" />
              </Link>

              {/* Notifications */}
              {isAuthenticated && (
                <button className="text-gray-400 hover:text-white p-2 rounded-md transition-colors">
                  <Bell className="h-5 w-5" />
                </button>
              )}

              {/* Profile dropdown */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.username?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden lg:block text-sm font-medium">
                      {user?.username}
                    </span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-white font-medium">{user?.username}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                        <p className="text-xs text-blue-400 capitalize">{user?.role}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profil
                      </Link>
                      
                      <Link
                        to="/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres
                      </Link>
                      
                      {isArtist() && (
                        <button
                          onClick={handleAnalytics}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </button>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white p-2 rounded-md transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900 border-t border-gray-800">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Accueil
            </Link>
            <Link
              to="/search"
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Rechercher
            </Link>
            {isAuthenticated && (
              <Link
                to="/library"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Bibliothèque
              </Link>
            )}
            
            {/* Options pour les artistes */}
            {isArtist() && (
              <>
                <button
                  onClick={handleUpload}
                  className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </div>
                </button>
                <button
                  onClick={handleDashboard}
                  className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                </button>
              </>
            )}
            
            {/* Options pour les admins */}
            {isAdmin() && (
              <button
                onClick={handleAdmin}
                className="text-red-400 hover:text-red-300 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Admin
              </button>
            )}
            
            {/* Connexion/Déconnexion mobile */}
            {isAuthenticated ? (
              <div className="border-t border-gray-700 pt-4">
                <div className="px-3 py-2">
                  <p className="text-sm text-white font-medium">{user?.username}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                  <p className="text-xs text-blue-400 capitalize">{user?.role}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Profil
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Paramètres
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="border-t border-gray-700 pt-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 