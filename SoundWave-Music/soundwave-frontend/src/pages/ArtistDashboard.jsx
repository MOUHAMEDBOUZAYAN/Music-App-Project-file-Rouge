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
  Filter,
  X,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useMusic } from '../store/MusicContext';
import { songService } from '../services/songService';
import { albumService } from '../services/albumService';
import UploadSong from '../components/artist/UploadSong';
import CreateAlbum from '../components/artist/CreateAlbum';
import toast from 'react-hot-toast';

const ArtistDashboard = () => {
  const { user } = useAuth();
  const { playTrack, playAlbum, addToQueue, toggleLike, likedTracks } = useMusic();
  const [activeTab, setActiveTab] = useState('songs');
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadSong, setShowUploadSong] = useState(false);
  const [showCreateAlbum, setShowCreateAlbum] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(''); // 'song' or 'album'
  const [editingSong, setEditingSong] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);

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
    setEditingSong(null);
  };

  const handleSongUpdated = (updatedSong) => {
    console.log('🔄 ArtistDashboard - Song updated:', updatedSong);
    console.log('🔄 ArtistDashboard - Updated song coverImage:', updatedSong.coverImage);
    setSongs(prev => prev.map(song => 
      song._id === updatedSong._id ? updatedSong : song
    ));
    setShowUploadSong(false);
    setEditingSong(null);
  };

  const handleAlbumCreated = (newAlbum) => {
    setAlbums(prev => [newAlbum, ...prev]);
    setShowCreateAlbum(false);
  };

  const handleAlbumUpdated = (updatedAlbum) => {
    console.log('🔄 ArtistDashboard - Album updated:', updatedAlbum);
    setAlbums(prev => prev.map(album => 
      album._id === updatedAlbum._id ? updatedAlbum : album
    ));
    setShowCreateAlbum(false);
    setEditingAlbum(null);
  };

  // دوال التعديل
  const handleEditSong = (song) => {
    console.log('🔄 ArtistDashboard - Editing song:', song);
    setEditingSong(song);
    setShowUploadSong(true);
  };

  const handleCloseUploadSong = () => {
    setShowUploadSong(false);
    setEditingSong(null);
  };

  // Handlers for music playback
  const handlePlaySong = (song) => {
    console.log('🎵 Playing song:', song.title);
    playTrack(song);
    toast.success(`Lecture de "${song.title}"`);
  };

  const handlePlayAlbum = (album) => {
    console.log('🎵 Playing album:', album.title);
    playAlbum(album);
    toast.success(`Lecture de l'album "${album.title}"`);
  };

  const handleAddToQueue = (song) => {
    console.log('🎵 Adding to queue:', song.title);
    addToQueue(song);
    toast.success(`"${song.title}" ajouté à la file d'attente`);
  };

  const handleToggleLike = (song) => {
    console.log('🎵 Toggling like for:', song.title);
    toggleLike(song._id);
    toast.success(likedTracks.includes(song._id) ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  const handleEditAlbum = (album) => {
    setEditingAlbum(album);
    setShowCreateAlbum(true);
  };

  // دوال الحذف مع بطاقة التأكيد
  const handleDeleteSong = (song) => {
    setItemToDelete(song);
    setDeleteType('song');
    setShowDeleteConfirm(true);
  };

  const handleDeleteAlbum = (album) => {
    setItemToDelete(album);
    setDeleteType('album');
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      if (deleteType === 'song') {
        await songService.deleteSong(itemToDelete._id);
        setSongs(prev => prev.filter(song => song._id !== itemToDelete._id));
        toast.success('Chanson supprimée avec succès');
      } else if (deleteType === 'album') {
        await albumService.deleteAlbum(itemToDelete._id);
        setAlbums(prev => prev.filter(album => album._id !== itemToDelete._id));
        toast.success('Album supprimé avec succès');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(`Erreur lors de la suppression du ${deleteType === 'song' ? 'chanson' : 'album'}`);
    } finally {
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setDeleteType('');
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    setDeleteType('');
  };

  // إزالة التكرار من الأغاني
  const uniqueSongs = songs.filter((song, index, self) => 
    index === self.findIndex(s => s._id === song._id)
  );

  const filteredSongs = uniqueSongs.filter(song => {
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header - تصميم بسيط ومهني */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">Tableau de bord</h1>
              <p className="text-gray-300 text-lg">Gérez vos créations musicales</p>
              
              {/* إحصائيات سريعة */}
              <div className="flex flex-wrap items-center gap-6 mt-4">
                <div className="flex items-center space-x-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                  <Music className="h-4 w-4 text-blue-400" />
                  <span className="text-blue-300 font-medium">{songs.length} chanson{songs.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
                  <Disc className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-300 font-medium">{albums.length} album{albums.length > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            
            {/* أزرار الإجراءات */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowUploadSong(true)}
                className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Upload className="h-5 w-5" />
                <span>Nouvelle chanson</span>
              </button>
              <button
                onClick={() => setShowCreateAlbum(true)}
                className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Nouvel album</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs - تصميم محسن */}
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setActiveTab('songs')}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-3 ${
              activeTab === 'songs'
                ? 'bg-green-500 text-black shadow-lg transform scale-105'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Music className="h-5 w-5" />
            <span>Mes chansons</span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              activeTab === 'songs' ? 'bg-black/20' : 'bg-gray-600'
            }`}>
              {songs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-3 ${
              activeTab === 'albums'
                ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Disc className="h-5 w-5" />
            <span>Mes albums</span>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              activeTab === 'albums' ? 'bg-white/20' : 'bg-gray-600'
            }`}>
              {albums.length}
            </span>
          </button>
        </div>

        {/* Search and Filter - تصميم محسن */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans vos créations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
            />
          </div>
          <div className="relative">
            <Filter className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="pl-12 pr-8 py-4 bg-gray-800 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer min-w-[200px]"
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
                  <div className="text-center py-20">
                    <div className="bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <Music className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {searchQuery || filterGenre ? 'Aucune chanson trouvée' : 'Aucune chanson'}
                    </h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                      {searchQuery || filterGenre 
                        ? 'Essayez de modifier vos critères de recherche pour trouver vos créations'
                        : 'Commencez votre parcours musical en uploadant votre première chanson'
                      }
                    </p>
                    {!searchQuery && !filterGenre && (
                      <button
                        onClick={() => setShowUploadSong(true)}
                        className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <Upload className="h-5 w-5 inline mr-2" />
                        Uploader ma première chanson
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSongs.map((song) => (
                      <div key={song._id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all duration-200 hover:shadow-xl hover:scale-105 border border-gray-700">
                        {/* صورة الأغنية */}
                        <div className="relative mb-4">
                          <div className="w-full h-32 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                            {song.coverImage ? (
                              <img 
                                src={`http://localhost:5000${song.coverImage}`} 
                                alt={song.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Music className="h-12 w-12 text-gray-400" />
                            )}
                          </div>
                          <button 
                            onClick={() => handlePlaySong(song)}
                            className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-400 text-black p-2 rounded-full shadow-lg transition-colors"
                            title="Lire la chanson"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* معلومات الأغنية */}
                        <div className="space-y-2">
                          <h3 className="text-white font-semibold text-lg truncate">{song.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">{song.genre}</span>
                            {song.duration && (
                              <span className="text-gray-500 text-xs">
                                {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-500 text-xs">
                            {new Date(song.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        
                        {/* أزرار الإجراءات */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleAddToQueue(song)}
                              className="p-2 hover:bg-green-600 rounded-lg transition-colors" 
                              title="Ajouter à la file d'attente"
                            >
                              <Plus className="h-4 w-4 text-green-400" />
                            </button>
                            <button 
                              onClick={() => handleToggleLike(song)}
                              className={`p-2 hover:bg-red-600 rounded-lg transition-colors ${
                                likedTracks.includes(song._id) ? 'bg-red-600' : ''
                              }`}
                              title={likedTracks.includes(song._id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            >
                              <Music className={`h-4 w-4 ${likedTracks.includes(song._id) ? 'text-red-400' : 'text-gray-400'}`} />
                            </button>
                            <button 
                              onClick={() => handleEditSong(song)}
                              className="p-2 hover:bg-blue-600 rounded-lg transition-colors" 
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4 text-blue-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors" title="Plus d'options">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                          <button 
                            onClick={() => handleDeleteSong(song)}
                            className="p-2 hover:bg-red-600 rounded-lg transition-colors" 
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
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
                  <div className="text-center py-20">
                    <div className="bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <Disc className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {searchQuery || filterGenre ? 'Aucun album trouvé' : 'Aucun album'}
                    </h3>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                      {searchQuery || filterGenre 
                        ? 'Essayez de modifier vos critères de recherche pour trouver vos albums'
                        : 'Organisez vos créations en créant votre premier album'
                      }
                    </p>
                    {!searchQuery && !filterGenre && (
                      <button
                        onClick={() => setShowCreateAlbum(true)}
                        className="bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <Plus className="h-5 w-5 inline mr-2" />
                        Créer mon premier album
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAlbums.map((album) => (
                      <div key={album._id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all duration-200 hover:shadow-xl hover:scale-105 border border-gray-700">
                        {/* صورة الألبوم */}
                        <div className="relative mb-4">
                          <div className="w-full h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                            {album.coverImage ? (
                              <img 
                                src={`http://localhost:5000${album.coverImage}`} 
                                alt={album.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Disc className="h-12 w-12 text-gray-400" />
                            )}
                          </div>
                          <button 
                            onClick={() => handlePlayAlbum(album)}
                            className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-full shadow-lg transition-colors"
                            title="Lire l'album"
                          >
                            <Play className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* معلومات الألبوم */}
                        <div className="space-y-2">
                          <h3 className="text-white font-semibold text-lg truncate">{album.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">{album.genre}</span>
                            <span className="text-gray-500 text-xs">
                              {album.songs?.length || 0} chanson{(album.songs?.length || 0) > 1 ? 's' : ''}
                            </span>
                          </div>
                          <p className="text-gray-500 text-xs">
                            {new Date(album.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        
                        {/* أزرار الإجراءات */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditAlbum(album)}
                              className="p-2 hover:bg-blue-600 rounded-lg transition-colors" 
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4 text-blue-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-600 rounded-lg transition-colors" title="Plus d'options">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                          <button 
                            onClick={() => handleDeleteAlbum(album)}
                            className="p-2 hover:bg-red-600 rounded-lg transition-colors" 
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
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
          onClose={handleCloseUploadSong}
          onSuccess={handleSongUploaded}
          onUpdate={handleSongUpdated}
          editingSong={editingSong}
        />
      )}

      {showCreateAlbum && (
        <CreateAlbum
          onClose={() => {
            setShowCreateAlbum(false);
            setEditingAlbum(null);
          }}
          onSuccess={editingAlbum ? handleAlbumUpdated : handleAlbumCreated}
          editingAlbum={editingAlbum}
        />
      )}

      {/* بطاقة تأكيد الحذف */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="flex items-center mb-4">
              <div className="bg-red-500/20 p-3 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Confirmer la suppression
                </h3>
                <p className="text-gray-400 text-sm">
                  Cette action est irréversible
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                Êtes-vous sûr de vouloir supprimer{' '}
                <span className="font-semibold text-white">
                  "{itemToDelete?.title}"
                </span> ?
              </p>
              <p className="text-sm text-gray-500">
                {deleteType === 'song' 
                  ? 'Cette chanson sera définitivement supprimée de votre bibliothèque.'
                  : 'Cet album et toutes ses chansons seront définitivement supprimés.'
                }
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-400 text-white rounded-lg font-medium transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistDashboard;
