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
import { songService } from '../services/songService';
import { artistService } from '../services/artistService';
import { albumService } from '../services/albumService';
import { playlistService } from '../services/playlistService';
import toast from 'react-hot-toast';

const Library = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
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
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loadingArtists, setLoadingArtists] = useState(false);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  
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
  const [likedSongs, setLikedSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);

  // Naviguer vers une playlist
  const handlePlaylistClick = (playlist) => {
    console.log('📚 Navigating to playlist:', playlist);
    const playlistId = playlist._id || playlist.id;
    console.log('📚 Using playlist ID:', playlistId);
    navigate(`/playlist/${playlistId}`);
  };

  // Charger les playlists publiques
  const loadPublicPlaylists = async () => {
    try {
      console.log('📚 Library - Loading public playlists...');
      const response = await playlistService.getPublicPlaylists();
      
      if (response.success) {
        console.log('📚 Library - Public playlists loaded:', response.data);
        setPlaylists(response.data || []);
      } else {
        console.error('❌ Erreur lors du chargement des playlists publiques:', response.error);
        setPlaylists([]);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des playlists publiques:', error);
      setPlaylists([]);
    }
  };

  // Nettoyer les playlists obsolètes du localStorage
  const cleanOldPlaylists = () => {
    try {
      const storedPlaylists = JSON.parse(localStorage.getItem('userPlaylists') || '[]');
      if (storedPlaylists.length > 0) {
        console.log('🧹 Cleaning old playlists from localStorage:', storedPlaylists.length);
        localStorage.removeItem('userPlaylists');
        console.log('✅ Old playlists cleaned from localStorage');
      }
    } catch (error) {
      console.error('❌ Error cleaning old playlists:', error);
    }
  };

  // Charger les playlists depuis localStorage
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        console.log('📚 Library - Loading playlists from server...');
        
        // Charger les playlists depuis le serveur
        const response = await playlistService.getAllPlaylists();
        
        if (response.success) {
          console.log('📚 Library - Playlists loaded from server:', response.data);
          setPlaylists(response.data || []);
          console.log('📚 Playlists chargées dans Library:', response.data?.length || 0);
        } else {
          console.error('❌ Erreur lors du chargement des playlists:', response.error);
          // Fallback vers localStorage en cas d'erreur
          const storedPlaylists = JSON.parse(localStorage.getItem('userPlaylists') || '[]');
          // إزالة التكرار من البلايليست
          const uniquePlaylists = storedPlaylists.filter((playlist, index, self) => 
            index === self.findIndex(p => p._id === playlist._id)
          );
          if (uniquePlaylists.length !== storedPlaylists.length) {
            console.log('📚 Removed duplicate playlists, updating localStorage');
            localStorage.setItem('userPlaylists', JSON.stringify(uniquePlaylists));
          }
          setPlaylists(uniquePlaylists);
        }
      } catch (error) {
        console.error('❌ Erreur lors du chargement des playlists:', error);
        // Fallback vers localStorage en cas d'erreur
        const storedPlaylists = JSON.parse(localStorage.getItem('userPlaylists') || '[]');
        // إزالة التكرار من البلايليست
        const uniquePlaylists = storedPlaylists.filter((playlist, index, self) => 
          index === self.findIndex(p => p._id === playlist._id)
        );
        if (uniquePlaylists.length !== storedPlaylists.length) {
          console.log('📚 Removed duplicate playlists in catch, updating localStorage');
          localStorage.setItem('userPlaylists', JSON.stringify(uniquePlaylists));
        }
        setPlaylists(uniquePlaylists);
      }
    };

    // Nettoyer les anciennes playlists du localStorage
    cleanOldPlaylists();

    if (isAuthenticated && user) {
      loadPlaylists();
    } else {
      // Si pas connecté, charger les playlists publiques
      loadPublicPlaylists();
    }
    
    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      console.log('📚 Library - localStorageChange event received');
      if (isAuthenticated && user) {
        loadPlaylists();
      } else {
        loadPublicPlaylists();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, [isAuthenticated, user]);

  // Charger les chansons aimées
  useEffect(() => {
    const loadLikedSongs = async () => {
      if (activeTab === 'songs') {
        setLoadingSongs(true);
        try {
          console.log('🎵 Loading liked songs for Library...');
          const response = await songService.getLikedSongs();
          if (response.success) {
            console.log('🎵 Raw API response:', response.data);
            const songs = response.data.map(song => {
              console.log('🎵 Processing song:', song);
              return {
                _id: song._id,
                title: song.title,
                artist: song.artist || 'Artiste inconnu',
                album: song.album || '—',
                duration: song.duration || 180,
                cover: song.cover || song.coverImage || null,
                audioUrl: song.audioUrl || null,
                isLiked: true
              };
            });
            setLikedSongs(songs);
            console.log('🎵 Processed liked songs:', songs);
          }
        } catch (error) {
          console.error('❌ Error loading liked songs:', error);
        } finally {
          setLoadingSongs(false);
        }
      }
    };

    loadLikedSongs();
  }, [activeTab]);

  // Charger les artistes suivis
  useEffect(() => {
    const loadFollowedArtists = async () => {
      if (activeTab === 'artists') {
        setLoadingArtists(true);
        try {
          console.log('🎤 Loading followed artists for Library...');
          const response = await artistService.getFollowedArtists();
          console.log('🎤 Full response from getFollowedArtists:', response);
          if (response.success) {
            console.log('🎤 Raw followed artists response:', response.data);
            console.log('🎤 Response data type:', typeof response.data);
            console.log('🎤 Response data length:', response.data?.length);
            
            if (!response.data || response.data.length === 0) {
              console.log('🎤 No followed artists found');
              setArtists([]);
              return;
            }
            
            const artistsData = response.data.map(artist => {
              console.log('🎤 Processing artist:', artist);
              console.log('🎤 Artist profilePicture:', artist.profilePicture);
              console.log('🎤 Artist profilePicture type:', typeof artist.profilePicture);
              
              let avatarUrl;
              if (artist.profilePicture) {
                if (artist.profilePicture.startsWith('http')) {
                  avatarUrl = artist.profilePicture;
                } else if (artist.profilePicture.startsWith('/uploads/')) {
                  // المسار يبدأ بـ /uploads/ لذلك نضيف فقط localhost:5000
                  avatarUrl = `http://localhost:5000${artist.profilePicture}`;
                } else {
                  // المسار لا يبدأ بـ /uploads/ لذلك نضيف /uploads/ أولاً
                  avatarUrl = `http://localhost:5000/uploads/${artist.profilePicture}`;
                }
              } else {
                avatarUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&${Math.random()}`;
              }
              
              console.log('🎤 Final avatar URL:', avatarUrl);
              
              return {
                _id: artist._id,
                id: `artist-${artist._id}`, // مفتاح فريد للفنانين
                name: artist.username || artist.name || 'Artiste inconnu', // Essayer username puis name
                avatar: avatarUrl,
                followers: artist.followers ? artist.followers.length : Math.floor(Math.random() * 10000) + 1000,
                bio: artist.bio || '',
                isFollowing: true
              };
            });
            setArtists(artistsData);
            console.log('🎤 Processed followed artists:', artistsData);
          } else {
            console.log('🎤 No followed artists found or error:', response.error);
            setArtists([]);
          }
        } catch (error) {
          console.error('❌ Error loading followed artists:', error);
          setArtists([]);
        } finally {
          setLoadingArtists(false);
        }
      }
    };

    loadFollowedArtists();
  }, [activeTab]);

  // Écouter les événements de follow/unfollow d'artistes
  useEffect(() => {
    const handleArtistFollowed = (event) => {
      console.log('🎤 Artist followed event received:', event.detail);
      
      // Recharger les artistes suivis - toujours, pas seulement si on est sur le tab artists
      const loadFollowedArtists = async () => {
        setLoadingArtists(true);
        try {
          console.log('🎤 Reloading followed artists after follow event...');
          const response = await artistService.getFollowedArtists();
          if (response.success) {
            const artistsData = response.data.map(artist => {
              let avatarUrl;
              if (artist.profilePicture) {
                if (artist.profilePicture.startsWith('http')) {
                  avatarUrl = artist.profilePicture;
                } else if (artist.profilePicture.startsWith('/uploads/')) {
                  avatarUrl = `http://localhost:5000${artist.profilePicture}`;
                } else {
                  avatarUrl = `http://localhost:5000/uploads/${artist.profilePicture}`;
                }
              } else {
                avatarUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&${Math.random()}`;
              }
              
              return {
                _id: artist._id,
                id: `artist-${artist._id}`, // مفتاح فريد للفنانين
                name: artist.name || artist.username,
                username: artist.username,
                avatar: avatarUrl,
                profilePicture: artist.profilePicture,
                followersCount: artist.followers ? artist.followers.length : 0
              };
            });
            setArtists(artistsData);
            console.log('✅ Followed artists reloaded after follow event:', artistsData.length, 'artists');
          } else {
            console.log('❌ Failed to reload followed artists:', response.error);
          }
        } catch (error) {
          console.error('❌ Error reloading followed artists:', error);
        } finally {
          setLoadingArtists(false);
        }
      };
      
      loadFollowedArtists();
      
      if (activeTab !== 'artists') {
        console.log('🎤 Not on artists tab, but artists list updated for when user switches to artists tab');
      }
    };

    const handleArtistUnfollowed = (event) => {
      console.log('🎤 Artist unfollowed event received:', event.detail);
      // Recharger les artistes suivis - toujours, pas seulement si on est sur le tab artists
      const loadFollowedArtists = async () => {
        setLoadingArtists(true);
        try {
          console.log('🎤 Reloading followed artists after unfollow event...');
          const response = await artistService.getFollowedArtists();
          if (response.success) {
            const artistsData = response.data.map(artist => {
              let avatarUrl;
              if (artist.profilePicture) {
                if (artist.profilePicture.startsWith('http')) {
                  avatarUrl = artist.profilePicture;
                } else if (artist.profilePicture.startsWith('/uploads/')) {
                  avatarUrl = `http://localhost:5000${artist.profilePicture}`;
                } else {
                  avatarUrl = `http://localhost:5000/uploads/${artist.profilePicture}`;
                }
              } else {
                avatarUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&${Math.random()}`;
              }
              
              return {
                _id: artist._id,
                id: `artist-${artist._id}`, // مفتاح فريد للفنانين
                name: artist.name || artist.username,
                username: artist.username,
                avatar: avatarUrl,
                profilePicture: artist.profilePicture,
                followersCount: artist.followers ? artist.followers.length : 0
              };
            });
            setArtists(artistsData);
            console.log('✅ Followed artists reloaded after unfollow event:', artistsData.length, 'artists');
          } else {
            console.log('❌ Failed to reload followed artists:', response.error);
          }
        } catch (error) {
          console.error('❌ Error reloading followed artists:', error);
        } finally {
          setLoadingArtists(false);
        }
      };
      
      loadFollowedArtists();
      
      if (activeTab !== 'artists') {
        console.log('🎤 Not on artists tab, but artists list updated for when user switches to artists tab');
      }
    };

    // Écouter les événements même si on n'est pas sur le bon tab
    window.addEventListener('artistFollowed', handleArtistFollowed);
    window.addEventListener('artistUnfollowed', handleArtistUnfollowed);
    
    // Écouter aussi les changements de tab pour recharger si nécessaire
    const handleTabChange = () => {
      if (activeTab === 'artists') {
        console.log('🎤 Tab changed to artists, reloading followed artists...');
        const loadFollowedArtists = async () => {
          setLoadingArtists(true);
          try {
            const response = await artistService.getFollowedArtists();
            if (response.success) {
              const artistsData = response.data.map(artist => {
                let avatarUrl;
                if (artist.profilePicture) {
                  if (artist.profilePicture.startsWith('http')) {
                    avatarUrl = artist.profilePicture;
                  } else if (artist.profilePicture.startsWith('/uploads/')) {
                    avatarUrl = `http://localhost:5000${artist.profilePicture}`;
                  } else {
                    avatarUrl = `http://localhost:5000/uploads/${artist.profilePicture}`;
                  }
                } else {
                  avatarUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&${Math.random()}`;
                }
                
                return {
                  _id: artist._id,
                  name: artist.name || artist.username,
                  username: artist.username,
                  avatar: avatarUrl,
                  profilePicture: artist.profilePicture,
                  followersCount: artist.followers ? artist.followers.length : 0
                };
              });
              setArtists(artistsData);
              console.log('✅ Followed artists reloaded on tab change:', artistsData.length, 'artists');
            }
          } catch (error) {
            console.error('❌ Error reloading followed artists on tab change:', error);
          } finally {
            setLoadingArtists(false);
          }
        };
        loadFollowedArtists();
      }
    };

    return () => {
      window.removeEventListener('artistFollowed', handleArtistFollowed);
      window.removeEventListener('artistUnfollowed', handleArtistUnfollowed);
    };
  }, [activeTab]);

  // Recharger les artistes suivis quand on change de tab
  useEffect(() => {
    if (activeTab === 'artists') {
      console.log('🎤 Active tab changed to artists, reloading followed artists...');
      const loadFollowedArtists = async () => {
        setLoadingArtists(true);
        try {
          const response = await artistService.getFollowedArtists();
          if (response.success) {
            const artistsData = response.data.map(artist => {
              let avatarUrl;
              if (artist.profilePicture) {
                if (artist.profilePicture.startsWith('http')) {
                  avatarUrl = artist.profilePicture;
                } else if (artist.profilePicture.startsWith('/uploads/')) {
                  avatarUrl = `http://localhost:5000${artist.profilePicture}`;
                } else {
                  avatarUrl = `http://localhost:5000/uploads/${artist.profilePicture}`;
                }
              } else {
                avatarUrl = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face&${Math.random()}`;
              }
              
              return {
                _id: artist._id,
                id: `artist-${artist._id}`, // مفتاح فريد للفنانين
                name: artist.name || artist.username,
                username: artist.username,
                avatar: avatarUrl,
                profilePicture: artist.profilePicture,
                followersCount: artist.followers ? artist.followers.length : 0
              };
            });
            setArtists(artistsData);
            console.log('✅ Followed artists reloaded on tab change:', artistsData.length, 'artists');
          }
        } catch (error) {
          console.error('❌ Error reloading followed artists on tab change:', error);
        } finally {
          setLoadingArtists(false);
        }
      };
      loadFollowedArtists();
    }
  }, [activeTab]);

  // Charger les albums likés
  useEffect(() => {
    const loadLikedAlbums = async () => {
      if (activeTab === 'albums') {
        setLoadingAlbums(true);
        try {
          console.log('💿 Loading liked albums for Library...');
          
          // Récupérer les IDs des albums likés depuis localStorage
          const likedAlbumsIds = JSON.parse(localStorage.getItem('likedAlbums') || '[]');
          console.log('💿 Liked albums IDs:', likedAlbumsIds);
          
          if (likedAlbumsIds.length === 0) {
            console.log('💿 No liked albums found');
            setAlbums([]);
            setLoadingAlbums(false);
            return;
          }
          
          // إزالة التكرار من قائمة الألبومات
          const uniqueAlbumsIds = [...new Set(likedAlbumsIds)];
          console.log('💿 Unique albums IDs:', uniqueAlbumsIds);
          
          if (uniqueAlbumsIds.length !== likedAlbumsIds.length) {
            console.log('💿 Removed duplicate albums, updating localStorage');
            localStorage.setItem('likedAlbums', JSON.stringify(uniqueAlbumsIds));
          }
          
          // Récupérer les détails des albums likés
          const albumsPromises = uniqueAlbumsIds.map(async (albumId) => {
            try {
              const response = await albumService.getAlbumById(albumId);
              if (response.success) {
                return response.data;
              }
              return null;
            } catch (error) {
              console.error(`❌ Error loading album ${albumId}:`, error);
              return null;
            }
          });
          
          const albumsResults = await Promise.all(albumsPromises);
          const validAlbums = albumsResults.filter(album => album !== null);
          
          console.log('💿 Raw liked albums response:', validAlbums);
          
          const albumsData = validAlbums.map(album => {
            console.log('💿 Processing liked album:', album);
            console.log('💿 Album songs:', album.songs);
            return {
              _id: album._id,
              id: `album-${album._id}`, // مفتاح فريد للألبومات
              name: album.title,
              title: album.title,
              artist: album.artist ? (album.artist.name || album.artist.username) : 'Artiste inconnu',
              coverUrl: album.coverImage ? 
                (album.coverImage.startsWith('http') ? 
                  album.coverImage : 
                  `http://localhost:5000${album.coverImage}`) : 
                `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&${Math.random()}`,
              cover: album.coverImage ? 
                (album.coverImage.startsWith('http') ? 
                  album.coverImage : 
                  `http://localhost:5000${album.coverImage}`) : 
                `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&${Math.random()}`,
              releaseDate: album.releaseDate,
              genre: album.genre ? album.genre.join(', ') : '',
              songsCount: album.songsCount || 0,
              followers: album.followers ? album.followers.length : 0,
              tracks: album.songs || []
            };
          });
          
          setAlbums(albumsData);
          console.log('💿 Processed liked albums:', albumsData);
        } catch (error) {
          console.error('❌ Error loading liked albums:', error);
          setAlbums([]);
        } finally {
          setLoadingAlbums(false);
        }
      }
    };

    loadLikedAlbums();
  }, [activeTab]);

  // Écouter les changements dans localStorage pour les albums likés
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'likedAlbums' && activeTab === 'albums') {
        console.log('💿 Liked albums changed in localStorage, reloading...');
        // Recharger les albums likés
        const loadLikedAlbums = async () => {
          try {
            const likedAlbumsIds = JSON.parse(localStorage.getItem('likedAlbums') || '[]');
            
            if (likedAlbumsIds.length === 0) {
              setAlbums([]);
              return;
            }
            
            // إزالة التكرار من قائمة الألبومات
            const uniqueAlbumsIds = [...new Set(likedAlbumsIds)];
            
            if (uniqueAlbumsIds.length !== likedAlbumsIds.length) {
              console.log('💿 Removed duplicate albums in storage change, updating localStorage');
              localStorage.setItem('likedAlbums', JSON.stringify(uniqueAlbumsIds));
            }
            
            const albumsPromises = uniqueAlbumsIds.map(async (albumId) => {
              try {
                const response = await albumService.getAlbumById(albumId);
                return response.success ? response.data : null;
              } catch (error) {
                console.error(`❌ Error loading album ${albumId}:`, error);
                return null;
              }
            });
            
            const albumsResults = await Promise.all(albumsPromises);
            const validAlbums = albumsResults.filter(album => album !== null);
            
            const albumsData = validAlbums.map(album => ({
              _id: album._id,
              id: `album-${album._id}`, // مفتاح فريد للألبومات
              name: album.title,
              title: album.title,
              artist: album.artist ? (album.artist.name || album.artist.username) : 'Artiste inconnu',
              coverUrl: album.coverImage ? 
                (album.coverImage.startsWith('http') ? 
                  album.coverImage : 
                  `http://localhost:5000${album.coverImage}`) : 
                `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&${Math.random()}`,
              cover: album.coverImage ? 
                (album.coverImage.startsWith('http') ? 
                  album.coverImage : 
                  `http://localhost:5000${album.coverImage}`) : 
                `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&${Math.random()}`,
              releaseDate: album.releaseDate,
              genre: album.genre ? album.genre.join(', ') : '',
              songsCount: album.songsCount || 0,
              followers: album.followers ? album.followers.length : 0,
              tracks: album.songs || []
            }));
            
            setAlbums(albumsData);
          } catch (error) {
            console.error('❌ Error reloading liked albums:', error);
          }
        };
        
        loadLikedAlbums();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Également écouter les changements dans la même page (pas de storage event)
    const interval = setInterval(() => {
      if (activeTab === 'albums') {
        const currentLiked = JSON.parse(localStorage.getItem('likedAlbums') || '[]');
        const currentAlbumIds = albums.map(album => album._id);
        
        // Si les IDs ne correspondent pas, recharger
        if (JSON.stringify(currentLiked.sort()) !== JSON.stringify(currentAlbumIds.sort())) {
          console.log('💿 Detected change in liked albums, reloading...');
          handleStorageChange({ key: 'likedAlbums' });
        }
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [activeTab, albums]);

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
    console.log('🎵 Playing album from Library:', album);
    console.log('🎵 Album tracks:', album.tracks);
    
    if (!album.tracks || album.tracks.length === 0) {
      toast.error('Cet album ne contient aucune chanson');
      return;
    }
    
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
      <div className={`grid gap-3 lg:gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
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
    console.log('💿 Rendering albums:', albums);
    
    if (loadingAlbums) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des albums suivis...</p>
        </div>
      );
    }
    
    const filteredAlbums = albums.filter(album => 
      album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredAlbums.length === 0) {
      return (
        <div className="text-center py-12">
          <Disc className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucun album favori</h3>
          <p className="text-gray-500">Les albums que vous aimez apparaîtront ici</p>
          <p className="text-sm text-gray-600 mt-2">Cliquez sur le cœur des albums pour les ajouter à vos favoris</p>
        </div>
      );
    }

    return (
      <div className={`grid gap-3 lg:gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
          : 'grid-cols-1'
      }`}>
        {filteredAlbums.map((album) => (
          <div 
            key={album.id} 
            className="group cursor-pointer hover:bg-gray-800/50 rounded-lg p-2 transition-colors duration-200"
            onClick={() => navigate(`/album/${album._id}`)}
          >
            <div className="relative mb-3">
              <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={album.coverUrl}
                  alt={album.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayAlbum(album);
                }}
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
    console.log('🎤 Rendering artists:', artists);
    
    if (loadingArtists) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des artistes suivis...</p>
        </div>
      );
    }
    
    const filteredArtists = artists.filter(artist => 
      artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredArtists.length === 0) {
      return (
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucun artiste suivi</h3>
          <p className="text-gray-500">Les artistes que vous suivez apparaîtront ici</p>
        </div>
      );
    }

    return (
      <div className={`grid gap-3 lg:gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6' 
          : 'grid-cols-1'
      }`}>
        {filteredArtists.map((artist) => {
          console.log('🎤 Rendering artist:', artist.name, 'avatar:', artist.avatar);
          return (
            <div 
              key={artist.id} 
              className="text-center group cursor-pointer hover:bg-gray-800/50 rounded-lg p-2 transition-colors duration-200"
              onClick={() => {
                console.log('🎤 Navigating to artist:', artist._id, 'name:', artist.name);
                if (artist._id) {
                  navigate(`/artist/${artist._id}`);
                } else {
                  console.error('❌ No artist ID available for navigation');
                  toast.error('ID de l\'artiste non disponible');
                }
              }}
            >
              <div className="relative mb-3">
                <div className={`${viewMode === 'grid' ? 'w-full aspect-square' : 'w-32 h-32'} bg-gray-800 rounded-full overflow-hidden mx-auto`}>
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('❌ Image load error for artist:', artist.name, 'URL:', artist.avatar);
                      e.target.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face`;
                    }}
                    onLoad={() => {
                      console.log('✅ Image loaded successfully for artist:', artist.name, 'URL:', artist.avatar);
                    }}
                  />
                </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayArtist(artist);
                }}
                className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
              >
                <Play className="h-5 w-5 text-black ml-1" />
              </button>
            </div>
            
            <h3 className="font-semibold text-sm group-hover:text-green-400 transition-colors">
              {artist.name}
            </h3>
            <p className="text-xs text-gray-400">
              {artist.followers && artist.followers > 0 ? 
                `${artist.followers.toLocaleString()} abonnés` : 
                'Nouvel artiste'
              }
            </p>
          </div>
          );
        })}
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

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSongs = () => {
    console.log('🎵 Rendering liked songs:', likedSongs);
    
    if (loadingSongs) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement des chansons aimées...</p>
        </div>
      );
    }
    
    if (!likedSongs || likedSongs.length === 0) {
      return (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucune chanson aimée</h3>
          <p className="text-gray-500">Les chansons que vous aimez apparaîtront ici</p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {likedSongs.map((song, index) => (
          <div 
            key={song._id || index} 
            className="group flex items-center p-3 lg:p-4 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors font-medium flex-shrink-0 mr-3 lg:mr-8">
              {index + 1}
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex-shrink-0 mr-3 lg:mr-12">
              <img 
                src={song.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'} 
                alt={song.title} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop';
                }}
              />
            </div>
            <div className="flex-1 min-w-0 mr-3 lg:mr-8">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium text-white truncate text-sm lg:text-base">{song.title}</h3>
              </div>
              <p className="text-xs lg:text-sm text-gray-400 truncate">{song.artist}</p>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-8 text-xs lg:text-sm text-gray-400 flex-shrink-0">
              <span className="w-12 lg:w-16 text-right mr-2 lg:mr-8">{formatDuration(song.duration)}</span>
              <div className="flex items-center space-x-1 lg:space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => { e.stopPropagation(); handlePlaySong(song); }} className="p-1.5 lg:p-2 rounded-full bg-green-500 hover:bg-green-400 transition-colors">
                  <Play className="h-3 w-3 lg:h-4 lg:w-4 text-black ml-0.5" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleAddToQueue(song); }} className="p-1.5 lg:p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                  <Plus className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleLike(song._id); }} className="p-1.5 lg:p-2 rounded-full bg-red-500 hover:bg-red-400 transition-colors">
                  <Heart className="h-3 w-3 lg:h-4 lg:w-4 text-white fill-white" />
                </button>
              </div>
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
    <div className="min-h-screen bg-black text-white px-4 py-6 lg:px-6">
      {/* En-tête */}
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold">Votre Bibliothèque</h1>
          <button 
            onClick={handleCreatePlaylist}
            className="px-3 py-2 lg:px-4 bg-white text-black rounded-full font-semibold hover:scale-105 transition-transform text-sm lg:text-base"
          >
            <span className="hidden sm:inline">Créer une playlist</span>
            <span className="sm:hidden">Créer</span>
          </button>
        </div>

        {/* Barre de recherche */}
        <div className="relative w-full max-w-md mb-4 lg:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher dans votre bibliothèque"
            className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-full pl-9 lg:pl-10 pr-4 py-2.5 lg:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm lg:text-base"
          />
        </div>

        {/* Onglets */}
        <div className="flex items-center space-x-1 mb-4 lg:mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 lg:space-x-2 px-3 py-2 lg:px-4 rounded-full text-xs lg:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Filtres et options d'affichage */}
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-3 w-3 lg:h-4 lg:w-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-800 text-white text-xs lg:text-sm rounded px-2 py-1 lg:px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {filterTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 lg:p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 lg:p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="h-4 w-4 lg:h-5 lg:w-5" />
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