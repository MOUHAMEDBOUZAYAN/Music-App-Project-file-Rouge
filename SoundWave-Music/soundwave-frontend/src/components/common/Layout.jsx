import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AudioPlayer from '../player/AudioPlayer';
import { Menu } from 'lucide-react';
import { useSidebar } from '../../store/SidebarContext';

const Layout = ({ children }) => {
  const { isSidebarOpen, toggleSidebar, openSidebar } = useSidebar();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Bouton hamburger pour mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-[9996] p-2 bg-gray-800 rounded-md text-white hover:bg-gray-700 transition-colors lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Bouton pour rouvrir la sidebar sur desktop */}
      {!isSidebarOpen && (
        <button
          onClick={openSidebar}
          className="fixed top-4 left-4 z-[9996] p-2 bg-gray-800 rounded-md text-white hover:bg-gray-700 transition-colors lg:block hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      <div className="flex h-screen">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header avec espacement approprié */}
          <div className="flex-shrink-0">
            <Header />
          </div>
          
          {/* Contenu principal avec padding-top pour séparer du header */}
          <main className="flex-1 overflow-y-auto bg-black pb-28 pt-4" style={{ margin: 0, paddingLeft: 0, paddingRight: 0 }}>
            {children}
          </main>
        </div>
      </div>
      
      <AudioPlayer />
    </div>
  );
};

export default Layout; 