import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { FaUser, FaEnvelope, FaCalendar, FaEdit } from 'react-icons/fa';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log('Profile component - user:', user);
  console.log('Profile component - isAuthenticated:', isAuthenticated);
  console.log('Profile component - isLoading:', isLoading);

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur est connecté
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold mb-2">Accès refusé</h1>
          <p className="text-gray-400">Vous devez être connecté pour voir votre profil</p>
          <p className="text-gray-500 text-sm mt-2">État: {isAuthenticated ? 'Connecté' : 'Non connecté'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* En-tête du profil */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <FaUser className="text-4xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user.username || 'Utilisateur'}</h1>
              <p className="text-green-100 text-lg">Membre SoundWave</p>
            </div>
            <button className="ml-auto px-6 py-3 bg-white text-green-800 font-semibold rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2">
              <FaEdit />
              Modifier
            </button>
          </div>
        </div>

        {/* Informations du profil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaUser className="text-green-500" />
              Informations personnelles
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Nom d'utilisateur</label>
                <p className="text-white font-medium">{user.username || 'Non spécifié'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Nom d'utilisateur</label>
                <p className="text-white font-medium">{user.username || 'Non spécifié'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Date d'inscription</label>
                <p className="text-white font-medium">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Non spécifié'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaEnvelope className="text-green-500" />
              Contact
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Email</label>
                <p className="text-white font-medium">{user.email || 'Non spécifié'}</p>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Statut du compte</label>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Actif
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Statistiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">0</div>
              <p className="text-gray-400">Playlists créées</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">0</div>
              <p className="text-gray-400">Morceaux likés</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">0</div>
              <p className="text-gray-400">Heures d'écoute</p>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-3">
              <FaEdit />
              Modifier le profil
            </button>
            <button className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-3">
              <FaUser />
              Voir les amis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
