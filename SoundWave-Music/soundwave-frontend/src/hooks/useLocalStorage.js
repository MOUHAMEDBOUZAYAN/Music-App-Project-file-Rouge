// useLocalStorage hook will be implemented here 
import { useState, useEffect } from 'react';
import { secureStorage } from '../utils/helpers.js';

export const useLocalStorage = (key, initialValue) => {
  // État pour stocker la valeur
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Récupérer la valeur du localStorage
      const item = secureStorage.get(key);
      return item !== null ? item : initialValue;
    } catch (error) {
      console.error(`Erreur lors de la lecture de ${key}:`, error);
      return initialValue;
    }
  });

  // Fonction pour mettre à jour la valeur
  const setValue = (value) => {
    try {
      // Permettre à la valeur d'être une fonction pour avoir la même API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Sauvegarder dans l'état
      setStoredValue(valueToStore);
      
      // Sauvegarder dans le localStorage
      secureStorage.set(key, valueToStore);
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    }
  };

  // Fonction pour supprimer la valeur
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      secureStorage.remove(key);
    } catch (error) {
      console.error(`Erreur lors de la suppression de ${key}:`, error);
    }
  };

  // Écouter les changements du localStorage (pour synchroniser entre onglets)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Erreur lors de la synchronisation de ${key}:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue, removeValue];
};

// Hook spécialisé pour les préférences utilisateur
export const useUserPreferences = () => {
  const [preferences, setPreferences, removePreferences] = useLocalStorage('userPreferences', {
    theme: 'dark',
    language: 'fr',
    volume: 0.8,
    autoplay: true,
    shuffle: false,
    repeat: 'none',
    quality: 'high',
    notifications: true
  });

  const updatePreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    preferences,
    updatePreference,
    setPreferences,
    removePreferences
  };
};

// Hook pour gérer l'historique de recherche
export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory, removeSearchHistory] = useLocalStorage('searchHistory', []);

  const addToHistory = (searchTerm) => {
    if (!searchTerm.trim()) return;
    
    setSearchHistory(prev => {
      const filtered = prev.filter(term => term !== searchTerm);
      return [searchTerm, ...filtered].slice(0, 10); // Garder seulement les 10 dernières recherches
    });
  };

  const removeFromHistory = (searchTerm) => {
    setSearchHistory(prev => prev.filter(term => term !== searchTerm));
  };

  const clearHistory = () => {
    removeSearchHistory();
  };

  return {
    searchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
};

// Hook pour gérer les favoris locaux (cache)
export const useFavorites = () => {
  const [favorites, setFavorites, removeFavorites] = useLocalStorage('favorites', []);

  const addToFavorites = (item) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === item.id);
      if (exists) return prev;
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromFavorites = (itemId) => {
    setFavorites(prev => prev.filter(fav => fav.id !== itemId));
  };

  const isFavorite = (itemId) => {
    return favorites.some(fav => fav.id === itemId);
  };

  const clearFavorites = () => {
    removeFavorites();
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites
  };
};