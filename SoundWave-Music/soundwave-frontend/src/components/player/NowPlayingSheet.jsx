import React from 'react';

const NowPlayingSheet = ({ track, isOpen, onClose, onPlayPause, isPlaying, onNext, onPrevious, onToggleLike }) => {
  if (!isOpen || !track) return null;

  return (
    <div className="fixed inset-0 z-[60] sm:hidden">
      <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
      <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 rounded-t-2xl p-4 shadow-2xl">
        <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-4"></div>

        <div className="flex flex-col items-center text-center">
          <div className="w-56 h-56 rounded-xl overflow-hidden bg-gray-800 mb-4">
            {(track.cover || track.coverUrl) && (
              <img 
                src={track.cover || track.coverUrl} 
                alt={track.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>
          <div className="mb-2">
            <div className="text-white text-lg font-semibold truncate max-w-[18rem]">{track.title}</div>
            <div className="text-gray-400 text-sm truncate max-w-[18rem]">{track.artist}</div>
          </div>

          <div className="flex items-center space-x-6 mt-3">
            <button onClick={onPrevious} className="p-3 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M10 12l10 7V5l-10 7zM4 5h2v14H4z"/></svg>
            </button>
            <button onClick={onPlayPause} className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center">
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <button onClick={onNext} className="p-3 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M14 12L4 5v14l10-7zM18 5h2v14h-2z"/></svg>
            </button>
          </div>

          <button onClick={() => onToggleLike?.(track.id)} className="mt-4 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.5C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingSheet;


