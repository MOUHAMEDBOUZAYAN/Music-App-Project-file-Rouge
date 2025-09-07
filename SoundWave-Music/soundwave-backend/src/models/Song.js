const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  album: {
    type: String,
    trim: true,
    default: ''
  },
  duration: {
    type: Number,
    required: true,
  },
  audioUrl: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    default: '',
  },
  genre: [{
    type: String,
    trim: true,
  }],
  tags: [{
    type: String,
    trim: true,
  }],
  plays: {
    type: Number,
    default: 0,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  isPublic: {
    type: Boolean,
    default: true,
  },
  releaseDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

// Index for search functionality
songSchema.index({ title: 'text', genre: 'text', tags: 'text' });

const Song = mongoose.model('Song', songSchema);

module.exports = Song; 