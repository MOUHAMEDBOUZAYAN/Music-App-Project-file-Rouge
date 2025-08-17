import React, { useState, useEffect } from 'react';
import { useSpotify } from '../../store/SpotifyContext';
import { FaSpotify, FaMusic, FaHeadphones, FaPlay } from 'react-icons/fa';

const SpotifyLogin = () => {
  const { login, loading, error, spotifyToken } = useSpotify();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté à Spotify
    if (spotifyToken) {
      // Rediriger ou mettre à jour l'interface
      console.log('Déjà connecté à Spotify');
    }
  }, [spotifyToken]);

  const handleSpotifyLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Erreur de connexion Spotify:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-2xl">
            <FaSpotify className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            SoundWave
          </h1>
          <p className="text-green-300 text-lg">
            Votre musique, partout
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Connectez-vous avec Spotify
            </h2>
            <p className="text-gray-300">
              Accédez à des millions de morceaux, playlists et artistes
            </p>
          </div>

          {/* Bouton de connexion Spotify */}
          <button
            onClick={handleSpotifyLogin}
            disabled={loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
              isHovered ? 'scale-105 shadow-2xl' : 'scale-100'
            } ${
              loading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 active:bg-green-700'
            } text-white shadow-lg`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <FaSpotify className="text-2xl" />
            )}
            {loading ? 'Connexion...' : 'Continuer avec Spotify'}
          </button>

          {/* Message d'erreur */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Avantages */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-gray-300">
              <FaMusic className="text-green-400 text-lg" />
              <span>Accès à plus de 100 millions de morceaux</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <FaHeadphones className="text-green-400 text-lg" />
              <span>Écoutez hors ligne</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <FaPlay className="text-green-400 text-lg" />
              <span>Playlists personnalisées</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            En continuant, vous acceptez nos{' '}
            <a href="#" className="text-green-400 hover:text-green-300 underline">
              conditions d'utilisation
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpotifyLogin;
