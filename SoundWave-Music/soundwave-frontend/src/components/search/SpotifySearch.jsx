import React, { useState, useEffect, useCallback } from 'react';
// import { useDeezer } from '../../store/DeezerContext'; // removed
import { FaSearch, FaFilter, FaTimes, FaMusic, FaUser, FaCompactDisc, FaList } from 'react-icons/fa';
import { debounce } from 'lodash';

const SpotifySearch = () => {
  // const { search, loading, error } = useDeezer(); // removed
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('track,artist,album,playlist');
  const [filters, setFilters] = useState({
    type: 'all',
    limit: 20
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  // Debounce la "recherche" locale
  const debouncedSearch = useCallback(
    debounce((searchQuery, type, limit) => {
      setLoading(true);
      try {
        if (searchQuery.trim()) {
          // Placeholder: aucun résultat externe
          setSearchResults({ tracks: { items: [] }, artists: { items: [] }, albums: { items: [] }, playlists: { items: [] } });
        } else {
          setSearchResults(null);
        }
        setError(null);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(query, searchType, filters.limit);
    return () => debouncedSearch.cancel();
  }, [query, searchType, filters.limit, debouncedSearch]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const handleTypeChange = (type) => {
    setSearchType(type);
  };

  const handleClearSearch = () => {
    setQuery('');
  };

  const getSearchTypeIcon = (type) => {
    switch (type) {
      case 'track':
        return <FaMusic className="text-blue-500" />;
      case 'artist':
        return <FaUser className="text-green-500" />;
      case 'album':
        return <FaCompactDisc className="text-purple-500" />;
      case 'playlist':
        return <FaList className="text-orange-500" />;
      default:
        return <FaMusic className="text-gray-500" />;
    }
  };

  const renderSearchResults = () => {
    if (!searchResults) return null;

    const { tracks, artists, albums, playlists } = searchResults;

    return (
      <div className="space-y-6">
        {/* Résultats des morceaux */}
        {tracks?.items?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <FaMusic className="text-blue-500" />
              Morceaux ({tracks.total})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {tracks.items.map((track) => (
                <div
                  key={track.id}
                  className="bg-white/5 hover:bg-white/10 rounded-lg p-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={track.album?.images?.[0]?.url || '/placeholder-album.jpg'}
                      alt={track.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{track.name}</p>
                      <p className="text-gray-400 text-sm truncate">
                        {(track.artists || []).map(a => a.name).join(', ')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Résultats des artistes */}
        {artists?.items?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <FaUser className="text-green-500" />
              Artistes ({artists.total})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {artists.items.map((artist) => (
                <div
                  key={artist.id}
                  className="text-center cursor-pointer hover:bg-white/5 rounded-lg p-3 transition-colors"
                >
                  <img
                    src={artist.images?.[0]?.url || '/placeholder-artist.jpg'}
                    alt={artist.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-2"
                  />
                  <p className="text-white text-sm font-medium truncate">{artist.name}</p>
                  <p className="text-gray-400 text-xs">Artiste</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Résultats des albums */}
        {albums?.items?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <FaCompactDisc className="text-purple-500" />
              Albums ({albums.total})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {albums.items.map((album) => (
                <div
                  key={album.id}
                  className="cursor-pointer hover:bg-white/5 rounded-lg p-3 transition-colors"
                >
                  <img
                    src={album.images?.[0]?.url || '/placeholder-album.jpg'}
                    alt={album.name}
                    className="w-full aspect-square rounded object-cover mb-2"
                  />
                  <p className="text-white text-sm font-medium truncate">{album.name}</p>
                  <p className="text-gray-400 text-xs truncate">
                    {(album.artists || []).map(a => a.name).join(', ')}
                  </p>
                  <p className="text-gray-500 text-xs">{album.release_date?.split('-')[0]}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Résultats des playlists */}
        {playlists?.items?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <FaList className="text-orange-500" />
              Playlists ({playlists.total})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {playlists.items.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-white/5 hover:bg-white/10 rounded-lg p-3 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={playlist.images?.[0]?.url || '/placeholder-playlist.jpg'}
                      alt={playlist.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{playlist.name}</p>
                      <p className="text-gray-400 text-sm truncate">Playlist</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête de recherche */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Rechercher
          </h1>
          <p className="text-gray-400">
            Découvrez des millions de morceaux, artistes, albums et playlists
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 text-xl" />
            </div>
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Que voulez-vous écouter ?"
              className="w-full pl-12 pr-20 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-4">
              {query && (
                <button
                  onClick={handleClearSearch}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg transition-colors ${
                  showFilters
                    ? 'bg-green-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <FaFilter />
              </button>
            </div>
          </div>

          {/* Filtres */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/20 backdrop-blur-sm">
              <div className="flex flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type de recherche
                  </label>
                  <div className="flex gap-2">
                    {[
                      { key: 'track', label: 'Morceaux', icon: FaMusic },
                      { key: 'artist', label: 'Artistes', icon: FaUser },
                      { key: 'album', label: 'Albums', icon: FaCompactDisc },
                      { key: 'playlist', label: 'Playlists', icon: FaList }
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => handleTypeChange(key)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          searchType === key
                            ? 'bg-green-500 text-white'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        <Icon className="inline mr-2" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre de résultats
                  </label>
                  <select
                    value={filters.limit}
                    onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Indicateur de chargement */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span>Recherche en cours...</span>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 text-red-400">
              <FaTimes />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Résultats de recherche */}
        {!loading && !error && renderSearchResults()}

        {/* Message quand aucun résultat */}
        {!loading && !error && searchResults && 
         (!searchResults.tracks?.items?.length && 
          !searchResults.artists?.items?.length && 
          !searchResults.albums?.items?.length && 
          !searchResults.playlists?.items?.length) && (
          <div className="text-center py-12">
            <div className="text-gray-400">
              <FaSearch className="text-6xl mx-auto mb-4 opacity-50" />
              <p className="text-xl">Aucun résultat trouvé</p>
              <p className="text-sm">Essayez avec d'autres mots-clés</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpotifySearch;
