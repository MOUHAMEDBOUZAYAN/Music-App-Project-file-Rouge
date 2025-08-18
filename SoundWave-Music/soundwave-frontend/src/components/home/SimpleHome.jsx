import React, { useState, useEffect } from 'react';
import { FaSpotify, FaPlay, FaHeart, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SimpleHome = () => {
  const [apiStatus, setApiStatus] = useState('checking');
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    // Test de connexion à l'API backend
    const testApiConnection = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        if (response.ok) {
          setApiStatus('success');
          setApiMessage('Connexion au backend réussie !');
          
                     // Test de l'endpoint Spotify (sans suivre la redirection)
           try {
             const spotifyResponse = await fetch('http://localhost:5000/api/auth/spotify/login', {
               redirect: 'manual' // Ne pas suivre la redirection
             });
             if (spotifyResponse.status === 302 || spotifyResponse.status === 200) {
               setApiMessage('Connexion au backend et Spotify réussie !');
             } else {
               setApiMessage('Backend OK mais erreur Spotify');
             }
           } catch (spotifyError) {
             setApiMessage('Backend OK mais erreur Spotify: ' + spotifyError.message);
           }
        } else {
          setApiStatus('error');
          setApiMessage('Erreur de connexion au backend');
        }
      } catch (error) {
        setApiStatus('error');
        setApiMessage(`Erreur de connexion: ${error.message}`);
      }
    };

    testApiConnection();
  }, []);

  const getStatusIcon = () => {
    switch (apiStatus) {
      case 'success':
        return <FaCheck className="text-green-500" />;
      case 'error':
        return <FaTimes className="text-red-500" />;
      default:
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>;
    }
  };

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Section de bienvenue */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Bienvenue sur SoundWave
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Découvrez de nouvelles musiques et créez vos playlists
            </p>
            
            {/* Statut de l'API */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg inline-block">
              <div className="flex items-center gap-2">
                <span className="text-gray-300">Statut Backend:</span>
                {getStatusIcon()}
                <span className={getStatusColor()}>{apiMessage}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-green-500 text-white rounded-full text-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                <FaPlay />
                Commencer à écouter
              </button>
              <button className="px-8 py-4 bg-gray-700 text-white rounded-full text-lg font-semibold hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                <FaPlus />
                Créer une playlist
              </button>
            </div>
          </div>
        </section>

        {/* Section Spotify */}
        <section className="mb-12">
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <FaSpotify className="text-6xl text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Connectez-vous à Spotify</h2>
            <p className="text-gray-400 mb-4">
              Connectez-vous à votre compte Spotify pour découvrir les dernières sorties, 
              playlists recommandées et explorer la musique par catégorie
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <FaSpotify />
              Se connecter à Spotify
            </Link>
          </div>
        </section>

        {/* Section de découverte */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Découvrir plus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Recommandations</h3>
              <p className="text-purple-100 mb-4">
                Découvrez de nouvelles musiques basées sur vos goûts
              </p>
              <button className="px-4 py-2 bg-white text-purple-800 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                Découvrir
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Top Charts</h3>
              <p className="text-blue-100 mb-4">
                Écoutez les morceaux les plus populaires du moment
              </p>
              <button className="px-4 py-2 bg-white text-blue-800 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                Écouter
              </button>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Podcasts</h3>
              <p className="text-orange-100 mb-4">
                Découvrez des podcasts et émissions passionnantes
              </p>
              <button className="px-4 py-2 bg-white text-orange-800 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors">
                Explorer
              </button>
            </div>
          </div>
        </section>

        {/* Section fonctionnalités */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Fonctionnalités</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlay className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lecture en streaming</h3>
              <p className="text-gray-400 text-sm">
                Écoutez vos musiques préférées en haute qualité
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Musiques likées</h3>
              <p className="text-gray-400 text-sm">
                Gardez une trace de vos morceaux préférés
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlus className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Playlists personnalisées</h3>
              <p className="text-gray-400 text-sm">
                Créez et organisez vos propres playlists
              </p>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaSpotify className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Intégration Spotify</h3>
              <p className="text-gray-400 text-sm">
                Accédez à votre bibliothèque Spotify
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SimpleHome;
