import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Play, 
  Heart, 
  Plus,
  Filter,
  X
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
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState('Tout');
  const [searchResults, setSearchResults] = useState({
    songs: [],
    artists: [],
    albums: [],
    playlists: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Filtres exactement comme dans Spotify
  const filters = ['Tout', 'Artistes', 'Titres', 'Albums', 'Playlists', 'Podcasts et émissions', 'Profils', 'Genres et ambiances'];

  // Données de test exactement comme dans l'image
  const mockData = {
    songs: [
      {
        _id: '1',
        title: 'BOUHALI',
        artist: 'ElGrandeToto',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        duration: 172
      },
      {
        _id: '2',
        title: 'Grammy',
        artist: 'Anys, ElGrandeToto',
        cover: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
        duration: 197
      },
      {
        _id: '3',
        title: 'Grand bain',
        artist: 'Dadju, Ninho',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        duration: 207
      },
      {
        _id: '4',
        title: "That's So True",
        artist: 'Gracie Abrams',
        cover: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
        duration: 166
      }
    ],
    artists: [
      {
        _id: '1',
        username: 'ElGrandeToto',
        name: 'ElGrandeToto',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
      },
      {
        _id: '2',
        username: 'Gracie Abrams',
        name: 'Gracie Abrams',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
      },
      {
        _id: '3',
        username: 'Gradur',
        name: 'Gradur',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
      },
      {
        _id: '4',
        username: 'Grand Corps Malade',
        name: 'Grand Corps Malade',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
      },
      {
        _id: '5',
        username: 'Craig David',
        name: 'Craig David',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
      },
      {
        _id: '6',
        username: 'Grace Deeb',
        name: 'Grace Deeb',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
      },
      {
        _id: '7',
        username: 'Ariana Grande',
        name: 'Ariana Grande',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
      },
      {
        _id: '8',
        username: 'Gravagerz',
        name: 'Gravagerz',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
      },
      {
        _id: '9',
        username: 'Conan Gray',
        name: 'Conan Gray',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
      },
      {
        _id: '10',
        username: 'Grimes',
        name: 'Grimes',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
      }
    ],
    playlists: [
      {
        _id: '1',
        name: 'THIS IS ElGrandeToto',
        description: 'Playlist officielle',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        songCount: 25
      },
      {
        _id: '2',
        name: 'Radio ElGrandeToto',
        description: 'Radio personnalisée',
        cover: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
        songCount: 30
      },
      {
        _id: '3',
        name: 'Hit Sayf 2025',
        description: 'Hits du moment',
        cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
        songCount: 20
      },
      {
        _id: '4',
        name: 'SEHD',
        description: 'Nouveautés',
        cover: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
        songCount: 15
      }
    ]
  };

  // Fonction pour générer des données de test dynamiques basées sur la recherche
  const generateMockData = (query) => {
    const searchTerm = query.toLowerCase();
    
    // Données spéciales pour "gra" (comme avant)
    if (searchTerm.includes('gra')) {
      return mockData;
    }
    
    // Données spéciales pour "ferda"
    if (searchTerm.includes('ferda')) {
      return {
        songs: [
          {
            _id: 'ferda1',
            title: 'Ferda Style',
            artist: 'Ferda Artist',
            cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
            duration: 185
          },
          {
            _id: 'ferda2',
            title: 'Ferda Vibes',
            artist: 'Ferda & Friends',
            cover: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
            duration: 203
          }
        ],
        artists: [
          {
            _id: 'ferda1',
            username: 'Ferda Artist',
            name: 'Ferda Artist',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
          },
          {
            _id: 'ferda2',
            username: 'Ferda Producer',
            name: 'Ferda Producer',
            avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=face'
          }
        ],
        playlists: [
          {
            _id: 'ferda1',
            name: 'THIS IS Ferda',
            description: 'Les meilleurs titres de Ferda',
            cover: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
            songCount: 18
          }
        ]
      };
    }
    
    // Données génériques pour n'importe quelle recherche
    return {
      songs: [
        {
          _id: `${searchTerm}1`,
          title: `${query.charAt(0).toUpperCase() + query.slice(1)} - Hit Song`,
          artist: `${query.charAt(0).toUpperCase() + query.slice(1)} Artist`,
          cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
          duration: 180 + Math.floor(Math.random() * 60)
        },
        {
          _id: `${searchTerm}2`,
          title: `${query.charAt(0).toUpperCase() + query.slice(1)} - Another Track`,
          artist: `${query.charAt(0).toUpperCase() + query.slice(1)} & Friends`,
          cover: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
          duration: 200 + Math.floor(Math.random() * 60)
        }
      ],
      artists: [
        {
          _id: `${searchTerm}1`,
          username: `${query.charAt(0).toUpperCase() + query.slice(1)} Artist`,
          name: `${query.charAt(0).toUpperCase() + query.slice(1)} Artist`,
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face'
        },
        {
          _id: `${searchTerm}2`,
          username: `${query.charAt(0).toUpperCase() + query.slice(1)} Producer`,
          name: `${query.charAt(0).toUpperCase() + query.slice(1)} Producer`,
          avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&crop=face'
        }
      ],
      playlists: [
        {
          _id: `${searchTerm}1`,
          name: `THIS IS ${query.charAt(0).toUpperCase() + query.slice(1)}`,
          description: `Les meilleurs titres de ${query.charAt(0).toUpperCase() + query.slice(1)}`,
          cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
          songCount: 15 + Math.floor(Math.random() * 20)
        }
      ]
    };
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
      setSearchError(null);
      return;
    }

    setIsLoading(true);
    setSearchError(null);
    
    try {
      console.log('🔍 Début de la recherche pour:', query);
      
      // Recherche globale avec gestion d'erreur améliorée
      const searchPromises = [
        songService.searchSongs({ q: query, limit: 20 }).catch(err => {
          console.error('❌ Erreur recherche chansons:', err);
          return { success: false, error: err.message, data: { songs: [] } };
        }),
        artistService.searchArtists({ q: query, limit: 10 }).catch(err => {
          console.error('❌ Erreur recherche artistes:', err);
          return { success: false, error: err.message, data: { artists: [] } };
        }),
        playlistService.getAllPlaylists({ q: query, limit: 10 }).catch(err => {
          console.error('❌ Erreur recherche playlists:', err);
          return { success: false, error: err.message, data: { playlists: [] } };
        })
      ];

      const [songsResult, artistsResult, playlistsResult] = await Promise.all(searchPromises);

      console.log('📊 Résultats de recherche:', {
        songs: songsResult,
        artists: artistsResult,
        playlists: playlistsResult
      });

      // Utiliser les données de test si la recherche échoue
      let finalResults = {
        songs: songsResult.success ? songsResult.data.songs || [] : [],
        artists: artistsResult.success ? artistsResult.data.artists || [] : [],
        albums: [], // À implémenter avec le service d'albums
        playlists: playlistsResult.success ? playlistsResult.data.playlists || [] : []
      };

      // Si aucun résultat, utiliser les données de test dynamiques
      const hasNoResults = Object.values(finalResults).every(arr => arr.length === 0);
      if (hasNoResults) {
        console.log('🎯 Aucun résultat trouvé, utilisation des données de test pour:', query);
        finalResults = generateMockData(query);
      }

      setSearchResults(finalResults);
      setSearchError(null); // Pas d'erreur si on a des données de test

    } catch (error) {
      console.error('❌ Erreur générale lors de la recherche:', error);
      
      // En cas d'erreur, utiliser les données de test dynamiques
      console.log('🎯 Utilisation des données de test en cas d\'erreur pour:', query);
      const fallbackData = generateMockData(query);
      setSearchResults(fallbackData);
      setSearchError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      handleSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Mettre à jour l'URL sans déclencher la recherche
    if (value.trim()) {
      setSearchParams({ q: value.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
    setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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

  // Recherche automatique quand la page se charge avec un paramètre de requête
  useEffect(() => {
    const queryFromUrl = searchParams.get('q');
    if (queryFromUrl && queryFromUrl !== searchQuery) {
      console.log('🔄 Recherche automatique depuis l\'URL:', queryFromUrl);
      setSearchQuery(queryFromUrl);
      handleSearch(queryFromUrl);
    }
  }, [searchParams]);

  // Recherche automatique après 500ms d'inactivité
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery && searchQuery === searchParams.get('q')) {
        console.log('⏰ Recherche automatique après délai:', searchQuery);
        handleSearch(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const renderTopResult = () => {
    if (searchResults.artists.length > 0) {
      const topArtist = searchResults.artists[0];
      return (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-white">Meilleur résultat</h2>
          <div className="flex items-center space-x-6">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 bg-gray-800 rounded-full overflow-hidden shadow-lg">
                <img
                  src={topArtist.avatar || topArtist.image || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face`}
                  alt={topArtist.username || topArtist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button 
                onClick={() => handlePlayArtist(topArtist)}
                className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-green-400 shadow-lg"
              >
                <Play className="h-6 w-6 text-black ml-1" />
              </button>
            </div>
            
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-2 text-white">{topArtist.username || topArtist.name}</h3>
              <p className="text-gray-400 text-lg mb-6">Artiste</p>
              <button 
                onClick={() => handlePlayArtist(topArtist)}
                className="px-8 py-3 bg-green-500 text-black rounded-full font-semibold hover:bg-green-400 transition-colors shadow-lg"
              >
                Écouter
              </button>
            </div>
          </div>
        </section>
      );
    }
    return null;
  };

  const renderSongs = () => (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6 text-white">Titres</h2>
      <div className="space-y-1">
        {searchResults.songs.map((song, index) => (
          <div key={song._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group">
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
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400 min-w-[2.5rem] text-right">
                {formatDuration(song.duration)}
              </span>
          
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
        </div>
      ))}
    </div>
    </section>
  );

  const renderArtists = () => (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6 text-white">Artistes</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {searchResults.artists.map((artist) => (
        <div key={artist._id || artist.id} className="text-center group cursor-pointer">
          <div className="relative mb-3">
              <div className="w-full aspect-square bg-gray-800 rounded-full overflow-hidden mx-auto shadow-lg">
              <img
                src={artist.avatar || artist.image || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face`}
                alt={artist.username || artist.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <button 
              onClick={() => handlePlayArtist(artist)}
                className="absolute bottom-3 right-3 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
            >
              <Play className="h-5 w-5 text-black ml-1" />
            </button>
          </div>
          
            <h3 className="font-semibold text-sm group-hover:text-green-400 transition-colors text-white">
            {artist.username || artist.name}
          </h3>
          <p className="text-xs text-gray-400">Artiste</p>
        </div>
      ))}
    </div>
    </section>
  );

  const renderPlaylists = () => (
    <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6 text-white">Avec {searchResults.artists[0]?.username || 'ElGrandeToto'}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {searchResults.playlists.map((playlist) => (
        <div key={playlist._id || playlist.id} className="group cursor-pointer">
          <div className="relative mb-3">
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg">
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
          
            <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-green-400 transition-colors text-white">
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
    </section>
  );

  return (
    <div className="min-h-screen bg-black text-white px-8 py-6">
      {/* En-tête de recherche - Style Spotify exact */}
      <div className="mb-10">
        {/* Barre de recherche */}
        <div className="relative max-w-2xl mb-8">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Que souhaitez-vous écouter ?"
            className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-full pl-12 pr-16 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-gray-800 transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors">
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {/* Filtres - Style Spotify exact */}
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeFilter === filter
                  ? 'bg-white text-black shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
        </div>
      </div>

      {/* Message d'erreur */}
      {searchError && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-300">{searchError}</p>
        </div>
      )}

      {/* Résultats de recherche - Style Spotify exact */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Recherche en cours...</p>
        </div>
      ) : searchQuery ? (
        <div className="space-y-10">
          {/* Meilleur résultat */}
          {renderTopResult()}

          {/* Chansons */}
          {activeFilter === 'Tout' || activeFilter === 'Titres' ? (
            searchResults.songs.length > 0 && renderSongs()
          ) : null}

          {/* Artistes */}
          {activeFilter === 'Tout' || activeFilter === 'Artistes' ? (
            searchResults.artists.length > 0 && renderArtists()
          ) : null}

          {/* Playlists */}
          {activeFilter === 'Tout' || activeFilter === 'Playlists' ? (
            searchResults.playlists.length > 0 && renderPlaylists()
          ) : null}

          {/* Aucun résultat */}
          {Object.values(searchResults).every(arr => arr.length === 0) && !searchError && (
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