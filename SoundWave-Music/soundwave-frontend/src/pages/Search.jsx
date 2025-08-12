import React, { useState, useEffect } from 'react';
import { 
  Search as SearchIcon, 
  Play, 
  Heart, 
  Plus,
  Filter,
  Grid,
  List
} from 'lucide-react';
import { useMusic } from '../store/MusicContext';
import { songService } from '../services/songService';
import { artistService } from '../services/artistService';
import { playlistService } from '../services/playlistService';
import toast from 'react-hot-toast';

const Search = () => {
  const { 
    playTrack, 
    addToQueue, 
    toggleLike, 
    likedTracks,
    playPlaylist,
    playAlbum,
    playArtist
  } = useMusic();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tout');
  const [viewMode, setViewMode] = useState('grid');
  const [searchResults, setSearchResults] = useState({
    songs: [],
    artists: [],
    albums: [],
    playlists: []
  });
  const [isLoading, setIsLoading] = useState(false);

  const filters = ['Tout', 'Chansons', 'Artistes', 'Albums', 'Playlists'];

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
      return;
    }

    setIsLoading(true);
    try {
      // Recherche globale
      const [songsResult, artistsResult, playlistsResult] = await Promise.all([
        songService.searchSongs({ q: query, limit: 20 }),
        artistService.searchArtists({ q: query, limit: 10 }),
        playlistService.getAllPlaylists({ q: query, limit: 10 })
      ]);

      setSearchResults({
        songs: songsResult.success ? songsResult.data.songs || [] : [],
        artists: artistsResult.success ? artistsResult.data.artists || [] : [],
        albums: [], // À implémenter avec le service d'albums
        playlists: playlistsResult.success ? playlistsResult.data.playlists || [] : []
      });
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaySong = (song) => {
    playTrack(song);
    toast.success(`Lecture de ${song.title}`);
  };

  const handlePlayPlaylist = (playlist) => {
    playPlaylist(playlist);
    toast.success(`Lecture de la playlist ${playlist.name}`);
  };

  const handlePlayArtist = (artist) => {
    playArtist(artist);
    toast.success(`Lecture des meilleurs titres de ${artist.username || artist.name}`);
  };

  const handleAddToQueue = (song) => {
    addToQueue(song);
    toast.success('Ajouté à la file d\'attente');
  };

  const handleToggleLike = (songId) => {
    toggleLike(songId);
  };

  // Recherche automatique après 500ms d'inactivité
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const renderSongs = () => (
    <div className="space-y-2">
      {searchResults.songs.map((song) => (
        <div key={song._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors group">
          <div className="w-12 h-12 bg-gray-700 rounded flex-shrink-0">
            {song.cover && (
              <img src={song.cover} alt={song.title} className="w-full h-full object-cover rounded" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {song.title}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {song.artist}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => handleToggleLike(song._id)}
              className={`p-2 rounded-full transition-colors ${
                likedTracks.includes(song._id) 
                  ? 'text-green-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Heart className="h-4 w-4" fill={likedTracks.includes(song._id) ? 'currentColor' : 'none'} />
            </button>
            
            <button 
              onClick={() => handleAddToQueue(song)}
              className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
            
            <button 
              onClick={() => handlePlaySong(song)}
              className="p-2 rounded-full bg-green-500 text-black hover:bg-green-400 transition-colors"
            >
              <Play className="h-4 w-4 ml-0.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderArtists = () => (
    <div className={`grid gap-4 ${
      viewMode === 'grid' 
        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
        : 'grid-cols-1'
    }`}>
      {searchResults.artists.map((artist) => (
        <div key={artist._id || artist.id} className="text-center group cursor-pointer">
          <div className="relative mb-3">
            <div className={`${viewMode === 'grid' ? 'w-full aspect-square' : 'w-24 h-24'} bg-gray-800 rounded-full overflow-hidden mx-auto`}>
              <img
                src={artist.avatar || artist.image || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face`}
                alt={artist.username || artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <button 
              onClick={() => handlePlayArtist(artist)}
              className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <Play className="h-5 w-5 text-black ml-1" />
            </button>
          </div>
          
          <h3 className="font-semibold text-sm group-hover:text-green-400 transition-colors">
            {artist.username || artist.name}
          </h3>
          <p className="text-xs text-gray-400">Artiste</p>
        </div>
      ))}
    </div>
  );

  const renderPlaylists = () => (
    <div className={`grid gap-4 ${
      viewMode === 'grid' 
        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
        : 'grid-cols-1'
    }`}>
      {searchResults.playlists.map((playlist) => (
        <div key={playlist._id || playlist.id} className="group cursor-pointer">
          <div className="relative mb-3">
            <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={playlist.coverUrl || playlist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                alt={playlist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            
            <button 
              onClick={() => handlePlayPlaylist(playlist)}
              className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-green-400 shadow-lg"
            >
              <Play className="h-6 w-6 text-black ml-1" />
            </button>
          </div>
          
          <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-green-400 transition-colors">
            {playlist.name}
          </h3>
          <p className="text-xs text-gray-400 truncate">
            {playlist.description || 'Playlist personnalisée'}
          </p>
          {playlist.songCount && (
            <p className="text-xs text-gray-500 mt-1">
              {playlist.songCount} chansons
            </p>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* En-tête de recherche */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Rechercher</h1>
        
        {/* Barre de recherche */}
        <div className="relative max-w-2xl mb-6">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Que souhaitez-vous écouter ?"
            className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-full pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Filtres et options d'affichage */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Résultats de recherche */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Recherche en cours...</p>
        </div>
      ) : searchQuery ? (
        <div className="space-y-8">
          {/* Chansons */}
          {activeFilter === 'Tout' || activeFilter === 'Chansons' ? (
            searchResults.songs.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Chansons</h2>
                {renderSongs()}
              </section>
            )
          ) : null}

          {/* Artistes */}
          {activeFilter === 'Tout' || activeFilter === 'Artistes' ? (
            searchResults.artists.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Artistes</h2>
                {renderArtists()}
              </section>
            )
          ) : null}

          {/* Playlists */}
          {activeFilter === 'Tout' || activeFilter === 'Playlists' ? (
            searchResults.playlists.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4">Playlists</h2>
                {renderPlaylists()}
              </section>
            )
          ) : null}

          {/* Aucun résultat */}
          {Object.values(searchResults).every(arr => arr.length === 0) && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                Aucun résultat trouvé pour "{searchQuery}"
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Essayez avec d'autres mots-clés
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <SearchIcon className="h-24 w-24 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">
            Recherchez vos artistes, chansons ou playlists préférés
          </p>
        </div>
      )}
    </div>
  );
};

export default Search; 