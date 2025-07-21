const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  song: {
    type: Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: { createdAt: true, updatedAt: false } // Only need createdAt for comments
});

module.exports = mongoose.model('Comment', commentSchema); 