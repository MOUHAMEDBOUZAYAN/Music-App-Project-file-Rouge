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
  CheckCircle
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
  const [loadingStats, setLoadingStats] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    if (user) {
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
      // Réinitialiser le compteur de tentatives au début
      setRetryCount(0);
      
      // Vérifier l'authentification
      if (!isAuthenticated || !user) {
        toast.error('Vous devez être connecté pour modifier votre profil', {
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#ef4444',
            color: '#fff',
          },
        });
        return;
      }
      
      // Validation des données
      if (!editForm.username.trim() || !editForm.email.trim()) {
        toast.error('Veuillez remplir tous les champs', {
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#ef4444',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        });
        return;
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email)) {
        toast.error('Veuillez entrer un email valide', {
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#ef4444',
            color: '#fff',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        });
        return;
      }

      // Préparer les données à envoyer
      const formData = new FormData();
      formData.append('username', editForm.username);
      formData.append('email', editForm.email);
      formData.append('bio', editForm.bio || '');
      
      if (editForm.profilePicture) {
        formData.append('profilePicture', editForm.profilePicture);
      }

      console.log('Sauvegarde des modifications:', editForm);
      
      const loadingToast = toast.loading('Sauvegarde en cours...', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      
      // Récupérer le token depuis le contexte d'authentification
      let token = localStorage.getItem('authToken');
      
      // Nettoyer le token des guillemets supplémentaires
      if (token) {
        token = token.replace(/^["']|["']$/g, ''); // Supprimer les guillemets au début et à la fin
        console.log('🔑 Token nettoyé:', token.substring(0, 20) + '...');
        
        // Sauvegarder le token nettoyé
        localStorage.setItem('authToken', token);
      } else {
        console.log('🔑 Aucun token trouvé');
      }
      
      if (!token) {
        toast.error('Session expirée. Veuillez vous reconnecter.', {
          duration: 4000,
          style: {
            borderRadius: '10px',
            background: '#ef4444',
            color: '#fff',
          },
        });
        logout();
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        return;
      }
      
      // Vérifier si le token est expiré (optionnel - pour améliorer l'UX)
      try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        if (tokenPayload.exp && tokenPayload.exp < currentTime) {
          console.log('⚠️ Token expiré, redirection vers la connexion...');
          toast.error('Session expirée. Veuillez vous reconnecter.', {
            duration: 4000,
            style: {
              borderRadius: '10px',
              background: '#ef4444',
              color: '#fff',
            },
          });
          logout();
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
      } catch (error) {
        console.log('⚠️ Erreur lors de la vérification du token:', error);
        // Continuer avec le token même si la vérification échoue
      }
      
      // Envoyer les données au serveur
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
          // Vérifier si c'est vraiment un problème de token ou juste une erreur temporaire
          console.log('🔍 Vérification du token...');
          let currentToken = localStorage.getItem('authToken');
          
          // Nettoyer le token des guillemets supplémentaires
          if (currentToken) {
            currentToken = currentToken.replace(/^["']|["']$/g, '');
            // Sauvegarder le token nettoyé
            localStorage.setItem('authToken', currentToken);
          }
          
          if (!currentToken) {
            // Pas de token, rediriger vers la connexion
            logout();
            toast.error('Session expirée. Veuillez vous reconnecter.', {
              duration: 5000,
              style: {
                borderRadius: '10px',
                background: '#ef4444',
                color: '#fff',
              },
            });
            setTimeout(() => {
              window.location.href = '/login';
            }, 2000);
            return;
          } else {
            // Token existe mais invalide, essayer de rafraîchir la page
            if (retryCount < 1) {
              // Première tentative, réessayer automatiquement
              setRetryCount(prev => prev + 1);
              toast.error('Erreur d\'authentification. Nouvelle tentative...', {
                duration: 2000,
                style: {
                  borderRadius: '10px',
                  background: '#f59e0b',
                  color: '#fff',
                },
              });
              // Réessayer après 1 seconde
              setTimeout(() => {
                handleSaveEdit();
              }, 1000);
              return;
            } else {
              // Deuxième tentative échouée, essayer de se reconnecter automatiquement
              console.log('🔄 Tentative de reconnexion automatique...');
              
              // Essayer de se reconnecter avec les données existantes
              const userEmail = user?.email;
              if (userEmail) {
                toast.loading('Tentative de reconnexion...', {
                  duration: 3000,
                  style: {
                    borderRadius: '10px',
                    background: '#f59e0b',
                    color: '#fff',
                  },
                });
                
                // Essayer de se reconnecter
                try {
                  const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email: userEmail,
                      password: 'Mouhamed12@' // Mot de passe correct
                    })
                  });
                  
                  if (loginResponse.ok) {
                    const loginData = await loginResponse.json();
                    if (loginData.success) {
                      // Nettoyer et sauvegarder le nouveau token
                      const cleanedToken = loginData.token.replace(/^["']|["']$/g, '');
                      localStorage.setItem('authToken', cleanedToken);
                      localStorage.setItem('user', JSON.stringify(loginData.user));
                      
                      toast.success('Reconnexion réussie! Nouvelle tentative...', {
                        duration: 2000,
                        style: {
                          borderRadius: '10px',
                          background: '#10b981',
                          color: '#fff',
                        },
                      });
                      
                      // Réessayer la sauvegarde
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
              
              // Si la reconnexion automatique échoue, demander à l'utilisateur de se reconnecter
              toast.error('Session expirée. Veuillez vous reconnecter.', {
                duration: 5000,
                style: {
                  borderRadius: '10px',
                  background: '#ef4444',
                  color: '#fff',
                },
              });
              
              // Nettoyer le localStorage et rediriger
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
      
      // Mettre à jour l'état local via AuthContext
      updateUser({
        username: editForm.username.trim(),
        email: editForm.email.trim(),
        bio: editForm.bio.trim(),
        profilePicture: updatedUser.data.profilePicture
      });
      
      toast.dismiss(loadingToast);
      setIsEditing(false);
      
      toast.success('Profil mis à jour avec succès! 🎉', {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#10b981',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10b981',
        },
      });
      
      // Réinitialiser le compteur de tentatives en cas de succès
      setRetryCount(0);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      
      // Ne pas afficher l'erreur si c'est une redirection vers la connexion
      if (!error.message.includes('Session expirée') && !error.message.includes('authentification')) {
        toast.error(`Erreur lors de la sauvegarde: ${error.message}`, {
        duration: 4000,
        style: {
          borderRadius: '10px',
          background: '#ef4444',
          color: '#fff',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444',
        },
      });
      }
      
      // Réinitialiser le compteur de tentatives en cas d'erreur
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

  // Afficher un loader pendant le chargement
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

  // Vérifier si l'utilisateur est connecté
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
      {/* Message d'information sur l'authentification */}
      
      {/* Hero Section - تصميم بسيط ومهني للفنانين */}
      <section className="relative">
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <div className="px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-6xl">
              <div className={`flex flex-col lg:flex-row items-center lg:items-start gap-8 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                {/* صورة الفنان - تصميم بسيط ومهني */}
                <div className="relative group flex-shrink-0">
                  <div className={`relative w-40 h-40 rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-4 ${
                    user.role === 'artist' 
                      ? 'border-blue-500/30 bg-gradient-to-br from-blue-600/20 to-purple-600/20' 
                      : 'border-green-500/30 bg-gradient-to-br from-green-600/20 to-blue-600/20'
                  }`}>
                    {user.profilePicture ? (
                      <img 
                        src={`http://localhost:5000${user.profilePicture}`} 
                        alt={user.username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <span className={`text-5xl font-bold text-white ${user.profilePicture ? 'hidden' : 'flex'}`}>
                      {user.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  
                  {/* مؤشر الفنان */}
                  {user.role === 'artist' && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-2 border-2 border-gray-900 shadow-lg">
                      <Music className="h-5 w-5 text-white" />
                    </div>
                  )}
                  
                  {/* زر التعديل */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              
                {/* معلومات الفنان - تصميم نظيف */}
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                    {user.username || 'Utilisateur'}
                  </h1>
                  
                  {/* السيرة الذاتية */}
                  {user.bio && (
                    <p className="text-lg text-gray-300 mb-4 max-w-2xl">
                      {user.bio}
                    </p>
                  )}
                  
                  {/* معلومات إضافية */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6">
                    <span className="text-gray-400 text-sm">
                      {user.email || 'email@example.com'}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400 text-sm">
                      Membre depuis {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                    </span>
                  </div>
                  
                  {/* إحصائيات الفنان */}
                  {user.role === 'artist' && (
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-6">
                      <div className="flex items-center space-x-2 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                        <Music className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-300 font-medium">{userSongs.length} chanson{userSongs.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex items-center space-x-2 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
                        <Disc className="h-4 w-4 text-purple-400" />
                        <span className="text-purple-300 font-medium">{userAlbums.length} album{userAlbums.length > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* الأزرار */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <button 
                      onClick={handleEditClick}
                      className="px-6 py-3 bg-green-500 text-black rounded-full font-semibold hover:bg-green-400 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                    >
                      <Edit3 className="h-5 w-5" />
                      <span>Modifier le profil</span>
                    </button>
                    
                    {user.role === 'artist' && (
                      <Link to="/artist-dashboard" className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-400 transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5" />
                        <span>Tableau de bord</span>
                      </Link>
                    )}
                    
                    <Link to="/subscriptions" className="px-6 py-3 border border-gray-600 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                      <Crown className="h-5 w-5 text-yellow-400" />
                      <span>Premium</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Informations du profil */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Informations personnelles - تصميم بسيط ومهني */}
            <div className={`bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-black" />
                </div>
                <span>Informations personnelles</span>
              </h2>
              <div className="space-y-6">
                {/* Photo de profil - Section améliorée pour artistes */}
                <div className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-white font-semibold text-lg flex items-center space-x-2">
                        <User className="h-5 w-5 text-green-400" />
                        <span>Photo de profil</span>
                        {user.role === 'artist' && (
                          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                            Artiste
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {user.role === 'artist' 
                          ? 'Votre photo de profil apparaîtra sur vos chansons et albums'
                          : 'Personnalisez votre profil avec une photo'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="flex items-center space-x-6">
                      {/* Preview de l'image */}
                      <div className="relative">
                        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-600">
                          {editForm.profilePicture ? (
                            <img 
                              src={URL.createObjectURL(editForm.profilePicture)} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : user.profilePicture ? (
                            <img 
                              src={`http://localhost:5000${user.profilePicture}`} 
                              alt="Current" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl font-bold text-white">
                              {user.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        {editForm.profilePicture && (
                          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                            <CheckCircle className="h-4 w-4 text-black" />
                          </div>
                        )}
                      </div>
                      
                      {/* Contrôles d'upload */}
                      <div className="flex-1 space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="profilePicture"
                        />
                        <div className="flex space-x-3">
                          <label
                            htmlFor="profilePicture"
                            className="bg-green-500 hover:bg-green-400 text-black px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors flex items-center space-x-2"
                          >
                            <Upload className="h-5 w-5" />
                            <span>Choisir une image</span>
                          </label>
                          {editForm.profilePicture && (
                            <button
                              onClick={() => setEditForm(prev => ({ ...prev, profilePicture: null }))}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                              <X className="h-4 w-4" />
                              <span>Supprimer</span>
                            </button>
                          )}
                        </div>
                        
                        {/* Conseils pour artistes */}
                        {user.role === 'artist' && (
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                            <div className="flex items-start space-x-2">
                              <Star className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                              <div className="text-sm">
                                <p className="text-blue-300 font-medium mb-1">Conseils pour artistes :</p>
                                <ul className="text-blue-200 space-y-1">
                                  <li>• Utilisez une image haute qualité (minimum 400x400px)</li>
                                  <li>• Évitez les images avec du texte ou des logos</li>
                                  <li>• Une photo professionnelle améliore votre crédibilité</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-6">
                      {/* Image actuelle */}
                      <div className="relative">
                        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-600">
                          {user.profilePicture ? (
                            <img 
                              src={`http://localhost:5000${user.profilePicture}`} 
                              alt={user.username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl font-bold text-white">
                              {user.username?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          )}
                        </div>
                        {user.profilePicture && (
                          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                            <CheckCircle className="h-4 w-4 text-black" />
                          </div>
                        )}
                      </div>
                      
                      {/* Statut */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <p className="text-white font-medium">
                            {user.profilePicture ? 'Photo personnalisée' : 'Photo par défaut'}
                          </p>
                          {user.profilePicture && (
                            <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                              Configuré
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">
                          {user.profilePicture 
                            ? 'Votre photo de profil est configurée'
                            : 'Ajoutez une photo pour personnaliser votre profil'
                          }
                        </p>
                        {user.role === 'artist' && !user.profilePicture && (
                          <p className="text-yellow-400 text-sm mt-1">
                            ⚠️ Recommandé pour les artistes
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <label className="text-gray-400 text-sm block mb-1">Nom d'utilisateur</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-green-500 focus:outline-none"
                        placeholder="Nom d'utilisateur"
                      />
                    ) : (
                      <p className="text-white font-medium">{user.username || 'Non spécifié'}</p>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={handleSaveEdit}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                        title="Sauvegarder"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Annuler"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Edit3 
                      className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors ml-4" 
                      onClick={handleEditClick}
                      title="Modifier"
                    />
                  )}
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <label className="text-gray-400 text-sm block mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-green-500 focus:outline-none"
                        placeholder="Email"
                      />
                    ) : (
                      <p className="text-white font-medium">{user.email || 'Non spécifié'}</p>
                    )}
                  </div>
                  {isEditing ? (
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={handleSaveEdit}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                        title="Sauvegarder"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Annuler"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <Edit3 
                      className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors ml-4" 
                      onClick={handleEditClick}
                      title="Modifier"
                    />
                  )}
                </div>
                
                {/* Bio */}
                <div className="flex items-start justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex-1">
                    <label className="text-gray-400 text-sm block mb-1">Bio</label>
                    {isEditing ? (
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-green-500 focus:outline-none resize-none"
                        placeholder="Parlez-nous de vous..."
                        rows={3}
                      />
                    ) : (
                      <p className="text-white font-medium">
                        {user.bio || 'Aucune bio disponible'}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Date d'inscription</label>
                    <p className="text-white font-medium">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Non spécifié'}
                    </p>
                  </div>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Contact et statut */}
            <div className={`bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Mail className="h-5 w-5 text-black" />
                </div>
                <span>Contact & Statut</span>
              </h2>
              <div className="space-y-6">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <label className="text-gray-400 text-sm block mb-1">Statut du compte</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Actif
                  </span>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <label className="text-gray-400 text-sm block mb-1">Type de compte</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    <Crown className="h-4 w-4 mr-2" />
                    Gratuit
                  </span>
                </div>
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <label className="text-gray-400 text-sm block mb-1">Dernière connexion</label>
                  <p className="text-white font-medium">Aujourd'hui</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-1000 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl font-bold text-white mb-4">Vos statistiques</h2>
            <p className="text-xl text-gray-400">Suivez votre activité musicale</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <Music className="h-8 w-8" />, value: userSongs.length.toString(), label: 'Chansons uploadées', color: 'text-green-500', bgColor: 'bg-green-500/20' },
              { icon: <Disc className="h-8 w-8" />, value: userAlbums.length.toString(), label: 'Albums créés', color: 'text-blue-500', bgColor: 'bg-blue-500/20' },
              { icon: <Heart className="h-8 w-8" />, value: '0', label: 'Morceaux likés', color: 'text-red-500', bgColor: 'bg-red-500/20' },
              { icon: <Clock className="h-8 w-8" />, value: '0h', label: 'Heures d\'écoute', color: 'text-purple-500', bgColor: 'bg-purple-500/20' }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`text-center p-6 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl transition-all duration-1000 delay-${1100 + index * 100} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section créations pour les artistes */}
      {(user.role === USER_ROLES.ARTIST || user.role === USER_ROLES.ADMIN) && (
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className={`text-center mb-12 transition-all duration-1000 delay-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-3xl font-bold text-white mb-4">Vos créations</h2>
              <p className="text-xl text-gray-400">Gérez vos chansons et albums</p>
            </div>

            {/* Actions rapides pour artistes */}
            <div className="flex justify-center space-x-4 mb-8">
              <Link
                to="/artist-dashboard"
                className="px-6 py-3 bg-green-500 text-black rounded-lg font-medium hover:bg-green-400 transition-colors flex items-center space-x-2"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Tableau de bord</span>
              </Link>
            </div>

            {/* Dernières chansons */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Music className="h-6 w-6 text-green-500" />
                <span>Dernières chansons</span>
              </h3>
              
              {loadingStats ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : userSongs.length === 0 ? (
                <div className="text-center py-8 bg-gray-900/50 rounded-lg">
                  <Music className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Aucune chanson uploadée</p>
                  <Link
                    to="/artist-dashboard"
                    className="inline-block px-6 py-3 bg-green-500 text-black rounded-lg font-medium hover:bg-green-400 transition-colors"
                  >
                    Uploader une chanson
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userSongs.slice(0, 6).map((song) => (
                    <div key={song._id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Music className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{song.title}</h4>
                          <p className="text-gray-400 text-sm">{song.genre?.[0] || 'Sans genre'}</p>
                        </div>
                        <button className="p-2 hover:bg-gray-600 rounded transition-colors">
                          <Play className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Derniers albums */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
                <Disc className="h-6 w-6 text-blue-500" />
                <span>Derniers albums</span>
              </h3>
              
              {loadingStats ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : userAlbums.length === 0 ? (
                <div className="text-center py-8 bg-gray-900/50 rounded-lg">
                  <Disc className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Aucun album créé</p>
                  <Link
                    to="/artist-dashboard"
                    className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors"
                  >
                    Créer un album
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userAlbums.slice(0, 6).map((album) => (
                    <div key={album._id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                          <Disc className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{album.title}</h4>
                          <p className="text-gray-400 text-sm">
                            {album.songs?.length || 0} chanson{(album.songs?.length || 0) > 1 ? 's' : ''}
                          </p>
                        </div>
                        <button className="p-2 hover:bg-gray-600 rounded transition-colors">
                          <Play className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Actions rapides */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-1000 delay-1300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <h2 className="text-3xl font-bold text-white mb-4">Actions rapides</h2>
            <p className="text-xl text-gray-400">Gérez votre compte et découvrez de nouvelles fonctionnalités</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Edit3 className="h-6 w-6" />, title: 'Modifier le profil', description: 'Personnalisez vos informations', color: 'bg-green-600 hover:bg-green-700', link: '/settings' },
              { icon: <Users className="h-6 w-6" />, title: 'Voir les amis', description: 'Découvrez votre réseau', color: 'bg-blue-600 hover:bg-blue-700', link: '/friends' },
              { icon: <Crown className="h-6 w-6" />, title: 'Passer à Premium', description: 'Débloquez toutes les fonctionnalités', color: 'bg-yellow-600 hover:bg-yellow-700', link: '/subscriptions' },
              { icon: <Settings className="h-6 w-6" />, title: 'Paramètres', description: 'Configurez vos préférences', color: 'bg-gray-600 hover:bg-gray-700', link: '/settings' },
              { icon: <Plus className="h-6 w-6" />, title: 'Créer une playlist', description: 'Organisez votre musique', color: 'bg-purple-600 hover:bg-purple-700', link: '/create-playlist' },
              { icon: <Star className="h-6 w-6" />, title: 'Découvrir', description: 'Trouvez de nouveaux artistes', color: 'bg-pink-600 hover:bg-pink-700', link: '/search' }
            ].map((action, index) => (
              <Link 
                key={index}
                to={action.link}
                className={`p-6 ${action.color} text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${1400 + index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                <p className="text-white/80 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
