import React from 'react';
import { Play, Heart, Clock } from 'lucide-react';

const PopularSongs = () => {
  const popularSongs = [
    {
      id: 1,
      title: "Golden",
      artist: "HUNTR/X, Ejae, AUDREY N...",
      album: "KPop Demon Hunters (Soundtrack from the Netflix Film)",
      duration: "03:14",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 2,
      title: "back to friends",
      artist: "sombr",
      album: "back to friends",
      duration: "03:19",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 3,
      title: "Your Idol",
      artist: "Saja Boys, Andrew Choi, N...",
      album: "KPop Demon Hunters (Soundtrack from the Netflix Film)",
      duration: "03:11",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 4,
      title: "How It's Done",
      artist: "HUNTR/X, Ejae, AUDREY N...",
      album: "KPop Demon Hunters (Soundtrack from the Netflix Film)",
      duration: "02:56",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 5,
      title: "Soda Pop",
      artist: "Saja Boys, Andrew Choi, N...",
      album: "KPop Demon Hunters (Soundtrack from the Netflix Film)",
      duration: "02:30",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 6,
      title: "BIRDS OF A FEATHER",
      artist: "Billie Eilish",
      album: "HIT ME HARD AND SOFT",
      duration: "03:30",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 7,
      title: "JUMP",
      artist: "BLACKPINK",
      album: "JUMP",
      duration: "02:44",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 8,
      title: "DAISIES",
      artist: "Justin Bieber",
      album: "SWAG",
      duration: "02:56",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 9,
      title: "What It Sounds Like",
      artist: "HUNTR/X, Ejae, AUDREY N...",
      album: "KPop Demon Hunters (Soundtrack from the Netflix Film)",
      duration: "04:10",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 10,
      title: "Takedown",
      artist: "HUNTR/X, Ejae, AUDREY N...",
      album: "KPop Demon Hunters (Soundtrack from the Netflix Film)",
      duration: "03:02",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 11,
      title: "Free",
      artist: "RUMI, Jinu, Ejae, Andrew C...",
      album: "KPop Demon Hunters (Soundtrack from the Netflix Film)",
      duration: "03:07",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 12,
      title: "Manchild",
      artist: "Sabrina Carpenter",
      album: "Manchild",
      duration: "03:33",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 13,
      title: "undressed",
      artist: "sombr",
      album: "undressed",
      duration: "03:02",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 14,
      title: "Just Keep Watching (From F1 Th...)",
      artist: "Tate McRae, F1 The Album",
      album: "Just Keep Watching (From F1 Th...)",
      duration: "02:22",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    },
    {
      id: 15,
      title: "DIMF",
      artist: "Bad Bunny",
      album: "DeBÍ TIRAR MÁS FOTOS",
      duration: "03:57",
      cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop"
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-bemusic-primary mb-8">Chansons Populaires</h1>
      
      <div className="bg-bemusic-tertiary rounded-bemusic-lg overflow-hidden shadow-bemusic">
        <table className="w-full">
          <thead>
            <tr className="border-b border-bemusic-primary">
              <th className="text-left p-4 text-bemusic-secondary font-medium">#</th>
              <th className="text-left p-4 text-bemusic-secondary font-medium">Titre</th>
              <th className="text-left p-4 text-bemusic-secondary font-medium">Artiste</th>
              <th className="text-left p-4 text-bemusic-secondary font-medium">Album</th>
              <th className="text-center p-4 text-bemusic-secondary font-medium">
                <Heart className="w-4 h-4 mx-auto" />
              </th>
              <th className="text-center p-4 text-bemusic-secondary font-medium">
                <Clock className="w-4 h-4 mx-auto" />
              </th>
            </tr>
          </thead>
          <tbody>
            {popularSongs.map((song, index) => (
              <tr 
                key={song.id} 
                className="border-b border-bemusic-primary hover:bg-bemusic-hover transition-bemusic group"
              >
                <td className="p-4 text-bemusic-secondary text-sm">{index + 1}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={song.cover} 
                      alt={song.title}
                      className="w-10 h-10 rounded-bemusic object-cover"
                    />
                    <div>
                      <div className="text-bemusic-primary font-medium group-hover:text-accent-bemusic transition-bemusic">
                        {song.title}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-bemusic-secondary text-sm">{song.artist}</td>
                <td className="p-4 text-bemusic-secondary text-sm truncate max-w-xs">{song.album}</td>
                <td className="p-4 text-center">
                  <button className="text-bemusic-secondary hover:text-bemusic-primary transition-bemusic">
                    <Heart className="w-4 h-4" />
                  </button>
                </td>
                <td className="p-4 text-center text-bemusic-secondary text-sm">{song.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PopularSongs;
