import React, { useState, useEffect } from 'react';
import { Play, Heart } from 'lucide-react';
import { musicDataService } from '../services/musicDataService';

const PopularAlbums = () => {
  const [popularAlbums, setPopularAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularAlbums = async () => {
      try {
        setLoading(true);
        const result = await musicDataService.getPopularAlbums(20);
        
        if (result.success) {
          setPopularAlbums(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Erreur lors du chargement des albums populaires');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularAlbums();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-bemusic-primary mb-8">Albums Populaires</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-bemusic-secondary text-lg">Chargement des albums...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-bemusic-primary mb-8">Albums Populaires</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-bemusic-primary mb-8">Albums Populaires</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {popularAlbums.map((album) => (
          <div key={album.id} className="group">
            <div className="relative">
              {/* Couverture de l'album */}
              <div className="aspect-square rounded-bemusic-lg overflow-hidden bg-bemusic-tertiary relative group shadow-bemusic hover:shadow-bemusic-lg">
                <img
                  src={album.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop'}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-bemusic"
                />
                
                {/* Bouton de lecture */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-bemusic flex items-center justify-center">
                  <button className="w-12 h-12 bg-accent-bemusic rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-bemusic hover:scale-110">
                    <Play className="w-5 h-5 text-bemusic-primary ml-1" />
                  </button>
                </div>
                
                {/* Bouton like */}
                <button className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-bemusic">
                  <Heart className="w-4 h-4 text-bemusic-primary" />
                </button>
              </div>
              
              {/* Informations de l'album */}
              <div className="mt-3">
                <h3 className="font-semibold text-bemusic-primary text-sm truncate group-hover:text-accent-bemusic transition-bemusic">
                  {album.title}
                </h3>
                <p className="text-bemusic-secondary text-sm truncate">
                  {album.artist}
                </p>
                <span className="text-xs text-bemusic-tertiary bg-bemusic-tertiary px-2 py-1 rounded-bemusic">
                  {album.genre}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularAlbums;
