import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Heart, 
  Plus, 
  ArrowLeft, 
  UserPlus, 
  UserCheck,
  Music,
  Disc3,
  Clock,
  Shuffle,
  Repeat
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useMusic } from '../store/MusicContext';
import { artistService } from '../services/artistService';
import { songService } from '../services/songService';
import toast from 'react-hot-toast';

const Artist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playTrack, addToQueue, toggleLike, likedTracks, playPlaylist } = useMusic();
  
  const [artist, setArtist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('songs');

  useEffect(() => {
    if (id) {
      loadArtistData();
    }
  }, [id]);

  const loadArtistData = async () => {
    setIsLoading(true);
    try {
      // Charger les informations de l'artiste
      const artistResult = await artistService.getArtistById(id);
      if (artistResult.success) {
        setArtist(artistResult.data);
        setSongs(artistResult.data.songs || []);
        setAlbums(artistResult.data.albums || []);
      } else {
        toast.error('Impossible de charger les informations de l\'artiste');
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'artiste:', error);
      toast.error('Erreur lors du chargement de l\'artiste');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayArtist = () => {
    if (songs.length > 0) {
      // Créer une playlist temporaire avec toutes les chansons de l'artiste
      const artistPlaylist = {
        id: `artist-${id}`,
        name: `Meilleurs titres de ${artist.username}`,
        songs: songs,
        coverImage: artist.profilePicture
      };
      playPlaylist(artistPlaylist);
      toast.success(`Lecture des meilleurs titres de ${artist.username}`);
    } else {
      toast.error('Aucune chanson disponible pour cet artiste');
    }
  };

  const handleFollowArtist = async () => {
    try {
      if (isFollowing) {
        const result = await artistService.unfollowArtist(id);
        if (result.success) {
          setIsFollowing(false);
          toast.success('Artiste non suivi');
        }
      } else {
        const result = await artistService.followArtist(id);
        if (result.success) {
          setIsFollowing(true);
          toast.success('Artiste suivi');
        }
      }
    } catch (error) {
      toast.error('Erreur lors de l\'action de suivi');
    }
  };

  const handlePlaySong = (song) => {
    playTrack(song);
    toast.success(`Lecture de ${song.title}`);
  };

  const handleAddToQueue = (song) => {
    addToQueue(song);
    toast.success('Ajouté à la file d\'attente');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bemusic-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent-bemusic border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-bemusic-primary">Chargement de l'artiste...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-bemusic-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-bemusic-primary text-xl">Artiste non trouvé</p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-accent-bemusic text-white rounded-lg hover:bg-accent-bemusic/80"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bemusic-primary text-bemusic-primary">
      {/* Header avec image de fond */}
      <div className="relative h-96 bg-gradient-to-b from-gray-900 to-bemusic-primary">
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Bouton retour */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </button>

        {/* Informations de l'artiste */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-end space-x-6">
            <div className="w-48 h-48 bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={artist.profilePicture || `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face`}
                alt={artist.username}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-4">{artist.username}</h1>
              <p className="text-lg text-gray-300 mb-4">{artist.bio}</p>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePlayArtist}
                  className="px-8 py-3 bg-accent-bemusic text-black font-semibold rounded-full hover:bg-accent-bemusic/80 transition-colors flex items-center space-x-2"
                >
                  <Play className="h-5 w-5" />
                  <span>Écouter</span>
                </button>
                
                <button
                  onClick={handleFollowArtist}
                  className={`px-6 py-3 rounded-full font-semibold transition-colors flex items-center space-x-2 ${
                    isFollowing 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-5 w-5" />
                      <span>Suivi</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      <span>Suivre</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="p-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-bemusic">{songs.length}</div>
            <div className="text-sm text-gray-400">Chansons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-bemusic">{albums.length}</div>
            <div className="text-sm text-gray-400">Albums</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-bemusic">
              {artist.followers ? (typeof artist.followers === 'number' ? artist.followers.toLocaleString() : artist.followers) : '0'}
            </div>
            <div className="text-sm text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-bemusic">
              {artist.stats?.totalFollowers || '0'}
            </div>
            <div className="text-sm text-gray-400">Abonnés</div>
          </div>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-700 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('songs')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'songs' 
                  ? 'text-accent-bemusic border-b-2 border-accent-bemusic' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Chansons
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`pb-4 px-2 font-medium transition-colors ${
                activeTab === 'albums' 
                  ? 'text-accent-bemusic border-b-2 border-accent-bemusic' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Albums
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'songs' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Chansons populaires</h2>
            {songs.length > 0 ? (
              <div className="space-y-2">
                {songs.map((song, index) => (
                  <div key={song._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors group">
                    <div className="w-8 text-center text-gray-400">{index + 1}</div>
                    
                    <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={song.cover || song.artwork || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=48&h=48&fit=crop`}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{song.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{song.genre}</p>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      {song.duration ? Math.floor(song.duration / 60) + ':' + (song.duration % 60).toString().padStart(2, '0') : '--:--'}
                    </div>
                    
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handlePlaySong(song)}
                        className="p-2 rounded-full bg-accent-bemusic text-black hover:bg-accent-bemusic/80"
                      >
                        <Play className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleAddToQueue(song)}
                        className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => toggleLike(song._id)}
                        className={`p-2 rounded-full ${
                          likedTracks.includes(song._id) 
                            ? 'text-accent-bemusic' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Heart className="h-4 w-4" fill={likedTracks.includes(song._id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Aucune chanson disponible pour cet artiste</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'albums' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Albums</h2>
            {albums.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {albums.map((album) => (
                  <div key={album._id} className="group cursor-pointer">
                    <div className="relative mb-3">
                      <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={album.coverImage || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      
                      <button className="absolute bottom-2 right-2 w-12 h-12 bg-accent-bemusic rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg">
                        <Play className="h-6 w-6 text-black ml-1" />
                      </button>
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-accent-bemusic transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {album.releaseDate ? new Date(album.releaseDate).getFullYear() : 'Date inconnue'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Disc3 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Aucun album disponible pour cet artiste</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Artist; 