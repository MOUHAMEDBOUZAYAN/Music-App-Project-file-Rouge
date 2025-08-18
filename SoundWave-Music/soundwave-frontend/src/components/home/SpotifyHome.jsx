import React, { useEffect, useState } from 'react';
import { useSpotify } from '../../store/SpotifyContext';
import { FaPlay, FaPause, FaHeart, FaPlus, FaEllipsisH, FaSpotify } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SpotifyHome = () => {
  const {
    getNewReleases,
    getFeaturedPlaylists,
    getCategories,
    newReleases,
    featuredPlaylists,
    categories,
    loading,
    error,
    playTrack,
    currentTrack,
    playbackState
  } = useSpotify();

  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    // Charger les données au montage du composant
    // Si l'utilisateur n'est pas authentifié, les sections afficheront des messages d'authentification
    const loadSpotifyData = async () => {
      try {
        await Promise.allSettled([
          getNewReleases(),
          getFeaturedPlaylists(),
          getCategories()
        ]);
      } catch (error) {
        console.log('Erreur lors du chargement des données Spotify:', error.message);
        // Ne pas propager l'erreur, laisser les sections gérer l'affichage
      }
    };
    
    loadSpotifyData();
  }, [getNewReleases, getFeaturedPlaylists, getCategories]);

  const handlePlayTrack = (track) => {
    playTrack(track);
  };

  const isCurrentlyPlaying = (trackId) => {
    return currentTrack?.id === trackId && playbackState.isPlaying;
  };

  const renderNewReleases = () => {
    if (!newReleases?.length) {
      return (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Nouvelles sorties</h2>
          </div>
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <FaSpotify className="text-6xl text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Connectez-vous à Spotify</h3>
            <p className="text-gray-400 mb-4">
              Connectez-vous à votre compte Spotify pour découvrir les dernières sorties
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
      );
    }

    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Nouvelles sorties</h2>
          <Link
            to="/new-releases"
            className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
          >
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {newReleases.slice(0, 12).map((album) => (
            <div
              key={album.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredItem(album.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative mb-3">
                <img
                  src={album.images[0]?.url || '/placeholder-album.jpg'}
                  alt={album.name}
                  className="w-full aspect-square rounded-lg object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayTrack(album);
                    }}
                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-colors"
                  >
                    {isCurrentlyPlaying(album.id) ? (
                      <FaPause className="text-lg" />
                    ) : (
                      <FaPlay className="text-lg ml-1" />
                    )}
                  </button>
                </div>
              </div>
              <h3 className="text-white font-medium text-sm truncate group-hover:text-green-400 transition-colors">
                {album.name}
              </h3>
              <p className="text-gray-400 text-xs truncate">
                {album.artists.map(a => a.name).join(', ')}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderFeaturedPlaylists = () => {
    if (!featuredPlaylists?.length) {
      return (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Playlists en vedette</h2>
          </div>
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <FaSpotify className="text-6xl text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Découvrez des playlists</h3>
            <p className="text-gray-400 mb-4">
              Connectez-vous à Spotify pour voir les playlists recommandées
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
      );
    }

    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Playlists en vedette</h2>
          <Link
            to="/featured"
            className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
          >
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredPlaylists.slice(0, 6).map((playlist) => (
            <div
              key={playlist.id}
              className="group cursor-pointer bg-white/5 hover:bg-white/10 rounded-lg p-4 transition-colors"
              onMouseEnter={() => setHoveredItem(playlist.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="flex gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={playlist.images[0]?.url || '/placeholder-playlist.jpg'}
                    alt={playlist.name}
                    className="w-20 h-20 rounded-lg object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Logique pour jouer la playlist
                      }}
                      className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-colors"
                    >
                      <FaPlay className="text-sm ml-0.5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-lg truncate group-hover:text-green-400 transition-colors">
                    {playlist.name}
                  </h3>
                  <p className="text-gray-400 text-sm truncate">
                    {playlist.description || `Par ${playlist.owner.display_name}`}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {playlist.tracks.total} morceaux
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  const renderCategories = () => {
    if (!categories?.length) {
      return (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Catégories</h2>
          </div>
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <FaSpotify className="text-6xl text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Explorez par genre</h3>
            <p className="text-gray-400 mb-4">
              Connectez-vous à Spotify pour explorer la musique par catégorie
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
      );
    }

    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Parcourir</h2>
          <Link
            to="/categories"
            className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
          >
            Voir tout
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="group cursor-pointer"
            >
              <div className="relative h-32 rounded-lg overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                <img
                  src={category.icons[0]?.url || '/placeholder-category.jpg'}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  const renderWelcomeSection = () => {
    return (
      <section className="mb-12">
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <FaSpotify className="text-4xl" />
            <div>
              <h1 className="text-3xl font-bold">Bienvenue sur SoundWave</h1>
              <p className="text-green-100">
                Découvrez de nouvelles musiques et créez vos playlists
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-green-800 font-semibold rounded-full hover:bg-gray-100 transition-colors">
              Commencer à écouter
            </button>
            <button className="px-6 py-3 border border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors">
              Créer une playlist
            </button>
          </div>
        </div>
      </section>
    );
  };

  // Afficher le contenu même si les données Spotify ne sont pas disponibles
  // Les sections afficheront des messages d'authentification si nécessaire

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Section de bienvenue */}
        {renderWelcomeSection()}

        {/* Nouvelles sorties */}
        {renderNewReleases()}

        {/* Playlists en vedette */}
        {renderFeaturedPlaylists()}

        {/* Catégories */}
        {renderCategories()}

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
              <button className="px-4 py-2 bg-white text-blue-800 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                Écouter
              </button>
            </div>

            <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Podcasts</h3>
              <p className="text-orange-100 mb-4">
                Découvrez des podcasts et émissions passionnantes
              </p>
              <button className="px-4 py-2 bg-white text-orange-800 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                Explorer
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SpotifyHome;
