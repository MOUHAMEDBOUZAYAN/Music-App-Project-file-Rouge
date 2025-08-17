import React from 'react';

const ErrorMessage = ({ error, onRetry, onDismiss, className = '' }) => {
  if (!error) return null;

  const getErrorMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.status === 'NETWORK_ERROR') {
      return 'Erreur de connexion réseau. Vérifiez votre connexion internet et que le serveur backend fonctionne.';
    }
    if (error.status === 'TIMEOUT') {
      return 'La requête a pris trop de temps. Vérifiez votre connexion.';
    }
    return 'Une erreur inattendue s\'est produite.';
  };

  const getErrorIcon = (error) => {
    if (error.status === 'NETWORK_ERROR') return '🌐';
    if (error.status === 'TIMEOUT') return '⏰';
    return '⚠️';
  };

  return (
    <div className={`bg-red-900/20 border border-red-500/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{getErrorIcon(error)}</div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-red-200 font-semibold mb-1">
            Erreur
          </h3>
          <p className="text-red-300 text-sm leading-relaxed">
            {getErrorMessage(error)}
          </p>
          
          {/* Actions */}
          <div className="flex items-center space-x-3 mt-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded transition-colors"
              >
                Réessayer
              </button>
            )}
            
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-red-400 hover:text-red-300 text-xs px-3 py-1.5 rounded transition-colors"
              >
                Fermer
              </button>
            )}
          </div>
        </div>
        
        {/* Bouton de fermeture automatique */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-900/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
