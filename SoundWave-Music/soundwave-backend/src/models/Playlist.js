const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playlistSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isDraft: {
    type: Boolean,
    default: false
  },
  coverImage: {
    type: String,
    default: '' // Optional cover image for the playlist
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Playlist', playlistSchema); 