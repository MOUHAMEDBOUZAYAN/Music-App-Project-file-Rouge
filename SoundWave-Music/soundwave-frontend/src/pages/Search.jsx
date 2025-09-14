import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import { albumService } from '../services/albumService';
import { playlistService } from '../services/playlistService';
import toast from 'react-hot-toast';

const Search = () => {
  const navigate = useNavigate();
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
  const [likedAlbums, setLikedAlbums] = useState([]);

  // Filtres exactement comme dans Spotify
  const filters = ['Tout', 'Artistes', 'Titres', 'Albums', 'Playlists', 'Podcasts et émissions', 'Profils', 'Genres et ambiances'];

  const handleSearch = async (query) => {
    console.log('🔍 handleSearch called with:', query);
    if (!query.trim()) {
      console.log('🔍 Empty query, clearing results');
      setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
      setSearchError(null);
      return;
    }

    console.log('🔍 Starting search process for:', query);
    setIsLoading(true);
    setSearchError(null);
    
    // Clear previous results immediately
    setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
    
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
        albumService.searchAlbums(query, { limit: 10 }).catch(err => {
          console.error('❌ Erreur recherche albums:', err);
          console.error('❌ Albums search error details:', err.response?.data);
          return { success: false, error: err.message, data: { albums: [] } };
        }),
        playlistService.searchPlaylists({ q: query, limit: 10 }).catch(err => {
          console.error('❌ Erreur recherche playlists:', err);
          return { success: false, error: err.message, data: { playlists: [] } };
        })
      ];

      const [songsResult, artistsResult, albumsResult, playlistsResult] = await Promise.all(searchPromises);

      console.log('📊 Résultats de recherche:', {
        songs: songsResult,
        artists: artistsResult,
        albums: albumsResult,
        playlists: playlistsResult
      });

      // Traitement des résultats avec gestion d'erreur améliorée
      let finalResults = {
        songs: [],
        artists: [],
        albums: [],
        playlists: []
      };

      // Traitement des chansons
      if (songsResult.success && songsResult.data) {
        if (Array.isArray(songsResult.data)) {
          finalResults.songs = songsResult.data;
        } else if (songsResult.data.songs) {
          finalResults.songs = songsResult.data.songs;
        } else if (songsResult.data.data) {
          finalResults.songs = songsResult.data.data;
        }
      }

      // Traitement des artistes
      if (artistsResult.success && artistsResult.data) {
        if (Array.isArray(artistsResult.data)) {
          finalResults.artists = artistsResult.data;
        } else if (artistsResult.data.artists) {
          finalResults.artists = artistsResult.data.artists;
        } else if (artistsResult.data.data) {
          finalResults.artists = artistsResult.data.data;
        }
      }

      // Traitement des albums
      if (albumsResult.success && albumsResult.data) {
        if (Array.isArray(albumsResult.data)) {
          finalResults.albums = albumsResult.data;
        } else if (albumsResult.data.albums) {
          finalResults.albums = albumsResult.data.albums;
        } else if (albumsResult.data.data) {
          finalResults.albums = albumsResult.data.data;
        }
      }

      // Traitement des playlists
      if (playlistsResult.success && playlistsResult.data) {
        if (Array.isArray(playlistsResult.data)) {
          finalResults.playlists = playlistsResult.data;
        } else if (playlistsResult.data.playlists) {
          finalResults.playlists = playlistsResult.data.playlists;
        } else if (playlistsResult.data.data) {
          finalResults.playlists = playlistsResult.data.data;
        }
      }
      
      console.log('🔍 Raw API results:', {
        songsResult: songsResult,
        artistsResult: artistsResult,
        albumsResult: albumsResult,
        playlistsResult: playlistsResult
      });
      
      console.log('🔍 Albums result processing:', {
        albumsResult,
        albumsData: albumsResult.data,
        finalAlbums: finalResults.albums
      });

      // Vérifier s'il y a des résultats réels
      const hasRealResults = Object.values(finalResults).some(arr => arr.length > 0);
      console.log('🔍 Vérification des résultats:', {
        hasRealResults,
        finalResults,
        query
      });
      
      // Vérifier s'il y a des erreurs de connexion
      const hasConnectionErrors = [songsResult, artistsResult, albumsResult, playlistsResult]
        .some(result => !result.success && result.error && 
          (result.error.includes('Network Error') || 
           result.error.includes('ERR_NETWORK') || 
           result.error.includes('ECONNABORTED')));
      
      if (hasConnectionErrors) {
        setSearchError('Erreur de connexion. Vérifiez votre connexion internet et que le serveur fonctionne.');
        setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
      } else if (!hasRealResults) {
        // Aucun résultat trouvé
        setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
        setSearchError(null);
      } else {
        // Afficher les résultats trouvés
        console.log('✅ Setting final results:', finalResults);
        setSearchResults(finalResults);
        setSearchError(null);
      }

      console.log('🔍 Setting search results:', finalResults);
      console.log('🔍 Final results details:', {
        songsCount: finalResults.songs.length,
        artistsCount: finalResults.artists.length,
        albumsCount: finalResults.albums.length,
        playlistsCount: finalResults.playlists.length,
        songs: finalResults.songs,
        artists: finalResults.artists,
        albums: finalResults.albums
      });

    } catch (error) {
      console.error('❌ Erreur générale lors de la recherche:', error);
      
      // En cas d'erreur, afficher un message d'erreur
      setSearchResults({ songs: [], artists: [], albums: [], playlists: [] });
      setSearchError('Erreur lors de la recherche. Veuillez réessayer.');
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

  // useEffect لتحميل الألبومات المفضلة
  useEffect(() => {
    const likedAlbumsFromStorage = JSON.parse(localStorage.getItem('likedAlbums') || '[]');
    setLikedAlbums(likedAlbumsFromStorage);
  }, []);

  // useEffect للبحث عند تحميل الصفحة أو تغيير URL
  useEffect(() => {
    const queryFromURL = searchParams.get('q');
    console.log('🔍 useEffect URL change:', { queryFromURL, searchQuery });
    if (queryFromURL && queryFromURL.trim()) {
      console.log('🔍 Starting search from URL:', queryFromURL);
      setSearchQuery(queryFromURL);
      handleSearch(queryFromURL);
    }
  }, [searchParams]);

  // useEffect للبحث عند تحميل الصفحة لأول مرة
  useEffect(() => {
    const queryFromURL = searchParams.get('q');
    console.log('🔍 Initial mount useEffect:', { queryFromURL, searchQuery });
    if (queryFromURL && queryFromURL.trim()) {
      console.log('🔍 Initial page load with query:', queryFromURL);
      handleSearch(queryFromURL);
    }
  }, []); // Run only on mount

  // Force search when searchQuery changes
  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      console.log('🔍 Search query changed, triggering search:', searchQuery);
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Helper function to build image URLs
  const buildImageUrl = (imagePath, fallbackUrl) => {
    if (!imagePath) return fallbackUrl;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const handlePlaySong = (song) => {
    playTrack(song);
    toast.success(`Lecture de ${song.title}`);
  };

  const handlePlayPlaylist = (playlist) => {
    playPlaylist(playlist);
    toast.success(`Lecture de la playlist ${playlist.name}`);
  };

  const handlePlayArtist = async (artist) => {
    try {
      console.log('🎵 Loading artist songs for:', artist.username || artist.name);
      
      // Charger les chansons de l'artiste
      const response = await fetch(`http://localhost:5000/api/artists/${artist._id || artist.id}/songs`);
      
      if (response.ok) {
        const songsData = await response.json();
        const songs = songsData.data || songsData || [];
        
        console.log('🎵 Loaded artist songs:', songs.length);
        
        if (songs.length > 0) {
          // Préparer les chansons pour le lecteur
          const formattedSongs = songs.map(song => ({
            _id: song._id,
            title: song.title,
            artist: song.artist?.username || artist.username || artist.name,
            cover: song.coverImage ? `http://localhost:5000${song.coverImage}` : null,
            album: song.album || '',
            duration: song.duration || 0,
            audioUrl: song.audioUrl ? `http://localhost:5000${song.audioUrl}` : null,
          }));
          
          // Utiliser playArtist avec les chansons chargées
          const artistWithTracks = { ...artist, tracks: formattedSongs };
          playArtist(artistWithTracks);
          toast.success(`Lecture des meilleurs titres de ${artist.username || artist.name}`);
        } else {
          toast.error('Aucune chanson disponible pour cet artiste');
        }
      } else {
        console.error('❌ Error loading artist songs:', response.status);
        toast.error('Impossible de charger les chansons de cet artiste');
      }
    } catch (error) {
      console.error('❌ Error in handlePlayArtist:', error);
      toast.error('Erreur lors du chargement des chansons');
    }
  };

  const handlePlayAlbum = (album) => {
    if (!album.tracks || album.tracks.length === 0) {
      toast.error('Cet album ne contient aucune chanson');
      return;
    }
    playAlbum(album);
    toast.success(`Lecture de l'album ${album.title || album.name}`);
  };

  const handleAddToQueue = (song) => {
    addToQueue(song);
    toast.success('Ajouté à la file d\'attente');
  };

  const handleToggleAlbumLike = async (album) => {
    try {
      const albumId = album._id || album.id;
      console.log('💿 handleToggleAlbumLike called:', { album, albumId });
      
      const response = await albumService.likeAlbum(albumId);
      
      if (response.success) {
        const wasLiked = response.data.isLiked;
        
        // Mettre à jour localStorage et state
        const currentLikedAlbums = JSON.parse(localStorage.getItem('likedAlbums') || '[]');
        if (wasLiked) {
          const newLikedAlbums = [...currentLikedAlbums, albumId];
          setLikedAlbums(newLikedAlbums);
          localStorage.setItem('likedAlbums', JSON.stringify(newLikedAlbums));
          toast.success('Album ajouté aux favoris');
        } else {
          const newLikedAlbums = currentLikedAlbums.filter(id => id !== albumId);
          setLikedAlbums(newLikedAlbums);
          localStorage.setItem('likedAlbums', JSON.stringify(newLikedAlbums));
          toast.success('Album retiré des favoris');
        }
      } else {
        toast.error(response.error || 'Erreur lors de la mise à jour des favoris');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris de l\'album:', error);
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  const handleToggleLike = async (song) => {
    try {
      const songId = song._id || song.id;
      const wasLiked = likedTracks.includes(songId);
      
      console.log('🔍 Search - handleToggleLike called:', { song, songId, wasLiked });
      
      await toggleLike(song);
      
      if (wasLiked) {
        toast.success('Retiré des favoris');
      } else {
        toast.success('Ajouté aux favoris');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
      toast.error('Erreur lors de la mise à jour des favoris');
    }
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
    console.log('🎯 renderTopResult called with:', {
      artistsCount: searchResults.artists.length,
      artists: searchResults.artists,
      searchQuery
    });
    
    if (searchResults.artists.length > 0) {
      const topArtist = searchResults.artists[0];
      console.log('🎯 Top artist:', topArtist);
      return (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-white">Meilleur résultat</h2>
          <div className="flex items-center space-x-6">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 bg-gray-800 rounded-full overflow-hidden shadow-lg">
                <img
                  src={buildImageUrl(topArtist.avatar || topArtist.image || topArtist.profilePicture, `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face`)}
                  alt={topArtist.username || topArtist.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('❌ Image load error for top artist:', topArtist.username, 'fallback to default');
                    e.target.src = `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face`;
                  }}
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

  const renderSongs = () => {
    console.log('🎵 renderSongs called with:', {
      songsCount: searchResults.songs.length,
      songs: searchResults.songs,
      searchQuery
    });
    
    if (searchResults.songs.length === 0) {
      return (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-white">Titres</h2>
          <p className="text-gray-400">Aucun titre trouvé</p>
        </section>
      );
    }
    
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-white">Titres</h2>
        <div className="space-y-1">
        {searchResults.songs.map((song, index) => {
          console.log('🎵 Rendering song:', {
            title: song.title,
            coverImage: song.coverImage,
            artistAvatar: song.artist?.avatar,
            artist: song.artist
          });
          return (
          <div key={song._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group">
          <div className="w-12 h-12 bg-gray-700 rounded flex-shrink-0 overflow-hidden">
            <img 
              src={buildImageUrl(song.coverImage || song.artist?.avatar, `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`)} 
              alt={song.title} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                console.log('❌ Image load error for song:', song.title, 'fallback to default');
                e.target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`;
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {song.title}
            </div>
            <div 
              className="text-xs text-gray-400 truncate hover:text-green-400 cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                console.log('🎤 Artist click - song.artist:', song.artist);
                console.log('🎤 Artist click - song.artist._id:', song.artist?._id);
                console.log('🎤 Artist click - song.artist.username:', song.artist?.username);
                
                if (song.artist?._id) {
                  console.log('🎤 Navigating to artist page from song:', song.artist._id, song.artist.username);
                  navigate(`/artist/${song.artist._id}`);
                } else {
                  console.log('❌ No artist ID found for navigation');
                  toast.error('Impossible de naviguer vers la page de l\'artiste');
                }
              }}
            >
              {song.artist?.username || song.artist?.name || song.artist}
            </div>
          </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400 min-w-[2.5rem] text-right">
                {formatDuration(song.duration)}
              </span>
          
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => handleToggleLike(song)}
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
        );
        })}
      </div>
    </section>
    );
  };

  const renderArtists = () => {
    if (searchResults.artists.length === 0) {
      return (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-white">Artistes</h2>
          <p className="text-gray-400">Aucun artiste trouvé</p>
        </section>
      );
    }
    
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-white">Artistes</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {searchResults.artists.map((artist) => (
        <div 
          key={artist._id || artist.id} 
          className="text-center group cursor-pointer"
          onClick={() => {
            console.log('🎤 Navigating to artist page:', artist._id, artist.username);
            navigate(`/artist/${artist._id || artist.id}`);
          }}
        >
          <div className="relative mb-3">
              <div className="w-full aspect-square bg-gray-800 rounded-full overflow-hidden mx-auto shadow-lg">
              <img
                src={buildImageUrl(artist.avatar || artist.image || artist.profilePicture, `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face`)}
                alt={artist.username || artist.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.log('❌ Image load error for artist:', artist.username, 'fallback to default');
                  e.target.src = `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face`;
                }}
              />
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                console.log('🎵 Playing artist music:', artist.username);
                handlePlayArtist(artist);
              }}
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
  };

  const renderAlbums = () => {
    if (searchResults.albums.length === 0) {
      return (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-white">Albums</h2>
          <p className="text-gray-400">Aucun album trouvé</p>
        </section>
      );
    }
    
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-white">Albums</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {searchResults.albums.map((album) => (
          <div 
            key={album._id || album.id} 
            className="group cursor-pointer hover:bg-gray-800/50 rounded-lg p-3 transition-colors duration-200"
            onClick={() => navigate(`/album/${album._id || album.id}`)}
          >
            <div className="relative mb-3">
              <div className="w-full aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={buildImageUrl(album.coverImage || album.cover, `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`)}
                  alt={album.title || album.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    console.log('❌ Image load error for album:', album.title, 'fallback to default');
                    e.target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`;
                  }}
                />
              </div>
              
              {/* Boutons d'action */}
              <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleAlbumLike(album);
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl ${
                    likedAlbums.includes(album._id || album.id) 
                      ? 'bg-green-500 text-white' 
                      : 'bg-black/80 text-white hover:bg-gray-700'
                  }`}
                >
                  <Heart className="h-4 w-4" fill={likedAlbums.includes(album._id || album.id) ? 'currentColor' : 'none'} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayAlbum(album);
                  }}
                  className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:scale-110 hover:bg-green-400 shadow-2xl"
                >
                  <Play className="h-4 w-4 text-black ml-1" />
                </button>
              </div>
            </div>
            
            <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-green-400 transition-colors text-white">
              {album.title || album.name}
            </h3>
            <p 
              className="text-xs text-gray-400 truncate hover:text-green-400 cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                console.log('🎤 Album artist click - album.artist:', album.artist);
                console.log('🎤 Album artist click - album.artist._id:', album.artist?._id);
                console.log('🎤 Album artist click - album.artist.username:', album.artist?.username);
                
                if (album.artist?._id) {
                  console.log('🎤 Navigating to artist page from album:', album.artist._id, album.artist.username);
                  navigate(`/artist/${album.artist._id}`);
                } else {
                  console.log('❌ No artist ID found for album navigation');
                  toast.error('Impossible de naviguer vers la page de l\'artiste');
                }
              }}
            >
              {album.artist?.name || album.artist?.username || album.artist || 'Artiste inconnu'}
            </p>
            {album.releaseDate && (
              <p className="text-xs text-gray-500 mt-1">
                {new Date(album.releaseDate).getFullYear()}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
    );
  };

  const renderPlaylists = () => {
    if (searchResults.playlists.length === 0) {
      return (
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-white">Playlists</h2>
          <p className="text-gray-400">Aucune playlist trouvée</p>
        </section>
      );
    }
    
    return (
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 text-white">Playlists</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {searchResults.playlists.map((playlist) => (
        <div key={playlist._id || playlist.id} className="group cursor-pointer">
          <div className="relative mb-3">
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <img
                src={buildImageUrl(playlist.coverUrl || playlist.cover, `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`)}
                alt={playlist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  console.log('❌ Image load error for playlist:', playlist.name, 'fallback to default');
                  e.target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`;
                }}
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
  };

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
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                console.log('🔍 Enter key pressed');
                handleSearch(searchQuery);
              }
            }}
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
          <button 
            onClick={() => {
              console.log('🔍 Manual search button clicked');
              if (searchQuery.trim()) {
                handleSearch(searchQuery);
              }
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <SearchIcon className="h-5 w-5" />
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
          {searchError.includes('connexion') && (
            <div className="mt-2 text-sm text-red-400">
              <p>• Vérifiez que le serveur backend fonctionne sur le port 5000</p>
              <p>• Vérifiez votre connexion internet</p>
              <p>• Essayez de recharger la page</p>
            </div>
          )}
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
            renderSongs()
          ) : null}

          {/* Artistes */}
          {activeFilter === 'Tout' || activeFilter === 'Artistes' ? (
            renderArtists()
          ) : null}

          {/* Albums */}
          {activeFilter === 'Tout' || activeFilter === 'Albums' ? (
            renderAlbums()
          ) : null}
          

          {/* Playlists */}
          {activeFilter === 'Tout' || activeFilter === 'Playlists' ? (
            renderPlaylists()
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