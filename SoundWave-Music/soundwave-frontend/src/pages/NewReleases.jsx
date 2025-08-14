import React from 'react';
import { Play, Heart } from 'lucide-react';

const NewReleases = () => {
  const newReleases = [
    {
      id: 1,
      title: "It Is What It Is",
      artist: "Rachel Chinouriri",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "Indie Pop",
      releaseDate: "2024"
    },
    {
      id: 2,
      title: "A Song For You (Live At The Hollywood Bowl)",
      artist: "The Lumineers",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "Folk Rock",
      releaseDate: "2024"
    },
    {
      id: 3,
      title: "Fame Won't Love You (feat. Paris Hilton)",
      artist: "Paris Hilton, Sia",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "Pop",
      releaseDate: "2024"
    },
    {
      id: 4,
      title: "Midnights (3am Edition)",
      artist: "Taylor Swift",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "Pop",
      releaseDate: "2024"
    },
    {
      id: 5,
      title: "The Secret of Us",
      artist: "Gracie Abrams",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "Indie Pop",
      releaseDate: "2024"
    },
    {
      id: 6,
      title: "Eternal Sunshine",
      artist: "Ariana Grande",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "Pop",
      releaseDate: "2024"
    },
    {
      id: 7,
      title: "brat",
      artist: "Charli XCX",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "Pop",
      releaseDate: "2024"
    },
    {
      id: 8,
      title: "Stick Season",
      artist: "Noah Kahan",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "Folk",
      releaseDate: "2024"
    },
    {
      id: 9,
      title: "GUTS",
      artist: "Olivia Rodrigo",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "Pop Rock",
      releaseDate: "2024"
    },
    {
      id: 10,
      title: "HIT ME HARD AND SOFT",
      artist: "Billie Eilish",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "Pop",
      releaseDate: "2024"
    },
    {
      id: 11,
      title: "DeBÍ TIRAR MÁS FOTOS",
      artist: "Bad Bunny",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "Reggaeton",
      releaseDate: "2024"
    },
    {
      id: 12,
      title: "Short n' Sweet",
      artist: "Sabrina Carpenter",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      genre: "Pop",
      releaseDate: "2024"
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-bemusic-primary mb-8">Nouvelles Sorties</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {newReleases.map((release) => (
          <div key={release.id} className="group">
            <div className="relative">
              {/* Couverture de l'album */}
              <div className="aspect-square rounded-bemusic-lg overflow-hidden bg-bemusic-tertiary relative group shadow-bemusic hover:shadow-bemusic-lg">
                <img
                  src={release.cover}
                  alt={release.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-bemusic"
                />
                
                {/* Badge "NEW" */}
                <div className="absolute top-2 left-2 bg-accent-bemusic text-bemusic-primary text-xs px-2 py-1 rounded-full font-bold">
                  NEW
                </div>
                
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
                  {release.title}
                </h3>
                <p className="text-bemusic-secondary text-sm truncate">
                  {release.artist}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-bemusic-tertiary bg-bemusic-tertiary px-2 py-1 rounded-bemusic">
                    {release.genre}
                  </span>
                  <span className="text-xs text-bemusic-tertiary">
                    {release.releaseDate}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewReleases;
