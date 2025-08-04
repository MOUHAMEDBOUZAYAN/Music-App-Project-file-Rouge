import React, { useState } from 'react';
import { User, Edit, Save, X, Camera, Music, Heart, Clock, Settings } from 'lucide-react';

const Profile = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || ''
  });

  const handleSave = async () => {
    try {
      if (onUpdateProfile) {
        await onUpdateProfile(editData);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      bio: user?.bio || '',
      location: user?.location || ''
    });
    setIsEditing(false);
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRandomColor = () => {
    const colors = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-purple-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className={`w-24 h-24 bg-gradient-to-br ${getRandomColor()} rounded-full flex items-center justify-center`}>
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {getInitials(user?.firstName, user?.lastName)}
                  </span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="First Name"
                      className="bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Last Name"
                      className="bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={editData.location}
                    onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Location"
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows="3"
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-gray-400 mb-2">@{user?.username}</p>
                  {user?.location && (
                    <p className="text-gray-400 text-sm mb-3">📍 {user.location}</p>
                  )}
                  {user?.bio && (
                    <p className="text-gray-300">{user.bio}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Edit/Save Buttons */}
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 pt-6 border-t border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{user?.playlists || 0}</div>
            <div className="text-gray-400 text-sm">Playlists</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{user?.followers || 0}</div>
            <div className="text-gray-400 text-sm">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{user?.following || 0}</div>
            <div className="text-gray-400 text-sm">Following</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{user?.likedSongs || 0}</div>
            <div className="text-gray-400 text-sm">Liked Songs</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors">
          <Music className="h-6 w-6 text-blue-500" />
          <div className="text-left">
            <div className="text-white font-medium">My Playlists</div>
            <div className="text-gray-400 text-sm">Manage your playlists</div>
          </div>
        </button>

        <button className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors">
          <Heart className="h-6 w-6 text-red-500" />
          <div className="text-left">
            <div className="text-white font-medium">Liked Songs</div>
            <div className="text-gray-400 text-sm">Your favorite tracks</div>
          </div>
        </button>

        <button className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors">
          <Clock className="h-6 w-6 text-green-500" />
          <div className="text-left">
            <div className="text-white font-medium">Recently Played</div>
            <div className="text-gray-400 text-sm">Your listening history</div>
          </div>
        </button>
      </div>

      {/* Account Settings */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Account Settings</h2>
          <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <div className="text-white font-medium">Email</div>
              <div className="text-gray-400 text-sm">{user?.email}</div>
            </div>
            <button className="text-blue-500 hover:text-blue-400 text-sm">Change</button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <div className="text-white font-medium">Password</div>
              <div className="text-gray-400 text-sm">••••••••</div>
            </div>
            <button className="text-blue-500 hover:text-blue-400 text-sm">Change</button>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <div className="text-white font-medium">Account Type</div>
              <div className="text-gray-400 text-sm capitalize">{user?.role || 'listener'}</div>
            </div>
            <button className="text-blue-500 hover:text-blue-400 text-sm">Upgrade</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 