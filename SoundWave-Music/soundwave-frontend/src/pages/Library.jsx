import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Heart, 
  Plus, 
  Search,
  Filter,
  Grid,
  List,
  Clock,
  Calendar,
  User,
  Disc,
  Music
} from 'lucide-react';
import { useMusic } from '../store/MusicContext';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const Library = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    likedTracks, 
    playHistory, 
    playTrack, 
    addToQueue, 
    toggleLike,
    playPlaylist,
    playAlbum
  } = useMusic();
  
  const [activeTab, setActiveTab] = useState('playlists');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('Tout');
  
  const tabs = [
    { id: 'playlists', label: 'Playlists', icon: List },
    { id: 'songs', label: 'Chansons', icon: Heart },
    { id: 'albums', label: 'Albums', icon: Disc },
    { id: 'artists', label: 'Artistes', icon: User },
    { id: 'recent', label: 'Récents', icon: Clock }
  ];

  const filterTypes = ['Tout', 'Créées par vous', 'Suivies'];

  // Données réelles depuis localStorage et API
  const [playlists, setPlaylists] = useState([]);

  // Naviguer vers une playlist
  const handlePlaylistClick = (playlist) => {
    console.log('📚 Navigating to playlist:', playlist);
    navigate(`/playlist/${playlist.id}`);
  };

  // Charger les playlists depuis localStorage
  useEffect(() => {
    const loadPlaylists = () => {
      try {
        const storedPlaylists = JSON.parse(localStorage.getItem('userPlaylists') || '[]');
        console.log('📚 Library - Loading playlists from localStorage:', storedPlaylists);
        setPlaylists(storedPlaylists);
        console.log('📚 Playlists chargées dans Library:', storedPlaylists.length);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des playlists:', error);
      }
    };

    loadPlaylists();
    
    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      console.log('📚 Library - localStorageChange event received');
      loadPlaylists();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, []);

  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);

  const handlePlayPlaylist = (playlist) => {
    // Convertir la playlist au format attendu par playPlaylist
    const playlistData = {
      name: playlist.name,
      tracks: playlist.songs || []
    };
    playPlaylist(playlistData);
    toast.success(`Lecture de la playlist ${playlist.name}`);
  };

  const handlePlayAlbum = (album) => {
    playAlbum(album);
    toast.success(`Lecture de l'album ${album.name}`);
  };

  const handlePlayArtist = (artist) => {
    // Simuler la lecture des meilleurs titres de l'artiste
    toast.success(`Lecture des meilleurs titres de ${artist.name}`);
  };

  const handlePlaySong = (song) => {
    playTrack(song);
    toast.success(`Lecture de ${song.title}`);
  };

  const handleAddToQueue = (song) => {
    addToQueue(song);
    toast.success('Ajouté à la file d\'attente');
  };

  const handleCreatePlaylist = () => {
    navigate('/create-playlist');
  };

  const renderPlaylists = () => {
    const filteredPlaylists = playlists.filter(playlist => {
      const matchesSearch = playlist.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'Tout' || 
        (filterType === 'Créées par vous' && playlist.isOwned !== false) ||
        (filterType === 'Suivies' && playlist.isOwned === false);
      
      return matchesSearch && matchesFilter;
    });

    if (filteredPlaylists.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">
            {playlists.length === 0 
              ? "Aucune playlist créée. Créez votre première playlist !" 
              : "Aucune playlist trouvée avec ces critères"
            }
          </p>
          {playlists.length === 0 && (
            <button 
              onClick={() => window.location.href = '/create-playlist'}
              className="mt-4 px-6 py-2 bg-green-500 text-black rounded-full font-semibold hover:bg-green-400 transition-colors"
            >
              Créer une playlist
            </button>
          )}
        </div>
      );
    }

    return (
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
          : 'grid-cols-1'
      }`}>
        {filteredPlaylists.map((playlist) => (
          <div key={playlist._id || playlist.id} className="group cursor-pointer" onClick={() => handlePlaylistClick(playlist)}>
            <div className="relative mb-3">
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                {playlist.coverImage ? (
                  <img
                    src={playlist.coverImage.startsWith('http') ? playlist.coverImage : `http://localhost:5000${playlist.coverImage}`}
                    alt={playlist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                    <Music className="h-12 w-12 text-gray-500" />
                  </div>
                )}
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
              {playlist.description || 'Aucune description'}
            </p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">
                {playlist.songs?.length || 0} chansons
              </p>
              <span className="text-xs text-green-400">Créée par vous</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderAlbums = () => {
    const filteredAlbums = albums.filter(album => 
      album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredAlbums.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">Aucun album trouvé</p>
        </div>
      );
    }

    return (
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
          : 'grid-cols-1'
      }`}>
        {filteredAlbums.map((album) => (
          <div key={album.id} className="group cursor-pointer">
            <div className="relative mb-3">
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={album.coverUrl}
                  alt={album.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              <button 
                onClick={() => handlePlayAlbum(album)}
                className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-green-400 shadow-lg"
              >
                <Play className="h-6 w-6 text-black ml-1" />
              </button>
            </div>
            
            <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-green-400 transition-colors">
              {album.name}
            </h3>
            <p className="text-xs text-gray-400 truncate">
              {album.artist}
            </p>
            <p className="text-xs text-gray-500">
              {album.year}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderArtists = () => {
    const filteredArtists = artists.filter(artist => 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredArtists.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">Aucun artiste trouvé</p>
        </div>
      );
    }

    return (
      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
          : 'grid-cols-1'
      }`}>
        {filteredArtists.map((artist) => (
          <div key={artist.id} className="text-center group cursor-pointer">
            <div className="relative mb-3">
              <div className={`${viewMode === 'grid' ? 'w-full aspect-square' : 'w-32 h-32'} bg-gray-800 rounded-full overflow-hidden mx-auto`}>
                <img
                  src={artist.avatar}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <button 
                onClick={() => handlePlayArtist(artist)}
                className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
              >
                <Play className="h-5 w-5 text-black ml-1" />
              </button>
            </div>
            
            <h3 className="font-semibold text-sm group-hover:text-green-400 transition-colors">
              {artist.name}
            </h3>
            <p className="text-xs text-gray-400">
              {artist.followers.toLocaleString()} abonnés
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderRecent = () => {
    const recentItems = playHistory.slice(0, 20);
    
    if (recentItems.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-400">Aucun élément récent</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {recentItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors group">
            <div className="w-12 h-12 bg-gray-700 rounded flex-shrink-0">
              {item.coverUrl && (
                <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover rounded" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {item.title}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {item.artist}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleAddToQueue(item)}
                className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
              
              <button 
                onClick={() => handlePlaySong(item)}
                className="p-2 rounded-full bg-green-500 text-black hover:bg-green-400 transition-colors"
              >
                <Play className="h-4 w-4 ml-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSongs = () => {
    console.log('🎵 Rendering liked songs:', likedTracks);
    
    if (!likedTracks || likedTracks.length === 0) {
      return (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucune chanson aimée</h3>
          <p className="text-gray-500">Les chansons que vous aimez apparaîtront ici</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {likedTracks.map((song, index) => (
          <div key={song._id || index} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              <Music className="h-6 w-6 text-gray-400" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">{song.title}</h3>
              <p className="text-sm text-gray-400 truncate">
                {song.artist?.username || song.artist?.name || 'Artiste inconnu'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => playTrack(song)}
                className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Play className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={() => toggleLike(song._id)}
                className="p-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'playlists':
        return renderPlaylists();
      case 'songs':
        return renderSongs();
      case 'albums':
        return renderAlbums();
      case 'artists':
        return renderArtists();
      case 'recent':
        return renderRecent();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Votre Bibliothèque</h1>
          <button 
            onClick={handleCreatePlaylist}
            className="px-4 py-2 bg-white text-black rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Créer une playlist
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans votre bibliothèque"
            className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-full pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Onglets */}
        <div className="flex items-center space-x-1 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filtres et options d'affichage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-800 text-white text-sm rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {filterTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
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

      {/* Contenu */}
      {renderContent()}
    </div>
  );
};

export default Library; 