import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Play, 
  Heart, 
  Plus,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Clock,
  Music2,
  Radio,
  Mic,
  Headphones
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useMusic } from '../store/MusicContext';
import { useDeezer } from '../store/DeezerContext';
import { useSidebar } from '../store/SidebarContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Home = () => {
  const { user } = useAuth();
  const { playTrack, addToQueue, toggleLike, likedTracks } = useMusic();
  const { 
    newReleases, 
    featuredPlaylists, 
    popularAlbums, 
    popularArtists, 
    loading: deezerLoading, 
    error: deezerError 
  } = useDeezer();
  const { isSidebarOpen } = useSidebar();
  const navigate = useNavigate();
  
  const [currentFilter, setCurrentFilter] = useState('Tout');
  
  // Refs pour le défilement horizontal
  const radioScrollRef = useRef(null);
  const artistsScrollRef = useRef(null);
  const albumsScrollRef = useRef(null);
  const newReleasesScrollRef = useRef(null);

  useEffect(() => {
    console.log('🔍 Home - État des données Deezer:');
    console.log('📀 newReleases:', newReleases);
    console.log('🎵 featuredPlaylists:', featuredPlaylists);
    console.log('💿 popularAlbums:', popularAlbums);
    console.log('👤 popularArtists:', popularArtists);
    console.log('⏳ loading:', deezerLoading);
    console.log('❌ error:', deezerError);
  }, [newReleases, featuredPlaylists, popularAlbums, popularArtists, deezerLoading, deezerError]);

  // Debug sidebar state
  useEffect(() => {
    console.log('🏠 Home - État de la sidebar:', isSidebarOpen);
  }, [isSidebarOpen]);

  // Fonctions de défilement
  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handlePlaySong = (song) => {
    const deezerSong = {
      _id: song.id,
      title: song.title || song.name,
      artist: song.artist?.name || song.artists?.[0]?.name || 'Artiste inconnu',
      cover: song.cover || song.album?.cover || song.images?.[0]?.url,
      audioUrl: song.preview || song.preview_url,
      duration: song.duration || song.duration_ms,
      album: song.album?.title || song.album?.name,
      deezerId: song.id,
      isDeezer: true
    };
    
    playTrack(deezerSong);
    toast.success(`Lecture de ${deezerSong.title}`);
  };

  const handleArtistClick = (artist) => {
    navigate(`/artist/${artist.id}`);
  };

  const handleAddToQueue = (song) => {
    const deezerSong = {
      _id: song.id,
      title: song.title || song.name,
      artist: song.artist?.name || song.artists?.[0]?.name || 'Artiste inconnu',
      cover: song.cover || song.album?.cover || song.images?.[0]?.url,
      audioUrl: song.preview || song.preview_url,
      duration: song.duration || song.duration_ms,
      album: song.album?.title || song.album?.name,
      deezerId: song.id,
      isDeezer: true
    };
    
    addToQueue(deezerSong);
    toast.success('Ajouté à la file d\'attente');
  };

  const handleToggleLike = (songId) => {
    toggleLike(songId);
  };

  if (deezerLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Chargement de votre musique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white overflow-x-hidden transition-all duration-300 ${
      isSidebarOpen ? '' : 'lg:ml-0'
    }`}>
      {/* Header avec recherche - Design Spotify */}
      <div className="">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <TrendingUp className="h-5 w-5 text-gray-300" />
              </button>
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Clock className="h-5 w-5 text-gray-300" />
              </button>
            </div>
            
            {/* Barre de recherche supprimée - maintenant seulement dans le header principal */}
            
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Music2 className="h-5 w-5 text-gray-300" />
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">{user?.username?.charAt(0) || 'U'}</span>
              </div>
            </div>
          </div>

          {/* Filtres - Style Spotify */}
          <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
            {['Tout', 'Musique', 'Podcasts', 'Deezer'].map((filter) => (
              <button
                key={filter}
                onClick={() => setCurrentFilter(filter)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  currentFilter === filter
                    ? 'bg-white text-black shadow-lg scale-105'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal - Design Spotify */}
      <div className="space-y-10 pb-32" style={{ margin: 0, padding: 0, marginLeft: 0, marginRight: 0 }}>
        {/* Section Bienvenue - Style Spotify */}
        <section className="pt-8">
          <div className="px-6">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Bonjour, {user?.username || 'Utilisateur'} 🎵
            </h1>
            <p className="text-gray-400 text-xl">Découvrez la musique qui vous correspond sur SoundWave</p>
          </div>
        </section>

        {/* Section Radio populaire avec flèches - Design Spotify */}
        <section>
          <div className="px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white flex items-center">
                <Radio className="h-7 w-7 mr-3 text-green-500" />
                Radio populaire
              </h2>
              <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center hover:underline">
                Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            {/* Flèche gauche - Visible au survol */}
            <button 
              onClick={() => scrollLeft(radioScrollRef)}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
            >
              <ArrowLeft className="h-6 w-6 text-white" />
            </button>
            
            {/* Flèche droite - Visible au survol */}
            <button 
              onClick={() => scrollRight(radioScrollRef)}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
            >
              <ArrowRight className="h-6 w-6 text-white" />
            </button>
            
            {/* Grille des radios avec défilement horizontal */}
            <div 
              ref={radioScrollRef}
              className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {popularArtists.slice(0, 8).map((artist) => (
                <div 
                  key={artist.id} 
                  className="group cursor-pointer text-center flex-shrink-0 w-40"
                  onClick={() => handleArtistClick(artist)}
                >
                  <div className="relative mb-4">
                    <div className="w-40 h-40 mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25">
                      <img
                        src={artist.picture || artist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Bouton play - Style Spotify */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlaySong(artist);
                      }}
                      className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl"
                    >
                      <Play className="h-6 w-6 text-black ml-0.5" />
                    </button>
                  </div>
                  
                  <h3 className="font-bold text-base mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium">
                    Artiste
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section Artistes populaires avec flèches - Design Spotify */}
        {popularArtists.length > 0 && (
          <section>
            <div className="px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Mic className="h-7 w-7 mr-3 text-green-500" />
                  Artistes populaires
                </h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center hover:underline">
                  Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              {/* Flèche gauche - Visible au survol */}
              <button 
                onClick={() => scrollLeft(artistsScrollRef)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              
              {/* Flèche droite - Visible au survol */}
              <button 
                onClick={() => scrollRight(artistsScrollRef)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </button>
              
              {/* Grille des artistes avec défilement horizontal */}
              <div 
                ref={artistsScrollRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {popularArtists.map((artist) => (
                  <div 
                    key={artist.id} 
                    className="group cursor-pointer text-center flex-shrink-0 w-40"
                    onClick={() => handleArtistClick(artist)}
                  >
                    <div className="relative mb-4">
                      <div className="w-40 h-40 mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25">
                        <img
                          src={artist.picture || artist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                          alt={artist.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Bouton play - Style Spotify */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySong(artist);
                        }}
                        className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl"
                      >
                        <Play className="h-6 w-6 text-black ml-0.5" />
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-base mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-gray-400 font-medium">
                      Artiste
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section Albums et singles populaires avec flèches - Design Spotify */}
        {popularAlbums.length > 0 && (
          <section>
            <div className="px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Headphones className="h-7 w-7 mr-3 text-green-500" />
                  Albums et singles populaires
                </h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center hover:underline">
                  Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              {/* Flèche gauche - Visible au survol */}
              <button 
                onClick={() => scrollLeft(albumsScrollRef)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              
              {/* Flèche droite - Visible au survol */}
              <button 
                onClick={() => scrollRight(albumsScrollRef)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </button>
              
              {/* Grille des albums avec défilement horizontal */}
              <div 
                ref={albumsScrollRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {popularAlbums.map((album) => (
                  <div key={album.id} className="group cursor-pointer flex-shrink-0 w-40">
                    <div className="relative mb-4">
                      <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25">
                        <img
                          src={album.cover || album.picture || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                          alt={album.title || album.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Bouton play - Style Spotify */}
                      <button 
                        onClick={() => handlePlaySong(album)}
                        className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl"
                      >
                        <Play className="h-6 w-6 text-black ml-0.5" />
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-base mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                      {album.title || album.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {album.artist?.name || 'Artiste inconnu'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section Summer season avec flèches - Design Spotify */}
        {newReleases.length > 0 && (
          <section>
            <div className="px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Summer season</h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center hover:underline">
                  Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              {/* Flèche gauche - Visible au survol */}
              <button 
                onClick={() => scrollLeft(newReleasesScrollRef)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              
              {/* Flèche droite - Visible au survol */}
              <button 
                onClick={() => scrollRight(newReleasesScrollRef)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </button>
              
              {/* Grille des nouvelles sorties avec défilement horizontal */}
              <div 
                ref={newReleasesScrollRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {newReleases.map((release) => (
                  <div key={release.id} className="group cursor-pointer flex-shrink-0 w-40">
                    <div className="relative mb-4">
                      <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25">
                        <img
                          src={release.cover || release.picture || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                          alt={release.title || release.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Bouton play - Style Spotify */}
                      <button 
                        onClick={() => handlePlaySong(release)}
                        className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl"
                      >
                        <Play className="h-6 w-6 text-black ml-0.5" />
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-base mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                      {release.title || release.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      {release.artist?.name || 'Artiste inconnu'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section Playlists en vedette avec flèches - Design Spotify */}
        {featuredPlaylists.length > 0 && (
          <section>
            <div className="px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Music2 className="h-7 w-7 mr-3 text-green-500" />
                  Playlists en vedette
                </h2>
                <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center hover:underline">
                  Tout afficher <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
            
            <div className="relative">
              {/* Flèche gauche - Visible au survol */}
              <button 
                onClick={() => scrollLeft(albumsScrollRef)}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </button>
              
              {/* Flèche droite - Visible au survol */}
              <button 
                onClick={() => scrollRight(albumsScrollRef)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 shadow-2xl border border-gray-700"
              >
                <ArrowRight className="h-6 w-6 text-white" />
              </button>
              
              {/* Grille des playlists avec défilement horizontal */}
              <div 
                ref={albumsScrollRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {featuredPlaylists.map((playlist) => (
                  <div key={playlist.id} className="group cursor-pointer flex-shrink-0 w-40">
                    <div className="relative mb-4">
                      <div className="w-40 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 group-hover:border-green-500 transition-all duration-300 shadow-xl group-hover:shadow-green-500/25">
                        <img
                          src={playlist.picture || playlist.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                          alt={playlist.title || playlist.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Bouton play - Style Spotify */}
                      <button 
                        onClick={() => handlePlaySong(playlist)}
                        className="absolute bottom-3 right-3 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-green-400 shadow-2xl"
                      >
                        <Play className="h-6 w-6 text-black ml-0.5" />
                      </button>
                    </div>
                    
                    <h3 className="font-bold text-base mb-1 truncate group-hover:text-green-400 transition-colors text-white">
                      {playlist.title || playlist.name}
                    </h3>
                    <p className="text-sm text-gray-400 truncate">
                      Playlist
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Message si pas de données */}
        {newReleases.length === 0 && popularArtists.length === 0 && featuredPlaylists.length === 0 && (
          <section className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Music2 className="h-16 w-16 text-bemusic-tertiary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-bemusic-primary mb-2">
                Aucune musique disponible
              </h3>
              <p className="text-bemusic-tertiary mb-6">
                Connectez-vous à Deezer pour découvrir de la musique personnalisée
              </p>
              <button 
                onClick={() => navigate('/spotify-login')}
                className="bg-accent-bemusic text-white px-6 py-3 rounded-full font-medium hover:bg-accent-bemusic/80 transition-colors"
              >
                Se connecter à Deezer
              </button>
            </div>
          </section>
        )}
      </div>

      {/* CSS pour masquer la scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Barre de lecture de musique fixe - Design Spotify */}
      <div className={`fixed bottom-0 bg-black border-t border-gray-800 z-[9999] transition-all duration-300 ${
        isSidebarOpen ? 'left-64 right-0' : 'left-0 right-0'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Informations de la piste actuelle */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
                <Music2 className="h-7 w-7 text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  Aucune piste sélectionnée
                </p>
                <p className="text-xs text-gray-400 truncate">
                  Sélectionnez une musique pour commencer
                </p>
              </div>
            </div>

            {/* Contrôles de lecture centrés - Style Spotify */}
            <div className="flex items-center space-x-6">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4L12 12.6l3.3-3.3z"/>
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </button>
              <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-2xl">
                <Play className="h-7 w-7 text-black ml-0.5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 3.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 9H9a5 5 0 00-5 5v2a1 1 0 11-2 0v-2a7 7 0 017-7h5.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>

            {/* Barre de progression et contrôles supplémentaires - Style Spotify */}
            <div className="flex items-center space-x-6 flex-1 justify-end">
              {/* Barre de progression */}
              <div className="flex items-center space-x-3 min-w-0 flex-1 max-w-xs">
                <span className="text-xs text-gray-400 font-medium">0:00</span>
                <div className="flex-1 bg-gray-700 rounded-full h-1">
                  <div className="bg-white h-1 rounded-full w-0"></div>
                </div>
                <span className="text-xs text-gray-400 font-medium">0:00</span>
              </div>

              {/* Contrôles supplémentaires */}
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd"/>
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.76L4.67 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.67l3.713-2.76a1 1 0 011.383.036zM12.293 7.293a1 1 0 011.414 0L16 10.586l2.293-2.293a1 1 0 111.414 1.414L17.414 12l2.293 2.293a1 1 0 01-1.414 1.414L16 13.414l-2.293 2.293a1 1 0 01-1.414-1.414L14.586 12l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L13.586 13H12z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 