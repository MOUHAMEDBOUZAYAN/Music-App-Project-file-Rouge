import React, { useState } from 'react';
import { Search as SearchIcon, Music, User, Disc } from 'lucide-react';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: SearchIcon },
    { id: 'songs', name: 'Songs', icon: Music },
    { id: 'artists', name: 'Artists', icon: User },
    { id: 'albums', name: 'Albums', icon: Disc },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery, 'in category:', activeCategory);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Search</h1>
        <p className="text-gray-300">Find your favorite music, artists, and albums</p>
      </div>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search for songs, artists, or albums..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        </form>
      </div>

      {/* Search Categories */}
      <div className="flex justify-center space-x-4">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search Results Placeholder */}
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">
          {searchQuery ? (
            <p>Search results for "{searchQuery}" will appear here</p>
          ) : (
            <p>Start typing to search for music</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search; 