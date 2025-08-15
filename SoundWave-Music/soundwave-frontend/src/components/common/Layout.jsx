import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AudioPlayer from '../player/AudioPlayer';
import { Menu } from 'lucide-react';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-bemusic-primary text-bemusic-primary">
      {/* Bouton hamburger pour mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-bemusic-secondary rounded-md text-bemusic-primary lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 overflow-y-auto bg-bemusic-primary">
            {children}
          </main>
        </div>
      </div>
      
      <AudioPlayer />
    </div>
  );
};

export default Layout; 