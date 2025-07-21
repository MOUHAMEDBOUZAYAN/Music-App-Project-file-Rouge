const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This model represents the relationship between two users.
// One user (the 'follower') follows another user (the 'following').
const followSchema = new Schema({
    // The user who is initiating the follow
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The user who is being followed
    following: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

// Add a compound index to prevent a user from following the same person more than once.
followSchema.index({ follower: 1, following: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema); 