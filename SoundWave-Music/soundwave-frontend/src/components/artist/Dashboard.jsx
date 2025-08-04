import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Play, 
  Heart, 
  Music, 
  Calendar,
  DollarSign,
  Upload,
  BarChart3,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  // Mock data for artist dashboard
  const stats = {
    totalStreams: 1247500,
    monthlyListeners: 45600,
    totalFollowers: 23400,
    totalLikes: 8900,
    totalSongs: 24,
    totalAlbums: 3,
    revenue: 12500,
    growth: 12.5
  };

  const recentReleases = [
    {
      id: 1,
      title: 'Midnight Dreams',
      type: 'Single',
      releaseDate: '2024-01-15',
      streams: 125000,
      likes: 8900
    },
    {
      id: 2,
      title: 'Summer Vibes',
      type: 'Album',
      releaseDate: '2023-12-01',
      streams: 890000,
      likes: 45600
    },
    {
      id: 3,
      title: 'Electric Nights',
      type: 'EP',
      releaseDate: '2023-10-20',
      streams: 234000,
      likes: 12300
    }
  ];

  const topSongs = [
    {
      id: 1,
      title: 'Blinding Lights',
      streams: 450000,
      growth: 8.5,
      position: 1
    },
    {
      id: 2,
      title: 'Midnight Dreams',
      streams: 320000,
      growth: 15.2,
      position: 2
    },
    {
      id: 3,
      title: 'Electric Nights',
      streams: 280000,
      growth: -2.1,
      position: 3
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const StatCard = ({ icon: Icon, title, value, change, color = 'blue' }) => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/10`}>
          <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
        {change && (
          <span className={`text-sm font-medium ${
            change > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Artist Dashboard</h1>
          <p className="text-gray-300">Welcome back! Here's your music performance overview.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last year</option>
          </select>
          
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="h-4 w-4" />
            <span>Upload New Song</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Play}
          title="Total Streams"
          value={formatNumber(stats.totalStreams)}
          change={stats.growth}
          color="blue"
        />
        <StatCard
          icon={Users}
          title="Monthly Listeners"
          value={formatNumber(stats.monthlyListeners)}
          change={8.2}
          color="green"
        />
        <StatCard
          icon={Heart}
          title="Total Followers"
          value={formatNumber(stats.totalFollowers)}
          change={5.7}
          color="purple"
        />
        <StatCard
          icon={DollarSign}
          title="Revenue"
          value={`$${formatNumber(stats.revenue)}`}
          change={15.3}
          color="yellow"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Songs */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Top Songs</h2>
            <button className="text-blue-500 hover:text-blue-400 text-sm">View All</button>
          </div>
          
          <div className="space-y-4">
            {topSongs.map((song) => (
              <div key={song.id} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-white font-bold text-sm">
                  {song.position}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{song.title}</h4>
                  <p className="text-gray-400 text-sm">{formatNumber(song.streams)} streams</p>
                </div>
                <span className={`text-sm font-medium ${
                  song.growth > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {song.growth > 0 ? '+' : ''}{song.growth}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <button className="text-blue-500 hover:text-blue-400 text-sm">View All</button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <div className="p-2 bg-green-500/10 rounded">
                <Heart className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-white text-sm">New follower: <span className="font-medium">@musiclover123</span></p>
                <p className="text-gray-400 text-xs">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <div className="p-2 bg-blue-500/10 rounded">
                <Play className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-white text-sm">"Midnight Dreams" reached 100K streams</p>
                <p className="text-gray-400 text-xs">5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <div className="p-2 bg-purple-500/10 rounded">
                <Music className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-white text-sm">New playlist added: "Chill Vibes"</p>
                <p className="text-gray-400 text-xs">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Releases */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Recent Releases</h2>
          <button className="text-blue-500 hover:text-blue-400 text-sm">View All</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentReleases.map((release) => (
            <div key={release.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                  {release.type}
                </span>
                <span className="text-gray-400 text-xs">{release.releaseDate}</span>
              </div>
              
              <h3 className="text-white font-semibold mb-2">{release.title}</h3>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{formatNumber(release.streams)} streams</span>
                <span className="text-gray-400">{formatNumber(release.likes)} likes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors">
          <Upload className="h-6 w-6 text-blue-500" />
          <div className="text-left">
            <div className="text-white font-medium">Upload New Song</div>
            <div className="text-gray-400 text-sm">Share your latest music</div>
          </div>
        </button>

        <button className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors">
          <BarChart3 className="h-6 w-6 text-green-500" />
          <div className="text-left">
            <div className="text-white font-medium">View Analytics</div>
            <div className="text-gray-400 text-sm">Detailed performance data</div>
          </div>
        </button>

        <button className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors">
          <Activity className="h-6 w-6 text-purple-500" />
          <div className="text-left">
            <div className="text-white font-medium">Manage Releases</div>
            <div className="text-gray-400 text-sm">Update your catalog</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 