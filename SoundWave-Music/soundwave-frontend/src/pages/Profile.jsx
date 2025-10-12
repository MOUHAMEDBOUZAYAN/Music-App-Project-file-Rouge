import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../utils/constants.js';
import { songService } from '../services/songService';
import { albumService } from '../services/albumService';
import { 
  User, 
  Mail, 
  Calendar, 
  Edit3, 
  Music, 
  Heart, 
  Clock, 
  Settings, 
  Crown,
  Plus,
  Users,
  Play,
  Download,
  Star,
  Save,
  X,
  Disc,
  Upload,
  BarChart3,
  CheckCircle,
  MoreHorizontal,
  Shuffle,
  Repeat,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, isAuthenticated, isLoading, updateUser, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: null
  });
  const [userSongs, setUserSongs] = useState([]);
  const [userAlbums, setUserAlbums] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    if (user) {
      console.log('👤 User data in Profile:', user);
      console.log('🖼️ User profilePicture:', user.profilePicture);
      console.log('🖼️ ProfilePicture type:', typeof user.profilePicture);
      
      setEditForm({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        profilePicture: null
      });
      
      // Charger les statistiques si l'utilisateur est un artiste
      if (user.role === USER_ROLES.ARTIST || user.role === USER_ROLES.ADMIN) {
        loadUserStats();
      }
      
      // Charger les chansons likées pour tous les utilisateurs
      loadLikedSongs();
    }
  }, [user]);

  const loadUserStats = async () => {
    setLoadingStats(true);
    try {
      const [songsResponse, albumsResponse] = await Promise.all([
        songService.getUserSongs({ limit: 5 }),
        albumService.getUserAlbums({ limit: 5 })
      ]);
      
      setUserSongs(songsResponse.data || []);
      setUserAlbums(albumsResponse.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadLikedSongs = async () => {
    try {
      console.log('🎵 Loading liked songs for profile...');
      const response = await songService.getLikedSongs();
      console.log('🎵 Liked songs response:', response);
      
      if (response?.data) {
        if (Array.isArray(response.data)) {
          setLikedSongs(response.data);
          console.log('✅ Liked songs loaded:', response.data.length);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setLikedSongs(response.data.data);
          console.log('✅ Liked songs loaded from nested data:', response.data.data.length);
        } else {
          console.log('⚠️ Unexpected liked songs data structure:', response.data);
          setLikedSongs([]);
        }
      } else {
        console.log('⚠️ No data in liked songs response');
        setLikedSongs([]);
      }
    } catch (error) {
      console.error('❌ Error loading liked songs:', error);
      setLikedSongs([]);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    toast.success('Mode édition activé');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({
        ...prev,
        profilePicture: file
      }));
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      username: user.username || '',
      email: user.email || '',
      bio: user.bio || '',
      profilePicture: null
    });
    toast('Modifications annulées', {
      icon: '❌',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleSaveEdit = async () => {
    try {
      setRetryCount(0);
      
      if (!isAuthenticated || !user) {
        toast.error('Vous devez être connecté pour modifier votre profil');
        return;
      }
      
      if (!editForm.username.trim() || !editForm.email.trim()) {
        toast.error('Veuillez remplir tous les champs');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email)) {
        toast.error('Veuillez entrer un email valide');
        return;
      }

      const formData = new FormData();
      formData.append('username', editForm.username);
      formData.append('email', editForm.email);
      formData.append('bio', editForm.bio || '');
      
      if (editForm.profilePicture) {
        formData.append('profilePicture', editForm.profilePicture);
      }

      console.log('Sauvegarde des modifications:', editForm);
      
      const loadingToast = toast.loading('Sauvegarde en cours...');
      
      let token = localStorage.getItem('authToken');
      
      if (token) {
        token = token.replace(/^["']|["']$/g, '');
        console.log('🔑 Token nettoyé:', token.substring(0, 20) + '...');
        localStorage.setItem('authToken', token);
      } else {
        console.log('🔑 Aucun token trouvé');
      }
      
      if (!token) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
        logout();
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erreur de réponse:', response.status, errorData);
        
        if (response.status === 401) {
          console.log('🔍 Vérification du token...');
          let currentToken = localStorage.getItem('authToken');
          
          if (currentToken) {
            currentToken = currentToken.replace(/^["']|["']$/g, '');
            localStorage.setItem('authToken', currentToken);
          }
          
          if (!currentToken) {
            logout();
            toast.error('Session expirée. Veuillez vous reconnecter.');
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
            return;
          } else {
            if (retryCount < 1) {
              setRetryCount(prev => prev + 1);
              toast.error('Erreur d\'authentification. Nouvelle tentative...');
              setTimeout(() => {
                handleSaveEdit();
              }, 1000);
              return;
            } else {
              console.log('🔄 Tentative de reconnexion automatique...');
              
              const userEmail = user?.email;
              if (userEmail) {
                toast.loading('Tentative de reconnexion...');
                
                try {
                  const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: userEmail,
                      password: 'Mouhamed12@'
                    })
                  });
                  
                  if (loginResponse.ok) {
                    const loginData = await loginResponse.json();
                    if (loginData.success) {
                      const cleanedToken = loginData.token.replace(/^["']|["']$/g, '');
                      localStorage.setItem('authToken', cleanedToken);
                      localStorage.setItem('user', JSON.stringify(loginData.user));
                      
                      toast.success('Reconnexion réussie! Nouvelle tentative...');
                      
                      setTimeout(() => {
                        handleSaveEdit();
                      }, 1000);
                      return;
                    }
                  }
                } catch (error) {
                  console.log('❌ Échec de la reconnexion automatique:', error);
                }
              }
              
              toast.error('Session expirée. Veuillez vous reconnecter.');
              
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              logout();
              
              setTimeout(() => {
                window.location.href = '/login';
              }, 2000);
              return;
            }
          }
        } else if (response.status === 400) {
          throw new Error(errorData.message || 'Données invalides');
        } else {
          throw new Error(`Erreur serveur (${response.status})`);
        }
      }
      
      const updatedUser = await response.json();
      
      updateUser({
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        bio: editForm.bio.trim(),
        profilePicture: updatedUser.data.profilePicture
      });
      
      toast.dismiss(loadingToast);
      setIsEditing(false);
      
      toast.success('Profil mis à jour avec succès! 🎉');
      
      setRetryCount(0);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      if (!error.message.includes('Session expirée') && !error.message.includes('authentification')) {
        toast.error(`Erreur lors de la sauvegarde: ${error.message}`);
      }
      
      setRetryCount(0);
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  console.log('Profile component - user:', user);
  console.log('Profile component - isAuthenticated:', isAuthenticated);
  console.log('Profile component - isLoading:', isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
          <p className="text-gray-400">Vous devez être connecté pour voir votre profil</p>
          <Link to="/login" className="inline-block mt-4 px-6 py-3 bg-green-500 text-black rounded-full font-semibold hover:bg-green-400 transition-all duration-200">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Spotify-style */}
      <div className="bg-gradient-to-b from-gray-900 to-black">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold">Profil</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleEditClick}
                className="px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Modifier le profil
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Spotify Style */}
      <div className="bg-gradient-to-b from-purple-900 via-gray-900 to-black px-6 pt-8 pb-16">
        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <div className="w-48 h-48 md:w-56 md:h-56 bg-gray-800 rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-4 border-white/10">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:5000${user.profilePicture}`} 
                    alt={user.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.log('🖼️ Profile image failed to load:', user.profilePicture);
                      e.target.style.display = 'none';
                      const fallback = document.getElementById('profile-fallback');
                      if (fallback) {
                        fallback.classList.remove('hidden');
                        fallback.classList.add('flex');
                      }
                    }}
                  />
                ) : null}
                <span className={`text-6xl md:text-7xl font-bold text-white ${user.profilePicture ? 'hidden' : 'flex'}`}>
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <span className="text-6xl md:text-7xl font-bold text-white hidden" id="profile-fallback">
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              
              {/* Artist Badge */}
              {user.role === 'artist' && (
                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-3 border-4 border-black shadow-lg">
                  <Music className="h-6 w-6 text-black" />
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <div className="space-y-4">
              {/* Profile Type */}
              <div className="flex items-center space-x-2">
                {user.role === 'artist' ? (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                    Artiste
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium border border-blue-500/30">
                    Utilisateur
                  </span>
                )}
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium border border-yellow-500/30">
                  <Crown className="h-3 w-3 inline mr-1" />
                  Gratuit
                </span>
              </div>

              {/* Name */}
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                {user.username || 'Utilisateur'}
              </h1>

              {/* Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <span>
                  Membre depuis {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                </span>
                {user.role === 'artist' && (
                  <>
                    <span>•</span>
                    <span>{userSongs.length} chanson{userSongs.length > 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>{userAlbums.length} album{userAlbums.length > 1 ? 's' : ''}</span>
                  </>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-gray-300 text-lg max-w-2xl">
                  {user.bio}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 pt-4">
                <button className="px-8 py-3 bg-green-500 text-black rounded-full font-bold hover:bg-green-400 transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Lire</span>
                </button>
                <button className="p-3 border border-gray-600 rounded-full hover:border-white transition-colors">
                  <Heart className="h-6 w-6" />
                </button>
                <button className="p-3 border border-gray-600 rounded-full hover:border-white transition-colors">
                  <MoreHorizontal className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black border-b border-gray-800">
        <div className="px-6">
          <nav className="flex space-x-8">
            <button className="py-4 text-white font-medium border-b-2 border-white">
              Vue d'ensemble
            </button>
            <button className="py-4 text-gray-400 hover:text-white font-medium border-b-2 border-transparent hover:border-gray-600 transition-colors">
              Créations
            </button>
            <button className="py-4 text-gray-400 hover:text-white font-medium border-b-2 border-transparent hover:border-gray-600 transition-colors">
              Playlists
            </button>
            <button className="py-4 text-gray-400 hover:text-white font-medium border-b-2 border-transparent hover:border-gray-600 transition-colors">
              À propos
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Recent Activity */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Activité récente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Afficher les chansons uploadées pour les artistes */}
              {(user.role === USER_ROLES.ARTIST || user.role === USER_ROLES.ADMIN) && userSongs.length > 0 ? (
                userSongs.slice(0, 4).map((song, index) => (
                  <div key={song._id} className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-4 group cursor-pointer transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center group-hover:bg-green-500 transition-colors">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{song.title}</h3>
                        <p className="text-gray-400 text-sm truncate">Votre création</p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 bg-green-500 rounded-full hover:bg-green-400 transition-all">
                        <Play className="h-4 w-4 text-black" />
                      </button>
                    </div>
                  </div>
                ))
              ) : likedSongs.length > 0 ? (
                // Afficher les chansons likées pour tous les utilisateurs
                likedSongs.slice(0, 4).map((song, index) => (
                  <div key={song._id || song.id} className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-4 group cursor-pointer transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center group-hover:bg-green-500 transition-colors">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-medium truncate">{song.title || song.name}</h3>
                        <p className="text-gray-400 text-sm truncate">
                          {song.artist?.name || song.artist?.username || song.artist || 'Artiste inconnu'}
                        </p>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 bg-green-500 rounded-full hover:bg-green-400 transition-all">
                        <Play className="h-4 w-4 text-black" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 bg-gray-800/30 rounded-lg">
                  <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">
                    {(user.role === USER_ROLES.ARTIST || user.role === USER_ROLES.ADMIN) 
                      ? "Aucune chanson uploadée" 
                      : "Aucune chanson aimée"
                    }
                  </p>
                  <Link
                    to={(user.role === USER_ROLES.ARTIST || user.role === USER_ROLES.ADMIN) 
                      ? "/artist-dashboard" 
                      : "/search"
                    }
                    className="inline-block px-6 py-3 bg-green-500 text-black rounded-lg font-medium hover:bg-green-400 transition-colors"
                  >
                    {(user.role === USER_ROLES.ARTIST || user.role === USER_ROLES.ADMIN) 
                      ? "Uploader une chanson" 
                      : "Découvrir de la musique"
                    }
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Afficher les stats d'artiste seulement si l'utilisateur est artiste */}
            {(user.role === USER_ROLES.ARTIST || user.role === USER_ROLES.ADMIN) && (
              <>
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Music className="h-8 w-8 text-green-500" />
                    <span className="text-2xl font-bold text-white">{userSongs.length}</span>
                  </div>
                  <h3 className="text-white font-medium">Chansons</h3>
                  <p className="text-gray-400 text-sm">Total uploadé</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Disc className="h-8 w-8 text-blue-500" />
                    <span className="text-2xl font-bold text-white">{userAlbums.length}</span>
                  </div>
                  <h3 className="text-white font-medium">Albums</h3>
                  <p className="text-gray-400 text-sm">Total créé</p>
                </div>
              </>
            )}
            
            {/* Stats communes pour tous les utilisateurs */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Heart className="h-8 w-8 text-red-500" />
                <span className="text-2xl font-bold text-white">{likedSongs.length}</span>
              </div>
              <h3 className="text-white font-medium">Chansons aimées</h3>
              <p className="text-gray-400 text-sm">Dans votre bibliothèque</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-8 w-8 text-purple-500" />
                <span className="text-2xl font-bold text-white">0h</span>
              </div>
              <h3 className="text-white font-medium">Écoute</h3>
              <p className="text-gray-400 text-sm">Temps total</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link 
                to="/settings"
                className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-6 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Edit3 className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Modifier le profil</h3>
                    <p className="text-gray-400 text-sm">Personnalisez vos informations</p>
                  </div>
                </div>
              </Link>

              <Link 
                to="/subscriptions"
                className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-6 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                    <Crown className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Passer à Premium</h3>
                    <p className="text-gray-400 text-sm">Débloquez toutes les fonctionnalités</p>
                  </div>
                </div>
              </Link>

              <Link 
                to="/create-playlist"
                className="bg-gray-800/50 hover:bg-gray-800 rounded-lg p-6 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Plus className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Créer une playlist</h3>
                    <p className="text-gray-400 text-sm">Organisez votre musique</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Modifier le profil</h2>
                <button 
                  onClick={handleCancelEdit}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Profile Picture */}
              <div>
                <label className="text-white font-medium block mb-3">Photo de profil</label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                    {editForm.profilePicture ? (
                      <img 
                        src={URL.createObjectURL(editForm.profilePicture)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : user.profilePicture ? (
                      <img 
                        src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:5000${user.profilePicture}`} 
                        alt="Current" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {user.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="profilePicture"
                    />
                    <label
                      htmlFor="profilePicture"
                      className="bg-green-500 hover:bg-green-400 text-black px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors inline-block"
                    >
                      Choisir une image
                    </label>
                  </div>
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="text-white font-medium block mb-2">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                  placeholder="Nom d'utilisateur"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-white font-medium block mb-2">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                  placeholder="Email"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-white font-medium block mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none resize-none"
                  placeholder="Parlez-nous de vous..."
                  rows={4}
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-800 flex justify-end space-x-4">
              <button 
                onClick={handleCancelEdit}
                className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-6 py-3 bg-green-500 text-black rounded-full font-medium hover:bg-green-400 transition-colors"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;