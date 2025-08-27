import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import AudioPlayer from '../player/AudioPlayer';
import MobileNav from './MobileNav';
import { Menu } from 'lucide-react';
import { useSidebar } from '../../store/SidebarContext';

const Layout = ({ children }) => {
  const { isSidebarOpen, toggleSidebar, openSidebar } = useSidebar();

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Bouton hamburger désactivé sur mobile (caché) */}
      <button
        onClick={toggleSidebar}
        className="hidden"
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

      {/* Sidebar - cachée totalement sur mobile */}
      <div className="hidden lg:block">
        <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      </div>
      
      {/* Contenu principal avec header, contenu et footer - Couleur uniforme */}
      <div className="flex-1 flex flex-col min-w-0 bg-black">
        {/* Header fixe en haut */}
        <div className="flex-shrink-0 z-50 bg-black hidden lg:block">
          <Header />
        </div>
        
        {/* Contenu principal avec scroll et espacement professionnel - Couleur uniforme */}
        <main className="flex-1 overflow-y-auto bg-black pb-56 md:pb-28 pt-4 pl-0 lg:pl-8" style={{ margin: 0, paddingRight: 0 }}>
          {children}
        </main>
        
        {/* Footer à la fin de la page */}
        <div className="flex-shrink-0 bg-black">
          <Footer />
        </div>
      </div>
      
      {/* Player audio fixe en bas */}
      <AudioPlayer />
      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
};

export default Layout; 