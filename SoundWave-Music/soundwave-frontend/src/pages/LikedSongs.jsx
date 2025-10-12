import React, { useState, useEffect } from 'react';
import { Heart, Play, Shuffle, MoreVertical, Clock, User, Plus, ArrowLeft, Music, Music2, Users } from 'lucide-react';
import TrackList from '../components/music/TrackList';
import { useMusic } from '../store/MusicContext';
import { songService } from '../services/songService';
import toast from 'react-hot-toast';

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('dateAdded'); // dateAdded, title, artist, duration
  
  // Debug: Log when sortBy changes
  useEffect(() => {
    console.log('🔄 SortBy changed to:', sortBy);
  }, [sortBy]);
  
  // Debug: Log when likedSongs changes
  useEffect(() => {
    console.log('🔄 LikedSongs changed, count:', likedSongs.length);
    console.log('🔄 First few songs:', likedSongs.slice(0, 3));
  }, [likedSongs]);
  const { likedTracks, toggleLike, refreshLikedSongs, playTrack, addToQueue } = useMusic();

  // تحميل الأغاني المفضلة عند تحميل الصفحة
  useEffect(() => {
    const loadLikedSongs = async () => {
      try {
        console.log('🔄 Starting to load liked songs...');
        console.log('🔑 Auth token:', localStorage.getItem('authToken'));
        console.log('👤 User:', localStorage.getItem('user'));
        
        setIsLoading(true);
        const apiSongs = await refreshLikedSongs();
        console.log('🔄 Refreshed liked songs:', apiSongs);
        console.log('🔄 API Songs type:', typeof apiSongs);
        console.log('🔄 API Songs length:', Array.isArray(apiSongs) ? apiSongs.length : 'Not an array');
        console.log('🔄 API Songs structure:', apiSongs);
        
        const results = apiSongs.map(s => {
          console.log('🔄 Processing song:', s);
          console.log('🔄 Song keys:', Object.keys(s || {}));
          console.log('🔄 Song _id:', s._id);
          console.log('🔄 Song title:', s.title);
          console.log('🔄 Song artist:', s.artist);
          console.log('🔄 Song audioUrl:', s.audioUrl);
          console.log('🔄 Song cover:', s.cover);
          
          if (s.type === 'external') {
            return {
              id: s.externalId || s._id,
              _id: s.externalId || s._id,
              title: s.title || `Titre ${s.externalId || s._id}`,
              artist: s.artist?.name || s.artist?.username || (typeof s.artist === 'string' ? s.artist : 'Artiste inconnu'),
              album: s.album?.title || s.album?.name || s.album || '—',
              duration: s.duration || 180,
              cover: s.cover || s.coverImage || s.album?.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop`,
              audioUrl: s.audioUrl || (s.externalId ? `http://localhost:5000/uploads/audio/${s.externalId}.mp3` : null),
              dateAdded: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
              isLiked: true
            };
          }
          
          // For internal songs
          const songId = s._id || s.id;
          console.log('🔄 Song ID:', songId, 'Original song:', s);
          
          return {
            id: songId,
            _id: songId,
            title: s.title || 'Titre inconnu',
            artist: s.artist?.name || s.artist?.username || (typeof s.artist === 'string' ? s.artist : 'Artiste inconnu'),
            album: s.album?.title || s.album?.name || s.album || '—',
            duration: s.duration || 180,
            cover: s.cover || s.coverImage || s.album?.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop',
            audioUrl: s.audioUrl || (songId ? `http://localhost:5000/uploads/audio/${songId}.mp3` : null),
            dateAdded: s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            isLiked: true
          };
        });

        console.log('🔄 Final processed results:', results);
        console.log('🔄 Results length:', results.length);
        console.log('🔄 First result:', results[0]);
        setLikedSongs(results);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Erreur lors du chargement des musiques likées:', error);
        console.error('❌ Error details:', {
          status: error.status,
          message: error.message,
          response: error.response
        });
        
        // إذا كان الخطأ 401، المستخدم غير مسجل دخول
        if (error.status === 401) {
          console.log('🔐 User not authenticated, redirecting to login...');
          // يمكن إضافة إعادة توجيه هنا إذا لزم الأمر
        }
        
        setLikedSongs([]);
        setIsLoading(false);
      }
    };

    loadLikedSongs();
  }, []); // تحميل مرة واحدة فقط عند تحميل الصفحة

  // تحديث الأغاني المفضلة عند تغيير likedTracks
  useEffect(() => {
    // فقط إذا كان هناك تغيير في likedTracks
    if (likedTracks && likedTracks.length >= 0) {
      const loadLikedSongs = async () => {
        try {
          console.log('🔄 likedTracks changed, reloading songs...', likedTracks);
          setIsLoading(true);
          const apiSongs = await refreshLikedSongs();
          console.log('🔄 Updated liked songs:', apiSongs);
          console.log('🔄 Updated API Songs type:', typeof apiSongs);
          console.log('🔄 Updated API Songs length:', Array.isArray(apiSongs) ? apiSongs.length : 'Not an array');
          console.log('🔄 Updated API Songs structure:', apiSongs);
          
          const results = apiSongs.map(s => {
            console.log('🔄 Processing song (update):', s);
            console.log('🔄 Song keys (update):', Object.keys(s || {}));
            console.log('🔄 Song _id (update):', s._id);
            console.log('🔄 Song title (update):', s.title);
            console.log('🔄 Song artist (update):', s.artist);
            console.log('🔄 Song audioUrl (update):', s.audioUrl);
            console.log('🔄 Song cover (update):', s.cover);
            
            if (s.type === 'external') {
              return {
                id: s.externalId || s._id,
                _id: s.externalId || s._id,
                title: s.title || `Titre ${s.externalId || s._id}`,
                artist: s.artist?.name || s.artist?.username || (typeof s.artist === 'string' ? s.artist : 'Artiste inconnu'),
                album: s.album?.title || s.album?.name || s.album || '—',
                duration: s.duration || 180,
                cover: s.cover || s.coverImage || s.album?.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop`,
                audioUrl: s.audioUrl || (s.externalId ? `http://localhost:5000/uploads/audio/${s.externalId}.mp3` : null),
                dateAdded: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
                isLiked: true
              };
            }
            
            // For internal songs
            const songId = s._id || s.id;
            console.log('🔄 Song ID (update):', songId, 'Original song:', s);
            
            return {
              id: songId,
              _id: songId,
              title: s.title || 'Titre inconnu',
              artist: s.artist?.name || s.artist?.username || (typeof s.artist === 'string' ? s.artist : 'Artiste inconnu'),
              album: s.album?.title || s.album?.name || s.album || '—',
              duration: s.duration || 180,
              cover: s.cover || s.coverImage || s.album?.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop',
              audioUrl: s.audioUrl || (songId ? `http://localhost:5000/uploads/audio/${songId}.mp3` : null),
              dateAdded: s.createdAt ? new Date(s.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              isLiked: true
            };
          });

          console.log('🔄 Final processed results (update):', results);
          console.log('🔄 Results length (update):', results.length);
          console.log('🔄 First result (update):', results[0]);
          setLikedSongs(results);
          setIsLoading(false);
        } catch (error) {
          console.error('Erreur lors du rechargement des musiques likées:', error);
          setIsLoading(false);
        }
      };

      loadLikedSongs();
    }
  }, [likedTracks.length]); // تحديث عند تغيير عدد الأغاني المفضلة فقط

  // تحديث تلقائي عند إضافة أو إزالة أغنية من المفضلة
  // تم إزالة useEffect للـ storage لأنه يسبب التحديث المزدوج

  // Sort songs based on selected criteria
  const sortedSongs = [...likedSongs].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'artist':
        return (a.artist || '').localeCompare(b.artist || '');
      case 'duration':
        return (a.duration || 0) - (b.duration || 0);
      case 'dateAdded':
      default:
        // Ensure dateAdded is a valid date string
        const dateA = a.dateAdded ? new Date(a.dateAdded) : new Date(0);
        const dateB = b.dateAdded ? new Date(b.dateAdded) : new Date(0);
        return dateB.getTime() - dateA.getTime();
    }
  });
  
  // Debug: Log sorted songs
  useEffect(() => {
    console.log('🔄 Sorted songs by', sortBy, ':', sortedSongs.slice(0, 3));
  }, [sortedSongs, sortBy]);

  const handlePlayAll = () => {
    console.log('🎵 handlePlayAll called with likedSongs:', likedSongs);
    console.log('🎵 likedSongs length:', likedSongs.length);
    if (likedSongs.length > 0) {
      console.log('🎵 First song for playback:', likedSongs[0]);
      // Jouer la première chanson et ajouter le reste à la queue
      playTrack(likedSongs[0]);
      likedSongs.slice(1).forEach(song => addToQueue(song));
      toast.success(`Lecture de ${likedSongs.length} chansons`);
    }
  };

  const handleShuffle = () => {
    console.log('🎵 handleShuffle called with likedSongs:', likedSongs);
    console.log('🎵 likedSongs length:', likedSongs.length);
    if (likedSongs.length > 0) {
      // Mélanger les chansons et jouer la première
      const shuffledSongs = [...likedSongs].sort(() => Math.random() - 0.5);
      console.log('🎵 First shuffled song for playback:', shuffledSongs[0]);
      playTrack(shuffledSongs[0]);
      shuffledSongs.slice(1).forEach(song => addToQueue(song));
      toast.success(`Lecture aléatoire de ${likedSongs.length} chansons`);
    }
  };

  const handlePlaySong = (song) => {
    console.log('🎵 handlePlaySong called with:', song);
    console.log('🎵 Song details:', {
      id: song.id,
      _id: song._id,
      title: song.title,
      artist: song.artist,
      audioUrl: song.audioUrl,
      cover: song.cover
    });
    playTrack(song);
    toast.success(`Lecture de "${song.title || 'cette chanson'}"`);
  };

  const handleAddToQueue = (song) => {
    addToQueue(song);
    toast.success(`"${song.title}" ajoutée à la file d'attente`);
  };

  const handleRemoveFromLiked = async (songId) => {
    try {
      console.log('🔄 Removing song from liked:', songId);
      // Mettre à jour le contexte (source de vérité)
      await toggleLike(songId);
      
      toast.success('Retiré des favoris');
      console.log(`Musique ${songId} retirée des favoris`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression des favoris');
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-48 md:pb-32">
      {/* Header avec bouton retour seulement - Style Spotify */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="px-6 py-4">
          <button 
            onClick={() => window.history.back()}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Bannière des chansons aimées - Style Spotify exact */}
      <div className="relative h-96">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
        <img
          src={likedSongs.length > 0 && likedSongs[0].cover 
            ? likedSongs[0].cover 
            : `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop&crop=center`}
          alt="Chansons aimées"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop&crop=center`;
          }}
        />
        
        {/* Badge Chansons aimées - Style Spotify */}
        <div className="absolute top-6 left-6 flex items-center space-x-2 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <Heart className="h-4 w-4 text-white" fill="white" />
          <span className="text-xs font-medium text-white">Chansons aimées</span>
        </div>

        {/* Informations des chansons aimées - Style Spotify */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-6xl font-black text-white mb-4">
            Chansons aimées
          </h1>
          <p className="text-gray-300 text-lg mb-2">
            {likedSongs.length} chanson{likedSongs.length > 1 ? 's' : ''} • {formatDuration(likedSongs.reduce((total, song) => total + song.duration, 0))}
          </p>
          <p className="text-gray-300 text-sm max-w-2xl line-clamp-2">
            Une collection de vos chansons préférées soigneusement sélectionnées.
          </p>
        </div>
      </div>

      {/* Actions (favori comme Spotify) */}
      <div className="px-6 pt-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayAll}
            className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            aria-label="Ajouter aux favoris"
            title="Ajouter aux favoris"
          >
            <Heart className="h-5 w-5" fill="currentColor" />
          </button>
          
          {/* Bouton Mélanger */}
          <button
            onClick={handleShuffle}
            className="px-4 py-3 rounded-full transition-colors bg-green-500 text-black font-medium hover:bg-green-400"
            aria-label="Mélanger"
            title="Mélanger"
          >
            Mélanger
          </button>
          
          <button className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700" aria-label="Partager">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17V7h2v7.17l3.59-3.59L17 10l-5 5z"/>
            </svg>
          </button>
          <button className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700" aria-label="Plus d'options">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Bouton de lecture principal - Style Spotify exact */}
      <div className="px-6 pt-4">
        <button
          onClick={handlePlayAll}
          className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-xl hover:scale-105 hover:bg-green-400 transition-all duration-200"
          aria-label="Lecture des chansons aimées"
        >
          <Play className="h-8 w-8 text-black ml-1" />
        </button>
      </div>

      {/* Logo de l'app */}
      <div className="px-6 pt-3">
        <div className="flex items-center space-x-2">
          <img src="/icons/LogoS.svg" alt="SoundWave" className="w-6 h-6" />
          <span className="text-gray-400 text-sm">SoundWave</span>
        </div>
      </div>

      {/* Description des chansons aimées - Style Spotify */}
      <div className="px-6 pt-2">
        <p className="text-gray-300 text-sm leading-relaxed">
          Une collection de {likedSongs.length} chansons que vous avez aimées, soigneusement organisées pour votre plaisir d'écoute.
        </p>
      </div>

      {/* Statistiques des chansons aimées - Style Spotify */}
      <div className="px-6 pt-4">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              {Math.floor(Math.random() * 50000 + 10000).toLocaleString('fr-FR')} auditeurs
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Music className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              {likedSongs.length} titres
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              {formatDuration(likedSongs.reduce((total, song) => total + song.duration, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Section Chansons aimées - Style Spotify exact */}
      <div className="px-6 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Toutes les chansons</h2>
            <div className="flex items-center space-x-2">
              <label className="text-gray-400 text-sm">Trier par:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="dateAdded">Date d'ajout</option>
                <option value="title">Titre</option>
                <option value="artist">Artiste</option>
                <option value="duration">Durée</option>
              </select>
            </div>
          </div>
          
          {likedSongs.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Aucune chanson aimée</h3>
              <p className="text-gray-400">Likez des chansons pour les voir ici</p>
            </div>
          ) : (
            <>
              {/* Liste compacte mobile comme Spotify */}
              <div className="md:hidden divide-y divide-gray-800 rounded-lg overflow-hidden bg-transparent">
                {sortedSongs.map((song, index) => (
                  <div key={song.id} className="flex items-center px-3 py-3 hover:bg-gray-800/50 transition-colors">
                    <span className="w-6 text-gray-400 mr-3 text-sm font-medium">{index + 1}</span>
                    <div className="w-12 h-12 rounded bg-gray-800 overflow-hidden mr-3 flex-shrink-0">
                      <img 
                        src={song.cover || song.coverImage || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop`} 
                        alt={song.title || 'Song cover'} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop`;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{song.title}</div>
                      <div className="text-gray-400 text-xs truncate">{song.artist}</div>
                    </div>
                    <div className="ml-3 flex items-center space-x-3">
                      <button onClick={() => handlePlaySong(song)} className="text-gray-300 hover:text-white transition-colors">
                        <Play className="h-4 w-4" />
                      </button>
                      <button onClick={() => handlePlaySong(song)} className="w-8 h-8 rounded-full bg-green-500 text-black flex items-center justify-center hover:scale-105 transition-transform">
                        <Play className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Liste desktop actuelle */}
              <div className="hidden md:block space-y-1">
                {sortedSongs.map((song, index) => (
                  <div 
                    key={song.id} 
                    className="group flex items-center p-4 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors font-medium flex-shrink-0 mr-8">
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex-shrink-0 mr-12">
                      <img 
                        src={song.cover || song.coverImage || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop`} 
                        alt={song.title || 'Song cover'} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop`;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 mr-8">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white truncate">{song.title}</h3>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                    </div>
                    <div className="flex items-center space-x-8 text-sm text-gray-400 flex-shrink-0">
                      <span className="hidden lg:block w-24 text-right mr-8">{song.album}</span>
                      <span className="w-16 text-right mr-8">{formatDuration(song.duration)}</span>
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); handlePlaySong(song); }} className="p-2 rounded-full bg-green-500 hover:bg-green-400 transition-colors">
                          <Play className="h-4 w-4 text-black ml-0.5" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleAddToQueue(song); }} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                          <Music2 className="h-4 w-4 text-white" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleRemoveFromLiked(song.id); }} className="p-2 rounded-full bg-red-500 hover:bg-red-400 transition-colors">
                          <Heart className="h-4 w-4 text-white" fill="currentColor" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LikedSongs;
