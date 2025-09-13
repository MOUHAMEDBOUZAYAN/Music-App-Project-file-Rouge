const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albumSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  coverImage: {
    type: String, // URL from Cloudinary or similar
    required: false
  },
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song'
  }],
  genre: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    default: ''
  },
  songsCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Album', albumSchema); 