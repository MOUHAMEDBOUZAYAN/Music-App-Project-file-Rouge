import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, AlertTriangle } from 'lucide-react';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireRole = null, 
  requireArtist = false,
  requireAdmin = false,
  fallbackComponent = null 
}) => {
  const { isAuthenticated, user, isLoading, hasRole, isArtist, isAdmin } = useAuth();
  const location = useLocation();

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si l'authentification n'est pas requise, afficher directement le contenu
  if (!requireAuth) {
    return children;
  }

  // Vérifier si l'utilisateur est authentifié
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          message: 'Vous devez être connecté pour accéder à cette page',
          redirectTo: location.pathname 
        }} 
        replace 
      />
    );
  }

  // Vérifier les rôles spécifiques
  if (requireRole && !hasRole(requireRole)) {
    return fallbackComponent || (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Accès restreint</h2>
          <p className="text-gray-400 mb-4">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <p className="text-gray-500 text-sm">
            Rôle requis : {requireRole}
          </p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur doit être un artiste
  if (requireArtist && !isArtist()) {
    return fallbackComponent || (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Accès restreint aux artistes</h2>
          <p className="text-gray-400 mb-4">
            Cette fonctionnalité est réservée aux artistes.
          </p>
          <p className="text-gray-500 text-sm">
            Mettez à jour votre profil pour devenir artiste et accéder à cette fonctionnalité.
          </p>
        </div>
      </div>
    );
  }

  // Vérifier si l'utilisateur doit être un admin
  if (requireAdmin && !isAdmin()) {
    return fallbackComponent || (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Accès administrateur requis</h2>
          <p className="text-gray-400 mb-4">
            Cette fonctionnalité est réservée aux administrateurs.
          </p>
        </div>
      </div>
    );
  }

  // Si toutes les vérifications sont passées, afficher le contenu
  return children;
};

export default ProtectedRoute;
