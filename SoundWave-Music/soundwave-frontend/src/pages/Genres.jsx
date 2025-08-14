import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { musicDataService } from '../services/musicDataService';

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const result = await musicDataService.getMusicGenres();
        
        if (result.success) {
          setGenres(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Erreur lors du chargement des genres');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-bemusic-primary mb-8">Genres</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-bemusic-secondary text-lg">Chargement des genres...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-bemusic-primary mb-8">Genres</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500 text-lg">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-bemusic-primary mb-8">Genres</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {genres.map((genre, index) => (
          <Link
            key={index}
            to={genre.path}
            className={`${genre.color} rounded-bemusic-lg p-6 hover:scale-105 transition-bemusic cursor-pointer group shadow-bemusic hover:shadow-bemusic-lg`}
          >
            <div className="h-32 flex items-center justify-center">
              <h3 className="text-bemusic-primary text-lg font-semibold text-center group-hover:text-xl transition-bemusic">
                {genre.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Genres;
