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
  CheckCircle,
  Plus,
  ChevronRight,
  ChevronDown,
  Mail,
  Music,
  MapPin,
  Disc,
  Calendar,
  Phone
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
  const [relatedArtists, setRelatedArtists] = useState([]);
  const [activeTab, setActiveTab] = useState('popular');
  const [displayedTracks, setDisplayedTracks] = useState(5); // Nombre de pistes affichées
  const [albums, setAlbums] = useState([]);
  const [albumsLoading, setAlbumsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('popular'); // Filtre actif pour la discographie
  const [showMoreInfo, setShowMoreInfo] = useState(false); // State for "Plus d'infos" expanded view

  // Format mm:ss
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Charger infos artiste + top tracks + artistes similaires
  useEffect(() => {
    const loadArtist = async () => {
      if (!id) return;
      try {
        // 1) Infos artiste
        let found = popularArtists?.find(a => String(a.id) === String(id));
        if (!found) {
          const result = await service.getArtist(id);
          found = result?.data || result;
        }
        if (found) setArtist(found);

        // 2) Top tracks
        setTracksLoading(true);
        const top = await service.getArtistTopTracks(id, 50); // Demander 50 pistes au lieu de la limite par défaut
        const deezerData = top?.data?.data || top?.data || top || [];
        console.log('Deezer API response for artist top tracks:', top);
        console.log('Number of tracks received:', deezerData.length);
        
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
        
        console.log('Final mapped tracks:', mapped.length);
        setTopTracks(mapped);

        // 3) Albums de l'artiste
        setAlbumsLoading(true);
        try {
          const albumsResponse = await service.getArtistAlbums(id);
          const albumsData = albumsResponse?.data?.data || albumsResponse?.data || albumsResponse || [];
          console.log('Raw albums response:', albumsResponse);
          console.log('Albums data from API:', albumsData);
          
          if (albumsData.length === 0) {
            console.log('No albums from API, using fallback');
            throw new Error('No albums from API');
          }
          
          const mappedAlbums = albumsData.map(album => ({
            id: album.id,
            title: album.title,
            type: album.record_type || 'Album',
            year: new Date(album.release_date).getFullYear(),
            cover: album.cover_medium || album.cover,
            tracks: album.nb_tracks || 0,
            explicit: !!album.explicit_lyrics
          }));
          setAlbums(mappedAlbums);
          console.log('Albums loaded from API:', mappedAlbums.length);
          console.log('Album types from API:', mappedAlbums.map(a => a.type));
        } catch (albumError) {
          console.error('Erreur chargement albums:', albumError);
          console.log('Using fallback albums due to API error');
          // Fallback avec des albums fictifs si l'API échoue
          const fallbackAlbums = [
            { id: '1', title: 'DARIJA', type: 'Single', year: '2024', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=1', tracks: 1, explicit: false },
            { id: '2', title: 'ICEBERG', type: 'Album', year: '2024', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=2', tracks: 12, explicit: false },
            { id: '3', title: 'OMEGA', type: 'EP', year: '2025', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=3', tracks: 6, explicit: true },
            { id: '4', title: 'Mizane', type: 'Single', year: '2021', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=4', tracks: 1, explicit: false },
            { id: '5', title: 'Jackpot', type: 'Album', year: '2021', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=5', tracks: 15, explicit: true },
            { id: '6', title: 'Si tu savais', type: 'Single', year: '2020', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=6', tracks: 1, explicit: false },
            { id: '7', title: 'MARADONA (Remix)', type: 'Single', year: '2024', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=7', tracks: 1, explicit: false },
            { id: '8', title: 'SALINA', type: 'Single', year: '2024', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=8', tracks: 1, explicit: true },
            { id: '9', title: 'killa', type: 'Single', year: '2024', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=9', tracks: 1, explicit: false },
            { id: '10', title: 'NIKEY', type: 'Single', year: '2024', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=10', tracks: 1, explicit: false },
            { id: '11', title: 'KHOYA', type: 'Single', year: '2024', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=11', tracks: 1, explicit: false },
            { id: '12', title: 'RALLY DAKAR', type: 'Single', year: '2024', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=12', tracks: 1, explicit: false },
            { id: '13', title: 'ELVIS', type: 'Single', year: '2024', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=13', tracks: 1, explicit: false },
            { id: '14', title: 'POPO', type: 'Single', year: '2024', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=14', tracks: 1, explicit: false },
            { id: '15', title: 'Fawda', type: 'Single', year: '2024', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=15', tracks: 1, explicit: true },
            { id: '16', title: 'Moroccan Dream', type: 'Album', year: '2023', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=16', tracks: 18, explicit: false },
            { id: '17', title: 'Urban Vibes', type: 'EP', year: '2023', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=17', tracks: 8, explicit: true },
            { id: '18', title: 'Street Poetry', type: 'Album', year: '2022', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=18', tracks: 14, explicit: false },
            { id: '19', title: 'Colors', type: 'Album', year: '2021', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=19', tracks: 16, explicit: false },
            { id: '20', title: 'VENOM', type: 'Album', year: '2022', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=20', tracks: 13, explicit: true },
            { id: '21', title: 'BALA W FAS', type: 'Album', year: '2025', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=21', tracks: 20, explicit: false },
            { id: '22', title: 'Ghandirha', type: 'Single', year: '2020', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=22', tracks: 1, explicit: false },
            { id: '23', title: '6 Fi9', type: 'Single', year: '2023', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=23', tracks: 1, explicit: true }
          ];
          setAlbums(fallbackAlbums);
          console.log('Using fallback albums:', fallbackAlbums.length);
          console.log('Fallback album types:', fallbackAlbums.map(a => a.type));
          console.log('Albums count in fallback:', fallbackAlbums.filter(a => a.type === 'Album').length);
        } finally {
          setAlbumsLoading(false);
        }

        // 4) Artistes similaires (simulation avec des artistes populaires)
        if (popularArtists.length > 0) {
          const similar = popularArtists
            .filter(a => a.id !== found?.id)
            .slice(0, 6)
            .map(a => ({
              id: a.id,
              name: a.name,
              picture: a.picture || a.cover,
              nb_fan: a.nb_fan
            }));
          setRelatedArtists(similar);
        }

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
    }
  };

  const handleShowMore = () => {
    // Afficher 10 pistes de plus, ou toutes si moins de 10 restent
    const remaining = topTracks.length - displayedTracks;
    if (remaining <= 10) {
      setDisplayedTracks(topTracks.length); // Afficher toutes les pistes
    } else {
      setDisplayedTracks(prev => prev + 10); // Afficher 10 de plus
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
    <div className="min-h-screen bg-black text-white pb-48 md:pb-32">
      {/* Header avec bouton retour seulement - Style Spotify */}
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

      {/* Bannière de l'artiste - Style Spotify exact */}
      <div className="relative h-96">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
        <img
          src={artist.picture || artist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop&crop=center`}
          alt={artist.name}
          className="w-full h-full object-cover"
        />
        
        {/* Badge Artiste vérifié - Style Spotify */}
        <div className="absolute top-6 left-6 flex items-center space-x-2 bg-blue-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <CheckCircle className="h-4 w-4 text-white" />
          <span className="text-xs font-medium text-white">Artiste vérifié</span>
        </div>

        {/* Informations de l'artiste - Style Spotify */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-5xl font-bold mb-2">{artist.name}</h1>
          <p className="text-gray-300 text-lg">
            {artist.nb_fan ? artist.nb_fan.toLocaleString('fr-FR') : '—'} auditeurs mensuels
          </p>
        </div>
      </div>

      {/* Actions (favori comme Spotify) */}
      <div className="px-6 pt-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleToggleFollow}
            className={`p-3 rounded-full transition-colors ${
              isFollowing ? 'bg-green-500 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            aria-label={isFollowing ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            title={isFollowing ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={`h-5 w-5 ${isFollowing ? 'fill-current' : ''}`} />
          </button>
          <button className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700" aria-label="Partager">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17V7h2v7.17l3.59-3.59L17 10l-5 5z"/>
            </svg>
          </button>
          <button className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700" aria-label="Plus d'options">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Bouton de lecture principal - Style Spotify exact */}
      <div className="px-6 pt-4">
        <button
          onClick={handlePlayArtist}
          className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-xl hover:scale-105 hover:bg-green-400 transition-all duration-200"
          aria-label="Lecture aléatoire"
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

      {/* Description de l'artiste - Style Spotify */}
      <div className="px-6 pt-2">
        <p className="text-gray-300 text-sm leading-relaxed">
          {artist.name} est un artiste urbain marocain qui mélange avec brio le rap traditionnel et les sonorités modernes. 
          Ses textes percutants et ses mélodies entraînantes ont conquis des millions d'auditeurs à travers le monde.
        </p>
      </div>

      {/* Statistiques de l'artiste - Style Spotify */}
      <div className="px-6 pt-4">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              {artist.nb_fan ? artist.nb_fan.toLocaleString('fr-FR') : '944 008'} auditeurs mensuels
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Music className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              {topTracks.length} titres populaires
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Disc className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              {albums.length} albums
            </span>
          </div>
        </div>
      </div>

      {/* Section Chansons populaires - Style Spotify exact avec numérotation 1-5 */}
      <div className="px-6 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Populaires</h2>
          {tracksLoading ? (
            <div className="text-gray-400">Chargement des titres…</div>
          ) : (
            <>
              {/* Liste compacte mobile comme Spotify */}
              <div className="md:hidden divide-y divide-gray-800 rounded-lg overflow-hidden bg-transparent">
                {topTracks.slice(0, displayedTracks).map((track, index) => (
                  <div key={track.id} className="flex items-center px-3 py-3 hover:bg-gray-800/50 transition-colors">
                    <span className="w-6 text-gray-400 mr-3 text-sm font-medium">{index + 1}</span>
                    <div className="w-12 h-12 rounded bg-gray-800 overflow-hidden mr-3 flex-shrink-0">
                      <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{track.title}</div>
                      <div className="text-gray-400 text-xs truncate">{track.album}</div>
                    </div>
                    <div className="ml-3 flex items-center space-x-3">
                      <button onClick={() => toggleLike(track.id)} className="text-gray-300 hover:text-white transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                      <button onClick={() => handlePlaySong(track)} className="w-8 h-8 rounded-full bg-green-500 text-black flex items-center justify-center hover:scale-105 transition-transform">
                        <Play className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Liste desktop actuelle */}
              <div className="hidden md:block space-y-1">
                {topTracks.slice(0, displayedTracks).map((track, index) => (
                  <div 
                    key={track.id} 
                    className="group flex items-center p-4 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors font-medium flex-shrink-0 mr-8">
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex-shrink-0 mr-12">
                      <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 mr-8">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white truncate">{track.title}</h3>
                        {track.explicit && (<span className="bg-gray-700 text-white text-xs px-1 py-0.5 rounded">E</span>)}
                      </div>
                      <p className="text-sm text-gray-400 truncate">{track.album}</p>
                    </div>
                    <div className="flex items-center space-x-8 text-sm text-gray-400 flex-shrink-0">
                      <span className="hidden lg:block w-24 text-right mr-8">{track.plays || '—'}</span>
                      <span className="w-16 text-right mr-8">{track.duration}</span>
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); handlePlaySong(track); }} className="p-2 rounded-full bg-green-500 hover:bg-green-400 transition-colors">
                          <Play className="h-4 w-4 text-black ml-0.5" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleAddToQueue(track); }} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                          <Music2 className="h-4 w-4 text-white" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }} className={`p-2 rounded-full transition-colors ${likedTracks.includes(track.id) ? 'bg-red-500 hover:bg-red-400' : 'bg-gray-700 hover:bg-gray-600'}`}>
                          <Heart className={`h-4 w-4 ${likedTracks.includes(track.id) ? 'text-white fill-white' : 'text-white'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {topTracks.length === 0 && (<div className="text-gray-400">Aucun titre disponible.</div>)}
              {topTracks.length > displayedTracks && (
                <button onClick={handleShowMore} className="text-gray-400 hover:text-white text-sm font-medium mt-4 px-4 py-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200 flex items-center space-x-2">
                  <span>Afficher plus</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Section Discographie - Style Spotify exact */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Discographie</h2>
          
          {/* Tabs - Style Spotify */}
          <div className="flex space-x-8 mb-6 border-b border-gray-800">
            {[
              { key: 'popular', label: 'Sorties populaires' },
              { key: 'albums', label: 'Albums' },
              { key: 'singles', label: 'Singles et EP' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`pb-2 font-medium transition-colors ${
                  activeFilter === tab.key
                    ? 'text-white border-b-2 border-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Albums/Releases - Style Spotify avec scroll horizontal */}
          {albumsLoading ? (
            <div className="text-gray-400">Chargement des albums...</div>
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {(() => {
                const filteredAlbums = albums.filter(album => {
                  const shouldInclude = (() => {
                    switch (activeFilter) {
                      case 'popular':
                        return true; // Tous les albums
                      case 'albums':
                        return album.type === 'Album';
                      case 'singles':
                        return album.type === 'Single' || album.type === 'EP';
                      default:
                        return true;
                    }
                  })();
                  
                  console.log(`Album "${album.title}" (type: ${album.type}) - Filter: ${activeFilter} - Include: ${shouldInclude}`);
                  return shouldInclude;
                });
                
                console.log('=== FILTER DEBUG ===');
                console.log('Active filter:', activeFilter);
                console.log('Total albums:', albums.length);
                console.log('Filtered albums:', filteredAlbums.length);
                console.log('All album types:', albums.map(a => a.type));
                console.log('Filtered album types:', filteredAlbums.map(a => a.type));
                console.log('Albums count by type:', {
                  'Album': albums.filter(a => a.type === 'Album').length,
                  'Single': albums.filter(a => a.type === 'Single').length,
                  'EP': albums.filter(a => a.type === 'EP').length
                });
                console.log('=== END FILTER DEBUG ===');
                
                if (filteredAlbums.length === 0) {
                  return (
                    <div className="w-full text-center py-8">
                      <p className="text-gray-400 text-lg">
                        {activeFilter === 'albums' && 'Aucun album trouvé'}
                        {activeFilter === 'singles' && 'Aucun single ou EP trouvé'}
                        {activeFilter === 'popular' && 'Aucun album trouvé'}
                      </p>
                    </div>
                  );
                }
                
                return filteredAlbums.map((album, index) => (
                  <div key={album.id} className="flex-shrink-0 w-48 group cursor-pointer">
                    <div className="relative mb-3">
                      <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25">
                        <img
                          src={album.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=${index + 1}`}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Bouton play - Style Spotify */}
                      <button 
                        onClick={() => handlePlaySong({ id: album.id, title: album.title, preview: null })}
                        className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl"
                      >
                        <Play className="h-6 w-6 text-black ml-0.5" />
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-sm mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                      {album.title}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {album.year} • {album.type}
                    </p>
                  </div>
                ));
              })()}
            </div>
          )}
          
          {albums.length > 0 && (
            <button className="text-gray-400 hover:text-white text-sm font-medium mt-4 flex items-center">
              Tout afficher <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>

        {/* Section "Avec [nom]" - Style Spotify */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Avec {artist.name}</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { 
                id: '1',
                title: `This Is ${artist.name}`, 
                subtitle: `${artist.name}. Les titres incontournables, réunis...`, 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=80',
                type: 'Playlist'
              },
              { 
                id: '2',
                title: `Radio ${artist.name}`, 
                subtitle: 'Avec Inkonnu, Shaw, Snor et bien d\'autres...', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=81',
                type: 'Playlist'
              },
              { 
                id: '3',
                title: 'Hit Maghribi', 
                subtitle: 'From Morocco to the world. Cover: 7ari,..', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=82',
                type: 'Playlist'
              },
              { 
                id: '4',
                title: 'ABATERA', 
                subtitle: `Cover: ${artist.name}`, 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=83',
                type: 'Playlist'
              },
              { 
                id: '5',
                title: 'Hot Hits Morocco', 
                subtitle: 'Les hits du moment. Cover: TIF, ElGrandeToto', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=84',
                type: 'Playlist'
              },
              { 
                id: '6',
                title: 'SEHD', 
                subtitle: 'Vibrez au rythme des morceaux urbains et Af..', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=85',
                type: 'Playlist'
              },
              { 
                id: '7',
                title: 'Moroccan Rap Essentials', 
                subtitle: 'Les titres cultes du Hip-Hop Marocain...', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=86',
                type: 'Playlist'
              },
              { 
                id: '8',
                title: 'Urban Vibes Morocco', 
                subtitle: 'Le meilleur du rap urbain marocain...', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=87',
                type: 'Playlist'
              }
            ].map((playlist, index) => (
              <div key={playlist.id} className="flex-shrink-0 w-48 group cursor-pointer">
                <div className="relative mb-3">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25">
                    <img
                      src={playlist.cover}
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <button className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl">
                    <Play className="h-6 w-6 text-black ml-0.5" />
                  </button>
                </div>
                
                <h3 className="font-bold text-sm mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                  {playlist.title}
                </h3>
                <p className="text-sm text-gray-400 truncate leading-tight">
                  {playlist.subtitle}
                </p>
              </div>
            ))}
          </div>
          
          <button className="text-gray-400 hover:text-white text-sm font-medium mt-4 flex items-center">
            Tout afficher <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* Section "Plus d'infos" - Style Spotify amélioré */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Plus d'infos</h2>
          
          {/* Carte principale améliorée - Style Spotify */}
          <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group" onClick={() => setShowMoreInfo(!showMoreInfo)}>
            <div className="flex items-start space-x-16">
              {/* Image circulaire plus grande - Style amélioré */}
              <div className="w-40 h-40 bg-white rounded-full overflow-hidden flex-shrink-0 shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <img
                  src={artist.picture || artist.cover || `https://picsum.photos/400/400?random=artist`}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Informations améliorées */}
              <div className="flex-1 ml-8">
                <h3 className="text-4xl font-bold mb-8 text-white group-hover:text-blue-400 transition-colors duration-300">{artist.name}</h3>
                <p className="text-gray-300 text-xl mb-8">
                  {artist.nb_fan ? artist.nb_fan.toLocaleString('fr-FR') : '944 008'} auditeurs mensuels
                </p>
                
                {/* Indicateur pour plus d'infos */}
                <div className="flex items-center space-x-3 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                  <span className="text-sm font-medium">
                    {showMoreInfo ? 'Masquer les détails' : 'Cliquer pour plus d\'infos'}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showMoreInfo ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>
            
            {/* Informations détaillées - Affichage conditionnel */}
            {showMoreInfo && (
              <div className="mt-10 pt-8 border-t border-gray-700/50 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Mail className="w-6 h-6 text-blue-400" />
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">Contact Business</p>
                        <p className="text-white text-base">contact@{artist.name?.toLowerCase()}.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Music className="w-6 h-6 text-green-400" />
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">Genre Principal</p>
                        <p className="text-white text-base">Hip-Hop, Rap, Urban</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <MapPin className="w-6 h-6 text-red-400" />
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">Localisation</p>
                        <p className="text-white text-base">Morocco</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Disc className="w-6 h-6 text-purple-400" />
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">Label</p>
                        <p className="text-white text-base">Independent</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Calendar className="w-6 h-6 text-yellow-400" />
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">Début de carrière</p>
                        <p className="text-white text-base">2018</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Users className="w-6 h-6 text-pink-400" />
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-1">Collaborations</p>
                        <p className="text-white text-base">Inkonnu, Shaw, Snor</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section "Découvert sur" - Style Spotify amélioré */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Découvert sur</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {[
              { 
                title: 'Ek Tha Raja', 
                subtitle: '2024 • Album', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=60',
                type: 'Album'
              },
              { 
                title: 'ICEBERG', 
                subtitle: '2024 • Album', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=61',
                type: 'Album'
              },
              { 
                title: '101', 
                subtitle: '2025 • Album', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=62',
                type: 'Album'
              },
              { 
                title: 'Hybrid', 
                subtitle: '2024 • Album', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=63',
                type: 'Album',
                explicit: true
              },
              { 
                title: 'PIZZA KEBAB Vol. 1', 
                subtitle: '2023 • Album', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=64',
                type: 'Album',
                explicit: true
              },
              { 
                title: 'Moroccan Dream', 
                subtitle: '2020 • Album', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=65',
                type: 'Album'
              },
              { 
                title: 'Urban Vibes', 
                subtitle: '2023 • EP', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=66',
                type: 'EP'
              },
              { 
                title: 'Street Poetry', 
                subtitle: '2022 • Album', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=67',
                type: 'Album'
              }
            ].map((release, index) => (
              <div key={index} className="flex-shrink-0 w-48 group cursor-pointer">
                <div className="relative mb-3">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25">
                    <img
                      src={release.cover}
                      alt={release.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badge Explicit si nécessaire */}
                    {release.explicit && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-medium">
                        E
                      </div>
                    )}
                  </div>
                  
                  {/* Bouton play - Style Spotify */}
                  <button className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl">
                    <Play className="h-6 w-6 text-black ml-0.5" />
                  </button>
                </div>
                
                <h3 className="font-bold text-sm mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                  {release.title}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {release.subtitle}
                </p>
              </div>
            ))}
          </div>
          
          <button className="text-gray-400 hover:text-white text-sm font-medium mt-4 flex items-center">
            Tout afficher <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* Section "Les fans aiment aussi" - Style Spotify avec vraies images */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Les fans aiment aussi</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {relatedArtists.map((relatedArtist, index) => (
              <div key={relatedArtist.id} className="flex-shrink-0 text-center group cursor-pointer">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full overflow-hidden mb-3 group-hover:border-2 group-hover:border-green-500 transition-all duration-300">
                  <img
                    src={relatedArtist.picture || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=${index + 30}`}
                    alt={relatedArtist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <h3 className="font-medium text-sm text-white group-hover:text-green-400 transition-colors">
                  {relatedArtist.name}
                </h3>
                <p className="text-xs text-gray-400">Artiste</p>
              </div>
            ))}
          </div>
          
          <button className="text-gray-400 hover:text-white text-sm font-medium mt-4 flex items-center">
            Tout afficher <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* Section "Playlists recommandées" - Style Spotify */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Playlists recommandées</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { 
                title: 'Moroccan Hip-Hop Mix', 
                subtitle: 'Le meilleur du rap marocain', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=90',
                type: 'Playlist'
              },
              { 
                title: 'Urban Morocco', 
                subtitle: 'Vibes urbaines du Maroc', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=91',
                type: 'Playlist'
              },
              { 
                title: 'Rap Essentials', 
                subtitle: 'Les classiques du rap', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=92',
                type: 'Playlist'
              },
              { 
                title: 'Moroccan Vibes', 
                subtitle: 'Culture et musique du Maroc', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=93',
                type: 'Playlist'
              }
            ].map((playlist, index) => (
              <div key={index} className="flex-shrink-0 w-48 group cursor-pointer">
                <div className="relative mb-3">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25">
                    <img
                      src={playlist.cover}
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <button className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl">
                    <Play className="h-6 w-6 text-black ml-0.5" />
                  </button>
                </div>
                
                <h3 className="font-bold text-sm mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                  {playlist.title}
                </h3>
                <p className="text-sm text-gray-400 truncate leading-tight">
                  {playlist.subtitle}
                </p>
              </div>
            ))}
          </div>
          
          <button className="text-gray-400 hover:text-white text-sm font-medium mt-4 flex items-center">
            Tout afficher <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* Section "Apparaît sur" - Style Spotify amélioré */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Apparaît sur</h2>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {[
              { 
                title: 'Colors', 
                year: '2021', 
                type: 'Album', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=70',
                artist: 'Various Artists'
              },
              { 
                title: 'Moroccan Dream', 
                year: '2020', 
                type: 'Album', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=71',
                artist: 'Morocco Collective'
              },
              { 
                title: 'VENOM', 
                year: '2022', 
                type: 'Album', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=72',
                artist: 'Urban Records'
              },
              { 
                title: 'BALA W FAS', 
                year: '2025', 
                type: 'Album', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=73',
                artist: 'Moroccan Vibes'
              },
              { 
                title: 'Ghandirha', 
                year: '2020', 
                type: 'Single', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=74',
                artist: 'Hip-Hop Morocco'
              },
              { 
                title: '6 Fi9', 
                year: '2023', 
                type: 'Single', 
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&v=75',
                artist: 'Urban Morocco'
              }
            ].map((release, index) => (
              <div key={index} className="flex-shrink-0 w-48 group cursor-pointer">
                <div className="relative mb-3">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 group-hover:border-green-500 transition-all duration-300">
                    <img
                      src={release.cover}
                      alt={release.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <button className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl">
                    <Play className="h-6 w-6 text-black ml-0.5" />
                  </button>
                </div>
                
                <h3 className="font-bold text-sm mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                  {release.title}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {release.artist} • {release.year} • {release.type}
                </p>
              </div>
            ))}
          </div>
          
          <button className="text-gray-400 hover:text-white text-sm font-medium mt-4 flex items-center">
            Tout afficher <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* Section finale - Informations supplémentaires */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Informations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 text-white">Biographie</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {artist.name} est né au Maroc et a commencé sa carrière musicale en 2018. 
                Il s'est fait connaître grâce à son style unique qui mélange le rap traditionnel 
                avec des influences modernes et internationales.
              </p>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 text-white">Récompenses</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Meilleur artiste urbain 2024</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Album de l'année - ICEBERG</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Révélation de l'année 2020</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section finale - Liens sociaux et contact */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Liens et contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 text-white">Réseaux sociaux</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">f</span>
                  </div>
                  <span>Facebook</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">t</span>
                  </div>
                  <span>Twitter</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">ig</span>
                  </div>
                  <span>Instagram</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 text-white">Contact professionnel</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-green-400" />
                  <span>contact@{artist.name?.toLowerCase()}.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-green-400" />
                  <span>+212 6 XX XX XX XX</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-green-400" />
                  <span>Casablanca, Maroc</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 text-white">Statistiques</h3>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex justify-between">
                  <span>Écoutes totales</span>
                  <span className="font-semibold">2.5M+</span>
                </div>
                <div className="flex justify-between">
                  <span>Abonnés</span>
                  <span className="font-semibold">150K+</span>
                </div>
                <div className="flex justify-between">
                  <span>Pays</span>
                  <span className="font-semibold">45+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        


      </div>
    </div>
  );
};

export default Artist; 