import React, { createContext, useContext, useState, useEffect } from 'react';
import DeezerService from '../services/deezerService';

const DeezerContext = createContext();

export const useDeezer = () => {
  const context = useContext(DeezerContext);
  if (!context) {
    throw new Error('useDeezer doit être utilisé dans un DeezerProvider');
  }
  return context;
};

export const DeezerProvider = ({ children }) => {
  const [newReleases, setNewReleases] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [popularAlbums, setPopularAlbums] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les nouvelles sorties
  const loadNewReleases = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await DeezerService.getNewReleases(20);
      console.log('📀 loadNewReleases - Résultat reçu:', result);
      console.log('📀 loadNewReleases - Données extraites:', result.data);
      setNewReleases(result.data?.data || result.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des nouvelles sorties:', err);
      setError('Erreur lors du chargement des nouvelles sorties');
    } finally {
      setLoading(false);
    }
  };

  // Charger les playlists en vedette
  const loadFeaturedPlaylists = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await DeezerService.getFeaturedPlaylists(20);
      console.log('🎵 loadFeaturedPlaylists - Résultat reçu:', result);
      console.log('🎵 loadFeaturedPlaylists - Données extraites:', result.data);
      setFeaturedPlaylists(result.data?.data || result.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des playlists:', err);
      setError('Erreur lors du chargement des playlists');
    } finally {
      setLoading(false);
    }
  };

  // Charger les albums populaires
  const loadPopularAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await DeezerService.getPopularAlbums(20);
      console.log('💿 loadPopularAlbums - Résultat reçu:', result);
      console.log('💿 loadPopularAlbums - Données extraites:', result.data);
      setPopularAlbums(result.data?.data || result.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des albums:', err);
      setError('Erreur lors du chargement des albums');
    } finally {
      setLoading(false);
    }
  };

  // Charger les artistes populaires
  const loadPopularArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await DeezerService.getPopularArtists(20);
      console.log('👤 loadPopularArtists - Résultat reçu:', result);
      console.log('👤 loadPopularArtists - Données extraites:', result.data);
      setPopularArtists(result.data?.data || result.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des artistes:', err);
      setError('Erreur lors du chargement des artistes');
    } finally {
      setLoading(false);
    }
  };

  // Recherche
  const search = async (query, type = 'track,artist,album,playlist', limit = 20) => {
    try {
      setLoading(true);
      setError(null);
      const result = await DeezerService.search(query, limit);
      return result.data;
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      setError('Erreur lors de la recherche');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger toutes les données au montage
  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        loadNewReleases(),
        loadFeaturedPlaylists(),
        loadPopularAlbums(),
        loadPopularArtists()
      ]);
    };

    loadAllData();
  }, []);

  const value = {
    // État
    newReleases,
    featuredPlaylists,
    popularAlbums,
    popularArtists,
    loading,
    error,
    
    // Actions
    loadNewReleases,
    loadFeaturedPlaylists,
    loadPopularAlbums,
    loadPopularArtists,
    search,
    
    // Service direct
    service: DeezerService
  };

  return (
    <DeezerContext.Provider value={value}>
      {children}
    </DeezerContext.Provider>
  );
};

export default DeezerContext;
