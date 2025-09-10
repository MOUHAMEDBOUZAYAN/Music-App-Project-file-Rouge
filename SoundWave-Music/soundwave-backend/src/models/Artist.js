const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  genre: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  socialLinks: {
    spotify: { type: String, default: '' },
    youtube: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  albums: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  }],
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    enum: ['user', 'artist', 'admin'],
    default: 'artist'
  },
  stats: {
    totalPlays: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    totalFollowers: { type: Number, default: 0 },
    monthlyListeners: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes
artistSchema.index({ username: 1 });
artistSchema.index({ email: 1 });
artistSchema.index({ name: 1 });
artistSchema.index({ genre: 1 });
artistSchema.index({ 'stats.totalPlays': -1 });
artistSchema.index({ 'stats.monthlyListeners': -1 });

// Virtual for follower count
artistSchema.virtual('followerCount').get(function() {
  return this.followers ? this.followers.length : 0;
});

// Virtual for following count
artistSchema.virtual('followingCount').get(function() {
  return this.following ? this.following.length : 0;
});

// Virtual for song count
artistSchema.virtual('songCount').get(function() {
  return this.songs ? this.songs.length : 0;
});

// Virtual for album count
artistSchema.virtual('albumCount').get(function() {
  return this.albums ? this.albums.length : 0;
});

// Method to add follower
artistSchema.methods.addFollower = function(userId) {
  if (!this.followers.includes(userId)) {
    this.followers.push(userId);
    this.stats.totalFollowers = this.followers.length;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove follower
artistSchema.methods.removeFollower = function(userId) {
  this.followers = this.followers.filter(id => !id.equals(userId));
  this.stats.totalFollowers = this.followers.length;
  return this.save();
};

// Method to add song
artistSchema.methods.addSong = function(songId) {
  if (!this.songs.includes(songId)) {
    this.songs.push(songId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove song
artistSchema.methods.removeSong = function(songId) {
  this.songs = this.songs.filter(id => !id.equals(songId));
  return this.save();
};

// Static method to find popular artists
artistSchema.statics.findPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ 'stats.monthlyListeners': -1, 'stats.totalPlays': -1 })
    .limit(limit)
    .populate('songs', 'title audioUrl coverImage')
    .populate('albums', 'title coverImage');
};

// Static method to search artists
artistSchema.statics.searchArtists = function(query, limit = 20) {
  const searchRegex = new RegExp(query, 'i');
  return this.find({
    $or: [
      { name: searchRegex },
      { username: searchRegex },
      { genre: searchRegex }
    ],
    isActive: true
  })
  .sort({ 'stats.monthlyListeners': -1 })
  .limit(limit)
  .select('username name avatar genre stats');
};

// Pre-save middleware to update stats
artistSchema.pre('save', function(next) {
  if (this.followers) {
    this.stats.totalFollowers = this.followers.length;
  }
  next();
});

// Ensure virtual fields are serialized
artistSchema.set('toJSON', { virtuals: true });
artistSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Artist', artistSchema);
