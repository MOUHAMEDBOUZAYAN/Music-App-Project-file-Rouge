const express = require('express');
const router = express.Router();

const ExternalFavorite = require('../models/ExternalFavorite');
const { protect, activityLogger } = require('../middleware');

// Add external favorite
router.post('/external', protect, activityLogger('like_external'), async (req, res, next) => {
  try {
    const { provider = 'deezer', externalId, title, artist, album, cover, duration } = req.body || {};
    if (!externalId) {
      return res.status(400).json({ success: false, message: 'externalId requis' });
    }

    const doc = await ExternalFavorite.findOneAndUpdate(
      { user: req.user._id, provider, externalId },
      { $setOnInsert: { title, artist, album, cover, duration } },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
});

// Remove external favorite
router.delete('/external/:provider/:externalId', protect, activityLogger('unlike_external'), async (req, res, next) => {
  try {
    const { provider, externalId } = req.params;
    await ExternalFavorite.findOneAndDelete({ user: req.user._id, provider, externalId });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


