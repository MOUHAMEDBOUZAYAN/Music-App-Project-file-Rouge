import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Play, 
  Heart, 
  Share2,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Clock,
  Music
} from 'lucide-react';

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('streams');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalStreams: 1247500,
      monthlyListeners: 45600,
      totalFollowers: 23400,
      totalLikes: 8900,
      totalShares: 3400,
      totalComments: 1200
    },
    trends: {
      streams: [120, 190, 300, 500, 200, 300, 450, 600, 800, 1000, 1200, 1500],
      listeners: [1000, 1200, 1500, 1800, 2200, 2500, 2800, 3200, 3500, 3800, 4200, 4560],
      followers: [100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650]
    },
    topCountries: [
      { country: 'United States', streams: 450000, percentage: 36 },
      { country: 'United Kingdom', streams: 280000, percentage: 22 },
      { country: 'Canada', streams: 180000, percentage: 14 },
      { country: 'Germany', streams: 120000, percentage: 10 },
      { country: 'France', streams: 90000, percentage: 7 }
    ],
    demographics: {
      ageGroups: [
        { age: '13-17', percentage: 15 },
        { age: '18-24', percentage: 35 },
        { age: '25-34', percentage: 28 },
        { age: '35-44', percentage: 15 },
        { age: '45+', percentage: 7 }
      ],
      gender: [
        { gender: 'Male', percentage: 52 },
        { gender: 'Female', percentage: 45 },
        { gender: 'Other', percentage: 3 }
      ]
    },
    topSongs: [
      {
        title: 'Blinding Lights',
        streams: 450000,
        growth: 8.5,
        listeners: 32000,
        likes: 8900
      },
      {
        title: 'Midnight Dreams',
        streams: 320000,
        growth: 15.2,
        listeners: 24000,
        likes: 6700
      },
      {
        title: 'Electric Nights',
        streams: 280000,
        growth: -2.1,
        listeners: 21000,
        likes: 5400
      },
      {
        title: 'Summer Vibes',
        streams: 220000,
        growth: 12.8,
        listeners: 18000,
        likes: 4200
      },
      {
        title: 'Ocean Waves',
        streams: 180000,
        growth: 5.4,
        listeners: 15000,
        likes: 3800
      }
    ]
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const MetricCard = ({ icon: Icon, title, value, change, color = 'blue' }) => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/10`}>
          <Icon className={`h-6 w-6 text-${color}-500`} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${
            change > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {change > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );

  const SimpleChart = ({ data, color = 'blue' }) => (
    <div className="flex items-end space-x-1 h-20">
      {data.map((value, index) => (
        <div
          key={index}
          className={`bg-${color}-500 rounded-t transition-all duration-300 hover:bg-${color}-400`}
          style={{ 
            height: `${(value / Math.max(...data)) * 100}%`,
            width: `${100 / data.length}%`
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-300">Track your music performance and audience insights</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 3 months</option>
            <option value="year">Last year</option>
          </select>
          
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="streams">Streams</option>
            <option value="listeners">Listeners</option>
            <option value="followers">Followers</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          icon={Play}
          title="Total Streams"
          value={formatNumber(analyticsData.overview.totalStreams)}
          change={12.5}
          color="blue"
        />
        <MetricCard
          icon={Users}
          title="Monthly Listeners"
          value={formatNumber(analyticsData.overview.monthlyListeners)}
          change={8.2}
          color="green"
        />
        <MetricCard
          icon={Heart}
          title="Total Followers"
          value={formatNumber(analyticsData.overview.totalFollowers)}
          change={5.7}
          color="purple"
        />
        <MetricCard
          icon={Share2}
          title="Total Shares"
          value={formatNumber(analyticsData.overview.totalShares)}
          change={15.3}
          color="yellow"
        />
        <MetricCard
          icon={Activity}
          title="Total Likes"
          value={formatNumber(analyticsData.overview.totalLikes)}
          change={9.1}
          color="red"
        />
        <MetricCard
          icon={Clock}
          title="Avg. Listen Time"
          value="2m 34s"
          change={-2.3}
          color="indigo"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trends Chart */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Trends</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-white font-medium mb-2">Streams Over Time</h3>
              <SimpleChart data={analyticsData.trends.streams} color="blue" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-white font-medium">{formatNumber(Math.min(...analyticsData.trends.streams))}</div>
                <div className="text-gray-400">Min</div>
              </div>
              <div>
                <div className="text-white font-medium">{formatNumber(Math.max(...analyticsData.trends.streams))}</div>
                <div className="text-gray-400">Max</div>
              </div>
              <div>
                <div className="text-white font-medium">{formatNumber(Math.round(analyticsData.trends.streams.reduce((a, b) => a + b, 0) / analyticsData.trends.streams.length))}</div>
                <div className="text-gray-400">Avg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Top Countries</h2>
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analyticsData.topCountries.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{country.country}</div>
                    <div className="text-gray-400 text-sm">{formatNumber(country.streams)} streams</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{country.percentage}%</div>
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demographics and Top Songs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demographics */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Audience Demographics</h2>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-medium mb-4">Age Groups</h3>
              <div className="space-y-3">
                {analyticsData.demographics.ageGroups.map((age) => (
                  <div key={age.age} className="flex items-center justify-between">
                    <span className="text-gray-300">{age.age}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${age.percentage}%` }}
                        />
                      </div>
                      <span className="text-white font-medium w-8">{age.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-4">Gender Distribution</h3>
              <div className="space-y-3">
                {analyticsData.demographics.gender.map((gender) => (
                  <div key={gender.gender} className="flex items-center justify-between">
                    <span className="text-gray-300">{gender.gender}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${gender.percentage}%` }}
                        />
                      </div>
                      <span className="text-white font-medium w-8">{gender.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Songs */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Top Performing Songs</h2>
            <Music className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analyticsData.topSongs.map((song, index) => (
              <div key={song.title} className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-white font-medium">{song.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{formatNumber(song.streams)} streams</span>
                    <span>{formatNumber(song.listeners)} listeners</span>
                    <span>{formatNumber(song.likes)} likes</span>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  song.growth > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {song.growth > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{Math.abs(song.growth)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Key Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h3 className="text-white font-medium">Growth Trend</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Your streams have increased by 12.5% this month, with the highest growth coming from listeners aged 18-24.
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Globe className="h-5 w-5 text-blue-500" />
              <h3 className="text-white font-medium">Global Reach</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Your music is popular in 5 countries, with the United States being your top market at 36% of total streams.
            </p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Users className="h-5 w-5 text-purple-500" />
              <h3 className="text-white font-medium">Audience Engagement</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Your audience is highly engaged with an average listen time of 2m 34s and strong social sharing rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 