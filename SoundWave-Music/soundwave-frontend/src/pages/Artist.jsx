import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Heart, 
  MoreHorizontal, 
  ArrowLeft,
  Clock,
  Music2,
  Users,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useMusic } from '../store/MusicContext';
import { useDeezer } from '../store/DeezerContext';
import toast from 'react-hot-toast';

const Artist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { playTrack, addToQueue, toggleLike, likedTracks } = useMusic();
  const { popularArtists, loading: deezerLoading, service } = useDeezer();
  
  const [artist, setArtist] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [topTracks, setTopTracks] = useState([]);
  const [tracksLoading, setTracksLoading] = useState(false);

  // Format mm:ss
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Charger infos artiste (depuis cache popularArtists sinon API) + top tracks
  useEffect(() => {
    const loadArtist = async () => {
      if (!id) return;
      try {
        // 1) Infos artiste
        let found = popularArtists?.find(a => String(a.id) === String(id));
        if (!found) {
          const result = await service.getArtist(id);
          found = result?.data || result; // selon service
        }
        if (found) setArtist(found);

        // 2) Top tracks
        setTracksLoading(true);
        const top = await service.getArtistTopTracks(id);
        const deezerData = top?.data?.data || top?.data || top || [];
        const mapped = (deezerData || []).map(t => ({
          id: t.id,
          title: t.title,
          album: t.album?.title || '',
          duration: formatDuration(t.duration),
          rawDuration: t.duration || 0,
          plays: t.rank ? t.rank.toLocaleString('fr-FR') : '',
          cover: t.album?.cover_medium || t.album?.cover || artist?.picture || artist?.cover,
          preview: t.preview || null,
          explicit: !!t.explicit_lyrics,
          artistName: t.artist?.name || found?.name || 'Artiste inconnu'
        }));
        setTopTracks(mapped);
      } catch (e) {
        console.error('Erreur chargement artiste/top tracks:', e);
        toast.error("Impossible de charger les titres de l'artiste");
      } finally {
        setTracksLoading(false);
      }
    };

    loadArtist();
  }, [id, popularArtists, service]);

  const handlePlaySong = (track) => {
    if (!track?.preview) {
      toast.error("Aperçu non disponible pour cette piste");
      return;
    }
    const song = {
      _id: track.id,
      title: track.title,
      artist: track.artistName || artist?.name || 'Artiste inconnu',
      cover: track.cover,
      album: track.album,
      duration: track.rawDuration,
      audioUrl: track.preview,
      isDeezer: true
    };
    playTrack(song);
    setIsPlaying(true);
    toast.success(`Lecture de ${track.title}`);
  };

  const handleAddToQueue = (track) => {
    if (!track?.preview) {
      toast.error("Aperçu non disponible pour cette piste");
      return;
    }
    const song = {
      _id: track.id,
      title: track.title,
      artist: track.artistName || artist?.name || 'Artiste inconnu',
      cover: track.cover,
      album: track.album,
      duration: track.rawDuration,
      audioUrl: track.preview,
      isDeezer: true
    };
    addToQueue(song);
    toast.success('Ajouté à la file d\'attente');
  };

  const handleToggleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? 'Désabonné' : 'Abonné');
  };

  const handlePlayArtist = () => {
    if (topTracks.length > 0) {
      handlePlaySong(topTracks[0]);
    } else {
      toast.error("Pas de titres disponibles pour cet artiste");
    }
  };

  if (deezerLoading || !artist) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Chargement de l'artiste...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Header avec bouton retour */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="px-6 py-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Bannière de l'artiste */}
      <div className="relative h-96">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
        <img
          src={artist.picture || artist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop&crop=center`}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badge Artiste vérifié */}
        <div className="absolute top-6 left-6 flex items-center space-x-2 bg-blue-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <CheckCircle className="h-4 w-4 text-white" />
          <span className="text-xs font-medium text-white">Artiste vérifié</span>
        </div>

        {/* Informations de l'artiste */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-5xl font-bold mb-2">{artist.name}</h1>
          <p className="text-gray-300 text-lg">{artist.nb_fan ? artist.nb_fan.toLocaleString('fr-FR') : '—'} auditeurs mensuels</p>
        </div>
      </div>

      {/* Actions de l'artiste */}
      <div className="px-6 py-6">
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={handlePlayArtist}
            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-400 transition-colors shadow-2xl"
          >
            <Play className="h-8 w-8 text-black ml-1" />
          </button>
          
          <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
            <img
              src={artist.picture || artist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>

          <button 
            onClick={handleToggleFollow}
            className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
              isFollowing 
                ? 'bg-gray-800 text-white hover:bg-gray-700' 
                : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {isFollowing ? 'Abonné' : 'S\'abonner'}
          </button>

          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
            <MoreHorizontal className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Section Chansons populaires */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Populaires</h2>
          {tracksLoading ? (
            <div className="text-gray-400">Chargement des titres…</div>
          ) : (
            <div className="space-y-2">
              {topTracks.map((track) => (
                <div 
                  key={track.id} 
                  className="group flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-white truncate">{track.title}</h3>
                      {track.explicit && (
                        <span className="bg-gray-700 text-white text-xs px-1 py-0.5 rounded">E</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">{track.album}</p>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    {track.plays && <span className="hidden md:block">{track.plays}</span>}
                    <span>{track.duration}</span>
                    
                    {/* Boutons d'action - visibles au survol */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySong(track);
                        }}
                        className="p-2 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
                      >
                        <Play className="h-4 w-4 text-black ml-0.5" />
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToQueue(track);
                        }}
                        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                      >
                        <Music2 className="h-4 w-4 text-white" />
                      </button>
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(track.id);
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          likedTracks.includes(track.id) 
                            ? 'bg-red-500 hover:bg-red-400' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${
                          likedTracks.includes(track.id) ? 'text-white fill-white' : 'text-white'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {topTracks.length === 0 && (
                <div className="text-gray-400">Aucun titre disponible.</div>
              )}
            </div>
          )}
        </div>

        {/* Section Albums (placeholder visuel) */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((album) => (
              <div key={album} className="group cursor-pointer">
                <div className="relative mb-3">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25">
                    <img
                      src={`https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=${album}`}
                      alt={`Album ${album}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Bouton play - Style Spotify */}
                  <button 
                    onClick={() => handlePlaySong({ id: album, title: `Album ${album}`, preview: null })}
                    className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl"
                  >
                    <Play className="h-6 w-6 text-black ml-0.5" />
                  </button>
                </div>
                
                <h3 className="font-bold text-sm mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                  Album {album}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {artist.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artist; 