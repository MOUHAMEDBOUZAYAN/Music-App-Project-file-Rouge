import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
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
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    setIsVisible(true);
    if (user) {
      setEditForm({
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
    toast.success('Mode édition activé');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      username: user.username || '',
      email: user.email || ''
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

      console.log('Sauvegarde des modifications:', editForm);
      
      // Simulation de sauvegarde
      const loadingToast = toast.loading('Sauvegarde en cours...', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour l'état local via AuthContext
      updateUser({
        username: editForm.username.trim(),
        email: editForm.email.trim()
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
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde du profil', {
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
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/10 to-purple-500/20 animate-pulse"></div>
        <div className="relative px-6 py-20 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className={`flex items-center gap-8 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {/* Avatar */}
              <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-4xl font-bold text-white">
                  {user.username?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              
              {/* Info utilisateur */}
              <div className="flex-1">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  {user.username || 'Utilisateur'}
                </h1>
                <p className="text-xl text-gray-300 mb-6">
                  Membre SoundWave • {user.email || 'email@example.com'}
                </p>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleEditClick}
                    className="px-6 py-3 bg-green-500 text-black rounded-full font-semibold hover:bg-green-400 transition-all duration-200 hover:scale-105 flex items-center space-x-2"
                  >
                    <Edit3 className="h-5 w-5" />
                    <span>Modifier le profil</span>
                  </button>
                  <Link to="/subscriptions" className="px-6 py-3 border border-gray-600 text-white rounded-full font-semibold hover:bg-gray-800 transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    <span>Passer à Premium</span>
                  </Link>
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
            {/* Informations personnelles */}
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
              { icon: <Music className="h-8 w-8" />, value: '0', label: 'Playlists créées', color: 'text-green-500', bgColor: 'bg-green-500/20' },
              { icon: <Heart className="h-8 w-8" />, value: '0', label: 'Morceaux likés', color: 'text-red-500', bgColor: 'bg-red-500/20' },
              { icon: <Clock className="h-8 w-8" />, value: '0h', label: 'Heures d\'écoute', color: 'text-blue-500', bgColor: 'bg-blue-500/20' },
              { icon: <Download className="h-8 w-8" />, value: '0', label: 'Téléchargements', color: 'text-purple-500', bgColor: 'bg-purple-500/20' }
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
