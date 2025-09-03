import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import { useDeezer } from '../store/DeezerContext'; // removed
import { FaSpotify, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const { loading } = useDeezer(); // removed
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Traitement de votre connexion Spotify...');

  useEffect(() => {
    const processCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`Erreur lors de la connexion: ${error}`);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage("Code d'autorisation manquant");
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        console.log('Code reçu:', code);
        setStatus('success');
        setMessage('Connexion Spotify réussie ! Redirection...');
        setTimeout(() => navigate('/'), 2000);
        
      } catch (error) {
        console.error('Erreur lors du traitement du callback:', error);
        setStatus('error');
        setMessage(`Erreur: ${error.message}`);
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <FaCheck className="text-green-500 text-4xl" />;
      case 'error':
        return <FaTimes className="text-red-500 text-4xl" />;
      default:
        return <FaSpinner className="text-blue-500 text-4xl animate-spin" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-blue-500';
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
            Connexion Spotify
          </p>
        </div>

        {/* Carte de statut */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
          <div className="mb-6">
            {getStatusIcon()}
          </div>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            {status === 'processing' && 'Traitement en cours...'}
            {status === 'success' && 'Connexion réussie !'}
            {status === 'error' && 'Erreur de connexion'}
          </h2>
          
          <p className={`text-lg ${getStatusColor()}`}>
            {message}
          </p>

          {status === 'processing' && (
            <div className="mt-6">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            En continuant, vous acceptez nos{' '}
            <span className="text-green-400 cursor-pointer hover:underline">
              conditions d'utilisation
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpotifyCallback;
