const express = require('express');
const router = express.Router();
const spotifyApi = require('../config/spotify');

// 1. إعادة توجيه المستخدم إلى صفحة تسجيل الدخول في سبوتيفاي
router.get('/login', (req, res) => {
  const scopes = [
    'user-read-private',
    'user-read-email'
    // يمكنك إضافة صلاحيات أخرى حسب الحاجة
  ];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, 'state');
  res.redirect(authorizeURL);
});

// 2. استقبال الكود من سبوتيفاي والحصول على التوكن
router.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    console.log('Authentification avec Spotify réussie');
    // Envoyer les tokens au frontend ou les stocker selon le besoin
    res.json({
      access_token: data.body.access_token,
      refresh_token: data.body.refresh_token,
      expires_in: data.body.expires_in,
      message: 'Authentification avec Spotify réussie'
    });
  } catch (err) {
    console.error('Échec de l\'authentification avec Spotify:', err.message);
    res.status(400).json({ error: 'Échec de l\'authentification avec Spotify', details: err.message });
  }
});

module.exports = router; 