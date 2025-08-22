import React, { useState } from 'react';
import DeezerService from '../../services/deezerService';
import toast from 'react-hot-toast';

const SpotifyTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState({});

  const testDeezerConnection = async () => {
    setIsLoading(true);
    setTestResults({});
    
    try {
      // Test 1: Rechercher des morceaux
      try {
        const search = await DeezerService.search('Ed Sheeran', 5);
        setTestResults(prev => ({ 
          ...prev, 
          search: `✅ Recherche: ${search.data?.length || 0} résultats` 
        }));
      } catch (error) {
        setTestResults(prev => ({ ...prev, search: `❌ Erreur recherche: ${error.message}` }));
      }

      // Test 2: Nouvelles sorties
      try {
        const newReleases = await DeezerService.getNewReleases(5);
        setTestResults(prev => ({ 
          ...prev, 
          newReleases: `✅ Nouvelles sorties: ${newReleases.data?.length || 0} albums` 
        }));
      } catch (error) {
        setTestResults(prev => ({ ...prev, newReleases: `❌ Erreur nouvelles sorties: ${error.message}` }));
      }

      // Test 3: Playlists en vedette
      try {
        const featured = await DeezerService.getFeaturedPlaylists(5);
        setTestResults(prev => ({ 
          ...prev, 
          featured: `✅ Playlists: ${featured.data?.length || 0} playlists` 
        }));
      } catch (error) {
        setTestResults(prev => ({ ...prev, featured: `❌ Erreur playlists: ${error.message}` }));
      }

      toast.success('Tests terminés !');
    } catch (error) {
      console.error('Erreur lors des tests:', error);
      toast.error('Erreur lors des tests');
    } finally {
      setIsLoading(false);
    }
  };

  const connectToDeezer = () => {
    console.log('Connexion à Deezer...');
    // Deezer ne nécessite pas de connexion
    toast.success('Deezer est prêt à utiliser !');
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 Test de l'API Spotify</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <p className="text-gray-300 mb-4">
            Assurez-vous d'avoir configuré vos clés Spotify dans{' '}
            <code className="bg-gray-700 px-2 py-1 rounded">src/config/spotify-keys.js</code>
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 rounded-full bg-gray-600"></span>
              <span>1. Allez sur <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Spotify Developer Dashboard</a></span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 rounded-full bg-gray-600"></span>
              <span>2. Créez une nouvelle application</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 rounded-full bg-gray-600"></span>
              <span>3. Copiez le Client ID et Client Secret</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-4 h-4 rounded-full bg-gray-600"></span>
              <span>4. Ajoutez <code className="bg-gray-700 px-2 py-1 rounded">http://localhost:3000/spotify-callback</code> dans les Redirect URIs</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     <button
             onClick={connectToDeezer}
             className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
           >
             🎵 Tester Deezer
           </button>
           
           <button
             onClick={testDeezerConnection}
             disabled={isLoading}
             className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
           >
             {isLoading ? '⏳ Tests en cours...' : '🧪 Tester l\'API Deezer'}
           </button>
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Résultats des tests</h2>
            <div className="space-y-2">
              {Object.entries(testResults).map(([key, result]) => (
                <div key={key} className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400 w-24">{key}:</span>
                  <span className={result.startsWith('✅') ? 'text-green-400' : 'text-red-400'}>
                    {result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">Dépannage</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• Si vous obtenez "Pas de token", connectez-vous d'abord à Spotify</p>
            <p>• Si vous obtenez des erreurs 401, vos clés Spotify sont incorrectes</p>
            <p>• Si vous obtenez des erreurs 403, vérifiez les scopes d'autorisation</p>
            <p>• Assurez-vous que votre app Spotify a le bon Redirect URI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyTest;
