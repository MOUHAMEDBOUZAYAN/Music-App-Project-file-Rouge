import React from 'react';
import { useMusic } from '../../store/MusicContext';
import AudioPlayer from '../player/AudioPlayer';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlayPause, 
    nextTrack, 
    previousTrack, 
    setShuffle, 
    setRepeat,
    queue 
  } = useMusic();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Layout principal avec sidebar */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Contenu principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header />
          
          {/* Contenu de la page */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Lecteur audio (fixe en bas) */}
      {currentTrack && (
        <AudioPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={togglePlayPause}
          onNext={nextTrack}
          onPrevious={previousTrack}
          onShuffle={() => setShuffle(!shuffle)}
          onRepeat={() => {
            const repeatModes = ['none', 'one', 'all'];
            const currentIndex = repeatModes.indexOf(repeat);
            const nextIndex = (currentIndex + 1) % repeatModes.length;
            setRepeat(repeatModes[nextIndex]);
          }}
          queue={queue}
        />
      )}
    </div>
  );
};

export default Layout; 