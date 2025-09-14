const mongoose = require('mongoose');
const User = require('../../src/models/User');
const Song = require('../../src/models/Song');
const Album = require('../../src/models/Album');
const { createTestUser, createTestSong, createTestAlbum } = require('../testData');

/**
 * دوال مساعدة للاختبارات
 */

/**
 * إنشاء مستخدم للاختبار
 * @param {string} role - دور المستخدم ('artist', 'listener', 'admin')
 * @param {Object} overrides - خصائص إضافية
 * @returns {Promise<Object>} المستخدم المنشأ
 */
const createTestUserWithRole = async (role = 'listener', overrides = {}) => {
  const userData = createTestUser(role);
  const user = new User({ ...userData, ...overrides });
  await user.save();
  return user;
};

/**
 * إنشاء فنان مع أغاني وألبومات
 * @param {Object} options - خيارات الإعداد
 * @returns {Promise<Object>} بيانات الفنان مع أغانيه وألبوماته
 */
const createArtistWithContent = async (options = {}) => {
  const { songsCount = 3, albumsCount = 2 } = options;
  
  // إنشاء الفنان
  const artistData = createTestUser('artist');
  const artist = new User(artistData);
  await artist.save();

  // إنشاء الأغاني
  const songs = [];
  for (let i = 0; i < songsCount; i++) {
    const songData = createTestSong();
    songData.title = `Test Song ${i + 1}`;
    songData.artist = artist._id;
    
    const song = new Song(songData);
    await song.save();
    songs.push(song);
  }

  // إنشاء الألبومات
  const albums = [];
  for (let i = 0; i < albumsCount; i++) {
    const albumData = createTestAlbum();
    albumData.title = `Test Album ${i + 1}`;
    albumData.artist = artist._id;
    albumData.songs = songs.slice(0, Math.floor(songs.length / albumsCount));
    
    const album = new Album(albumData);
    await album.save();
    albums.push(album);
  }

  return {
    artist,
    songs,
    albums
  };
};

/**
 * إنشاء علاقة متابعة بين مستخدمين
 * @param {Object} follower - المستخدم المتابع
 * @param {Object} following - المستخدم المتابَع
 * @returns {Promise<void>}
 */
const createFollowRelationship = async (follower, following) => {
  follower.following.push(following._id);
  following.followers.push(follower._id);
  
  await follower.save();
  await following.save();
};

/**
 * إنشاء إعجاب على أغنية
 * @param {Object} user - المستخدم
 * @param {Object} song - الأغنية
 * @returns {Promise<void>}
 */
const likeSong = async (user, song) => {
  song.likes.push(user._id);
  await song.save();
};

/**
 * إنشاء إعجاب على ألبوم
 * @param {Object} user - المستخدم
 * @param {Object} album - الألبوم
 * @returns {Promise<void>}
 */
const likeAlbum = async (user, album) => {
  album.likes.push(user._id);
  await album.save();
};

/**
 * تنظيف جميع البيانات
 * @returns {Promise<void>}
 */
const cleanupDatabase = async () => {
  await User.deleteMany({});
  await Song.deleteMany({});
  await Album.deleteMany({});
};

/**
 * إنشاء token مصادقة للمستخدم
 * @param {Object} user - المستخدم
 * @returns {string} JWT token
 */
const createAuthToken = (user) => {
  return user.getSignedJwtToken();
};

/**
 * إنشاء بيانات طلب صحيحة
 * @param {Object} user - المستخدم
 * @returns {Object} بيانات الطلب مع المصادقة
 */
