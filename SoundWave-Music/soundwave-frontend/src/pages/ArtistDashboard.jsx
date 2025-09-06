import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Music, 
  Disc, 
  Upload, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { songService } from '../services/songService';
import { albumService } from '../services/albumService';
import UploadSong from '../components/artist/UploadSong';
import CreateAlbum from '../components/artist/CreateAlbum';
import toast from 'react-hot-toast';

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('songs');
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadSong, setShowUploadSong] = useState(false);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState('');

  useEffect(() => {
    if (user?.role === 'artist' || user?.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [songsResponse, albumsResponse] = await Promise.all([
        songService.getUserSongs(),
        albumService.getUserAlbums()
      ]);
      
      setSongs(songsResponse.data || []);
      setAlbums(albumsResponse.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement de vos créations');
    } finally {
      setLoading(false);
    }
  };

  const handleSongUploaded = (newSong) => {
    setSongs(prev => [newSong, ...prev]);
    setShowUploadSong(false);
  };

  const handleAlbumCreated = (newAlbum) => {
    setAlbums(prev => [newAlbum, ...prev]);
    setShowCreateAlbum(false);
  };

  const handleDeleteSong = async (songId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette chanson ?')) {
      try {
        await songService.deleteSong(songId);
        setSongs(prev => prev.filter(song => song._id !== songId));
        toast.success('Chanson supprimée avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de la chanson');
      }
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet album ?')) {
      try {
        await albumService.deleteAlbum(albumId);
        setAlbums(prev => prev.filter(album => album._id !== albumId));
        toast.success('Album supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression de l\'album');
      }
    }
  };

  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         song.genre?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !filterGenre || song.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const filteredAlbums = albums.filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         album.genre?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !filterGenre || album.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  if (user?.role !== 'artist' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Accès refusé</h2>
          <p className="text-gray-400">Cette page est réservée aux artistes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de bord artiste</h1>
              <p className="text-gray-300">Gérez vos chansons et albums</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowUploadSong(true)}
                className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Upload className="h-5 w-5" />
                <span>Uploader une chanson</span>
              </button>
              <button
                onClick={() => setShowCreateAlbum(true)}
                className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Créer un album</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('songs')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'songs'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Music className="h-5 w-5 inline mr-2" />
            Mes chansons ({songs.length})
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'albums'
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Disc className="h-5 w-5 inline mr-2" />
            Mes albums ({albums.length})
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            />
          </div>
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            <option value="">Tous les genres</option>
            <option value="Pop">Pop</option>
            <option value="Rock">Rock</option>
            <option value="Hip-Hop">Hip-Hop</option>
            <option value="R&B">R&B</option>
            <option value="Electronic">Electronic</option>
            <option value="Jazz">Jazz</option>
            <option value="Classical">Classical</option>
            <option value="Country">Country</option>
            <option value="Reggae">Reggae</option>
            <option value="Blues">Blues</option>
            <option value="Folk">Folk</option>
            <option value="Alternative">Alternative</option>
            <option value="Indie">Indie</option>
            <option value="Metal">Metal</option>
            <option value="Punk">Punk</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Songs Tab */}
            {activeTab === 'songs' && (
              <div className="space-y-4">
                {filteredSongs.length === 0 ? (
                  <div className="text-center py-16">
                    <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {searchQuery || filterGenre ? 'Aucune chanson trouvée' : 'Aucune chanson'}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {searchQuery || filterGenre 
                        ? 'Essayez de modifier vos critères de recherche'
                        : 'Commencez par uploader votre première chanson'
                      }
                    </p>
                    {!searchQuery && !filterGenre && (
                      <button
                        onClick={() => setShowUploadSong(true)}
                        className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Uploader une chanson
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSongs.map((song) => (
                      <div key={song._id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">{song.title}</h3>
                            <p className="text-gray-400 text-sm">{song.genre}</p>
                            {song.duration && (
                              <p className="text-gray-500 text-xs">
                                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                              </p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                              <Play className="h-4 w-4 text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(song.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2">
                            <button className="p-1 hover:bg-gray-600 rounded transition-colors">
                              <Edit className="h-4 w-4 text-gray-400" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSong(song._id)}
                              className="p-1 hover:bg-red-600 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Albums Tab */}
            {activeTab === 'albums' && (
              <div className="space-y-4">
                {filteredAlbums.length === 0 ? (
                  <div className="text-center py-16">
                    <Disc className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {searchQuery || filterGenre ? 'Aucun album trouvé' : 'Aucun album'}
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {searchQuery || filterGenre 
                        ? 'Essayez de modifier vos critères de recherche'
                        : 'Créez votre premier album'
                      }
                    </p>
                    {!searchQuery && !filterGenre && (
                      <button
                        onClick={() => setShowCreateAlbum(true)}
                        className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Créer un album
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAlbums.map((album) => (
                      <div key={album._id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">{album.title}</h3>
                            <p className="text-gray-400 text-sm">{album.genre}</p>
                            <p className="text-gray-500 text-xs">
                              {album.songs?.length || 0} chanson{(album.songs?.length || 0) > 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                              <Play className="h-4 w-4 text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {new Date(album.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2">
                            <button className="p-1 hover:bg-gray-600 rounded transition-colors">
                              <Edit className="h-4 w-4 text-gray-400" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAlbum(album._id)}
                              className="p-1 hover:bg-red-600 rounded transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showUploadSong && (
        <UploadSong
          onClose={() => setShowUploadSong(false)}
          onSuccess={handleSongUploaded}
        />
      )}

      {showCreateAlbum && (
        <CreateAlbum
          onClose={() => setShowCreateAlbum(false)}
          onSuccess={handleAlbumCreated}
        />
      )}
    </div>
  );
};

export default ArtistDashboard;
