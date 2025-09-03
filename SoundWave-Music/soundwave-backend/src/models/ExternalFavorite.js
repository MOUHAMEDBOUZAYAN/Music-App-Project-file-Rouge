const mongoose = require('mongoose');

const externalFavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: String,
    enum: ['deezer', 'spotify', 'youtube', 'other'],
    required: true
  },
  externalId: {
    type: String,
    required: true
  },
  // Optional cached metadata for faster display without extra API calls
  title: String,
  artist: String,
  album: String,
  cover: String,
  duration: Number
}, { timestamps: true });

externalFavoriteSchema.index({ user: 1, provider: 1, externalId: 1 }, { unique: true });

module.exports = mongoose.model('ExternalFavorite', externalFavoriteSchema);