const createAuthenticatedRequest = (user) => {
  const token = createAuthToken(user);
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

/**
 * انتظار فترة زمنية محددة
 * @param {number} ms - المدة بالميلي ثانية
 * @returns {Promise<void>}
 */
const wait = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * التحقق من وجود حقل في الكائن
 * @param {Object} obj - الكائن
 * @param {string} field - اسم الحقل
 * @returns {boolean}
 */
const hasField = (obj, field) => {
  return obj && obj.hasOwnProperty(field);
};

/**
 * التحقق من أن الكائن يحتوي على جميع الحقول المطلوبة
 * @param {Object} obj - الكائن
 * @param {Array} fields - قائمة الحقول المطلوبة
 * @returns {boolean}
 */
const hasAllFields = (obj, fields) => {
  return fields.every(field => hasField(obj, field));
};

/**
 * إنشاء معرف MongoDB صحيح
 * @returns {string}
 */
const createValidObjectId = () => {
  return new mongoose.Types.ObjectId().toString();
};

/**
 * إنشاء معرف MongoDB غير صحيح
 * @returns {string}
 */
const createInvalidObjectId = () => {
  return 'invalid-id';
};

/**
 * إنشاء بيانات أغنية صحيحة
 * @param {Object} artist - الفنان
 * @param {Object} album - الألبوم (اختياري)
 * @returns {Object}
 */
const createValidSongData = (artist, album = null) => {
  return {
    title: 'Test Song',
    artist: artist._id,
    album: album ? album._id : null,
    genre: 'Pop',
    duration: 180,
    isPublic: true
  };
};

/**
 * إنشاء بيانات ألبوم صحيحة
 * @param {Object} artist - الفنان
 * @param {Array} songs - قائمة الأغاني (اختياري)
 * @returns {Object}
 */
const createValidAlbumData = (artist, songs = []) => {
  return {
    title: 'Test Album',
    artist: artist._id,
    genre: 'Pop',
    releaseDate: '2024-01-01',
    songs: songs.map(song => song._id),
    isPublic: true
  };
};

/**
 * إنشاء بيانات مستخدم صحيحة
 * @param {string} role - دور المستخدم
 * @returns {Object}
 */
const createValidUserData = (role = 'listener') => {
  const timestamp = Date.now();
  return {
    username: `testuser${timestamp}`,
    email: `test${timestamp}@test.com`,
    password: 'TestPassword123!',
    role: role,
    name: `Test User ${timestamp}`
  };
};

/**
 * التحقق من استجابة API صحيحة
 * @param {Object} response - استجابة API
 * @param {number} expectedStatus - الحالة المتوقعة
 * @param {boolean} shouldBeSuccess - هل يجب أن تكون ناجحة
 * @returns {boolean}
 */
const validateApiResponse = (response, expectedStatus, shouldBeSuccess = true) => {
  expect(response.status).toBe(expectedStatus);
  expect(response.body.success).toBe(shouldBeSuccess);
  
  if (shouldBeSuccess) {
    expect(response.body.data).toBeDefined();
  } else {
    expect(response.body.message).toBeDefined();
  }
  
  return true;
};

/**
 * إنشاء ملف اختبار مؤقت
 * @param {string} content - محتوى الملف
 * @param {string} extension - امتداد الملف
 * @returns {string} مسار الملف
 */
const createTempFile = (content, extension = '.tmp') => {
  const fs = require('fs');
  const path = require('path');
  const tempDir = path.join(__dirname, 'temp');
  
  // إنشاء مجلد مؤقت إذا لم يكن موجوداً
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  const fileName = `test_${Date.now()}${extension}`;
  const filePath = path.join(tempDir, fileName);
  
  fs.writeFileSync(filePath, content);
  return filePath;
};

/**
 * حذف ملف مؤقت
 * @param {string} filePath - مسار الملف
 * @returns {void}
 */
const deleteTempFile = (filePath) => {
  const fs = require('fs');
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    // تجاهل الخطأ إذا كان الملف غير موجود
  }
};

module.exports = {
  createTestUserWithRole,
  createArtistWithContent,
  createFollowRelationship,
  likeSong,
  likeAlbum,
  cleanupDatabase,
  createAuthToken,
  createAuthenticatedRequest,
  wait,
  hasField,
  hasAllFields,
  createValidObjectId,
  createInvalidObjectId,
  createValidSongData,
  createValidAlbumData,
  createValidUserData,
  validateApiResponse,
  createTempFile,
  deleteTempFile
};
