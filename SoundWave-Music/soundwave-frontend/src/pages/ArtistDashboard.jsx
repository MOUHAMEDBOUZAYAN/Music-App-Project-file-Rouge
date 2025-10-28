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
  AlertTriangle,
  Heart,
  Clock,
  Calendar,
  TrendingUp,
  Eye,
  Users,
  BarChart3,
  Download,
  Share2,
  ExternalLink
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
    <div className="min-h-screen bg-black text-white">
      {/* Header Spotify-style */}
      <div className="bg-gradient-to-b from-purple-600 via-black to-black">
        <div className="px-6 pt-16 pb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            {/* Profile Section */}
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 lg:w-48 lg:h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-2xl flex items-center justify-center">
                <Music className="h-16 w-16 lg:h-24 lg:w-24 text-white" />
              </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-white/70 uppercase tracking-wider mb-2">Artiste</p>
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-300 text-lg mb-4">
                  Gérez vos créations musicales et connectez-vous avec vos fans
                </p>
                
                {/* Quick Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-gray-300">{songs.length} chanson{songs.length > 1 ? 's' : ''}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">{albums.length} album{albums.length > 1 ? 's' : ''}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">Créé le {new Date(user?.createdAt || Date.now()).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowUploadSong(true)}
                className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Upload className="h-5 w-5" />
                <span>Nouvelle chanson</span>
              </button>
              <button
                onClick={() => setShowCreateAlbum(true)}
                className="bg-transparent border border-white/30 text-white hover:border-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Nouvel album</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Navigation Tabs - Spotify Style */}
        <div className="flex items-center gap-8 mb-8">
          <button
            onClick={() => setActiveTab('songs')}
            className={`relative font-semibold transition-all duration-200 flex items-center gap-2 pb-2 ${
              activeTab === 'songs'
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Music className="h-5 w-5" />
            <span>Mes chansons</span>
            {activeTab === 'songs' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`relative font-semibold transition-all duration-200 flex items-center gap-2 pb-2 ${
              activeTab === 'albums'
                ? 'text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Disc className="h-5 w-5" />
            <span>Mes albums</span>
            {activeTab === 'albums' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full" />
            )}
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans vos créations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-200"
            />
          </div>
          <div className="relative">
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white focus:outline-none focus:border-white focus:bg-white/20 transition-all duration-200 appearance-none cursor-pointer min-w-[160px]"
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
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Songs Tab */}
            {activeTab === 'songs' && (
              <div className="space-y-4">
                {filteredSongs.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="bg-white/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <Music className="h-12 w-12 text-white/60" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {searchQuery || filterGenre ? 'Aucune chanson trouvée' : 'Aucune chanson'}
                    </h3>
                    <p className="text-white/60 mb-8 max-w-md mx-auto">
                      {searchQuery || filterGenre 
                        ? 'Essayez de modifier vos critères de recherche pour trouver vos créations'
                        : 'Commencez votre parcours musical en uploadant votre première chanson'
                      }
                    </p>
                    {!searchQuery && !filterGenre && (
                      <button
                        onClick={() => setShowUploadSong(true)}
                        className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <Upload className="h-5 w-5 inline mr-2" />
                        Uploader ma première chanson
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Table Header */}
                    <div className="grid grid-cols-[16px_1fr_200px_120px_60px] gap-4 px-4 py-2 text-white/60 text-sm font-medium border-b border-white/10">
                      <div>#</div>
                      <div>Titre</div>
                      <div>Album</div>
                      <div>Date ajoutée</div>
                      <div className="text-center">Durée</div>
                    </div>
                    
                    {/* Songs List */}
                    {filteredSongs.map((song, index) => (
                      <div key={song._id} className="group grid grid-cols-[16px_1fr_200px_120px_60px] gap-4 px-4 py-2 rounded-md hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-center">
                          <span className="text-white/60 group-hover:hidden">{index + 1}</span>
                          <button 
                            onClick={() => handlePlaySong(song)}
                            className="hidden group-hover:flex items-center justify-center w-4 h-4 text-white hover:scale-110 transition-transform"
                          >
                            <Play className="h-4 w-4 fill-white" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center flex-shrink-0">
                            {song.coverImage ? (
                              <img 
                                src={`http://localhost:5000${song.coverImage}`} 
                                alt={song.title}
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <Music className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-white font-medium truncate">{song.title}</h3>
                            <p className="text-white/60 text-sm truncate">{song.genre}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-white/60 truncate">
                          {song.album?.title || 'Single'}
                          </div>
                        
                        <div className="flex items-center text-white/60 text-sm">
                            {new Date(song.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                        
                        <div className="flex items-center justify-center text-white/60 text-sm">
                          {song.duration ? (
                            <span>{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</span>
                          ) : (
                            <span>-</span>
                          )}
                        </div>
                        
                        {/* Action buttons - shown on hover */}
                        <div className="absolute right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleToggleLike(song)}
                            className={`p-1 rounded-full transition-colors ${
                              likedTracks.includes(song._id) 
                                ? 'text-green-400 hover:text-green-300' 
                                : 'text-white/60 hover:text-white'
                              }`}
                              title={likedTracks.includes(song._id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                            >
                            <Heart className={`h-4 w-4 ${likedTracks.includes(song._id) ? 'fill-current' : ''}`} />
                            </button>
                            <button 
                              onClick={() => handleEditSong(song)}
                            className="p-1 text-white/60 hover:text-white rounded-full transition-colors" 
                              title="Modifier"
                            >
                            <Edit className="h-4 w-4" />
                            </button>
                          <button 
                            onClick={() => handleDeleteSong(song)}
                            className="p-1 text-white/60 hover:text-red-400 rounded-full transition-colors" 
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
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
                    <div className="bg-white/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                      <Disc className="h-12 w-12 text-white/60" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {searchQuery || filterGenre ? 'Aucun album trouvé' : 'Aucun album'}
                    </h3>
                    <p className="text-white/60 mb-8 max-w-md mx-auto">
                      {searchQuery || filterGenre 
                        ? 'Essayez de modifier vos critères de recherche pour trouver vos albums'
                        : 'Organisez vos créations en créant votre premier album'
                      }
                    </p>
                    {!searchQuery && !filterGenre && (
                      <button
                        onClick={() => setShowCreateAlbum(true)}
                        className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <Plus className="h-5 w-5 inline mr-2" />
                        Créer mon premier album
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredAlbums.map((album) => (
                      <div key={album._id} className="group bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                        {/* Album Cover */}
                        <div className="relative mb-4">
                          <div className="w-full aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                            {album.coverImage ? (
                              <img 
                                src={`http://localhost:5000${album.coverImage}`} 
                                alt={album.title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Disc className="h-12 w-12 text-white" />
                            )}
                          </div>
                          <button 
                            onClick={() => handlePlayAlbum(album)}
                            className="absolute bottom-2 right-2 bg-green-500 hover:bg-green-400 text-black p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                            title="Lire l'album"
                          >
                            <Play className="h-4 w-4 fill-current" />
                          </button>
                        </div>
                        
                        {/* Album Info */}
                        <div className="min-h-[60px]">
                          <h3 className="text-white font-semibold text-sm truncate mb-1">{album.title}</h3>
                          <p className="text-white/60 text-xs mb-2">{album.genre}</p>
                          <p className="text-white/40 text-xs">
                            {album.songs?.length || 0} chanson{(album.songs?.length || 0) > 1 ? 's' : ''} • {new Date(album.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        
                        {/* Action buttons - shown on hover */}
                        <div className="flex items-center justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleEditAlbum(album)}
                              className="p-2 text-white/60 hover:text-white rounded-full transition-colors" 
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteAlbum(album)}
                              className="p-2 text-white/60 hover:text-red-400 rounded-full transition-colors" 
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <button 
                            className="p-2 text-white/60 hover:text-white rounded-full transition-colors" 
                            title="Plus d'options"
                          >
                            <MoreVertical className="h-4 w-4" />
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-black border border-white/20 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-6">
              <div className="bg-red-500/20 p-3 rounded-full mr-4">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Confirmer la suppression
                </h3>
                <p className="text-white/60 text-sm">
                  Cette action est irréversible
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-white/80 mb-2">
                Êtes-vous sûr de vouloir supprimer{' '}
                <span className="font-semibold text-white">
                  "{itemToDelete?.title}"
                </span> ?
              </p>
              <p className="text-sm text-white/60">
                {deleteType === 'song' 
                  ? 'Cette chanson sera définitivement supprimée de votre bibliothèque.'
                  : 'Cet album et toutes ses chansons seront définitivement supprimés.'
                }
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-400 text-white rounded-full font-medium transition-colors"
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
