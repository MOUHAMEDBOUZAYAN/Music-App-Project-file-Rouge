import React from 'react';

const Home = () => {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to SoundWave
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Discover, listen, and create your perfect music experience. 
          Your journey through music starts here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Featured Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Featured</h2>
          <p className="text-gray-400">Discover trending music and new releases</p>
        </div>

        {/* Recently Played */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recently Played</h2>
          <p className="text-gray-400">Continue where you left off</p>
        </div>

        {/* Your Mixes */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Your Mixes</h2>
          <p className="text-gray-400">Personalized playlists just for you</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 