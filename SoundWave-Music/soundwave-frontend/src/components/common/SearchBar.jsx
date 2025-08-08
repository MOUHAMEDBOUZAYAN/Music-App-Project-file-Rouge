import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter, Music, User, Disc, Mic } from 'lucide-react';

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search for songs, artists, or albums...",
  showFilters = true,
  showSuggestions = true,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const filters = [
    { id: 'all', name: 'All', icon: Search },
    { id: 'songs', name: 'Songs', icon: Music },
    { id: 'artists', name: 'Artists', icon: User },
    { id: 'albums', name: 'Albums', icon: Disc },
    { id: 'playlists', name: 'Playlists', icon: Music },
  ];

  // Mock suggestions - in real app, this would come from API
  const mockSuggestions = [
    { id: 1, type: 'song', title: 'Bohemian Rhapsody', artist: 'Queen', icon: Music },
    { id: 2, type: 'artist', title: 'Queen', subtitle: 'Rock Band', icon: User },
    { id: 3, type: 'album', title: 'A Night at the Opera', artist: 'Queen', icon: Disc },
    { id: 4, type: 'song', title: 'Bohemian Rhapsody - Live', artist: 'Queen', icon: Music },
  ];

  // Handle search
  const handleSearch = (searchQuery = query, filter = activeFilter) => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      onSearch?.(searchQuery.trim(), filter);
      
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsFocused(false);
      }, 1000);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim() && showSuggestions) {
      // Filter suggestions based on query
      const filtered = mockSuggestions.filter(item =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.artist?.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    handleSearch(suggestion.title, suggestion.type);
  };

  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (query.trim()) {
      handleSearch(query, filter);
    }
  };

  // Handle voice search (placeholder)
  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleSearch(transcript, activeFilter);
      };
      
      recognition.start();
    } else {
      alert('Voice search is not supported in this browser');
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  // Handle clear
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-12 pr-20 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          
          {/* Search Icon */}
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          
          {/* Voice Search Button */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
          >
            <Mic className="h-4 w-4" />
          </button>
          
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-20 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {/* Filter Toggle */}
          {showFilters && (
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <Filter className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg border border-gray-700 p-2 z-10">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange(filter.id)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    activeFilter === filter.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{filter.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {isFocused && suggestions.length > 0 && showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-20 max-h-64 overflow-y-auto">
          {suggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            return (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center space-x-3 p-3 hover:bg-gray-700 transition-colors text-left"
              >
                <Icon className="h-4 w-4 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{suggestion.title}</p>
                  {suggestion.artist && (
                    <p className="text-gray-400 text-xs truncate">{suggestion.artist}</p>
                  )}
                </div>
                <span className="text-gray-500 text-xs capitalize">{suggestion.type}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg border border-gray-700 p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-gray-400 text-sm">Searching...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 