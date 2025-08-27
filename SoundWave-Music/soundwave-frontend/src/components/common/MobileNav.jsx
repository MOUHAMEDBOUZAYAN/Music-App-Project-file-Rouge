import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, User } from 'lucide-react';

const MobileNav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-black border-t border-gray-800/60 z-[30] md:hidden">
      <nav className="h-full px-6 flex items-center justify-between">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-white' : 'text-gray-400'}`}>
          <Home className="h-5 w-5" />
        </Link>
        <Link to="/search" className={`flex flex-col items-center ${isActive('/search') ? 'text-white' : 'text-gray-400'}`}>
          <Search className="h-5 w-5" />
        </Link>
        <Link to="/library" className={`flex flex-col items-center ${isActive('/library') ? 'text-white' : 'text-gray-400'}`}>
          <Library className="h-5 w-5" />
        </Link>
        <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile') ? 'text-white' : 'text-gray-400'}`}>
          <User className="h-5 w-5" />
        </Link>
      </nav>
    </div>
  );
};

export default MobileNav;


