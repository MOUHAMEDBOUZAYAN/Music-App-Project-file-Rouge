const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Song = require('../../src/models/Song');
const Album = require('../../src/models/Album');
const { createTestUser, createTestSong, createTestAlbum } = require('../testData');

describe('Users API Integration Tests', () => {
  let authToken;
  let testUser;
  let testArtist;
  let testSongs;
  let testAlbums;

  beforeEach(async () => {
    await User.deleteMany({});
    await Song.deleteMany({});
    await Album.deleteMany({});

    // إنشاء مستخدم عادي وتسجيل الدخول
    const userData = createTestUser('listener');
    testUser = new User(userData);
    await testUser.save();

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    authToken = loginResponse.body.data.token;

    // إنشاء فنان
    const artistData = createTestUser('artist');
    artistData.username = 'testartist';
    artistData.email = 'artist@test.com';
    testArtist = new User(artistData);
    await testArtist.save();

    // إنشاء أغاني للفنان
    testSongs = [];
    for (let i = 0; i < 3; i++) {
      const songData = createTestSong();
      songData.title = `Artist Song ${i + 1}`;
      songData.artist = testArtist._id;
      
      const song = new Song(songData);
      await song.save();
      testSongs.push(song);
    }

    // إنشاء ألبومات للفنان
    testAlbums = [];
    for (let i = 0; i < 2; i++) {
      const albumData = createTestAlbum();
      albumData.title = `Artist Album ${i + 1}`;
      albumData.artist = testArtist._id;
      
      const album = new Album(albumData);
      await album.save();
      testAlbums.push(album);
    }
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Song.deleteMany({});
    await Album.deleteMany({});
  });

  describe('GET /api/users/profile/:id', () => {
    it('should get user profile by id', async () => {
      const response = await request(app)
        .get(`/api/users/profile/${testUser._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user._id).toBe(testUser._id.toString());
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should get artist profile with songs and albums', async () => {
      const response = await request(app)
        .get(`/api/users/profile/${testArtist._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.role).toBe('artist');
      expect(response.body.data.songs).toBeDefined();
      expect(response.body.data.albums).toBeDefined();
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/users/profile/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/search', () => {
    beforeEach(async () => {
      // إنشاء عدة مستخدمين للبحث
      const users = [
        { ...createTestUser('listener'), username: 'john_doe', name: 'John Doe' },
        { ...createTestUser('artist'), username: 'jane_smith', name: 'Jane Smith' },
        { ...createTestUser('listener'), username: 'bob_wilson', name: 'Bob Wilson' }
      ];

      for (const userData of users) {
        const user = new User(userData);
        await user.save();
      }
    });

    it('should search users by username', async () => {
      const response = await request(app)
        .get('/api/users/search?q=john')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toHaveLength(1);
      expect(response.body.data.users[0].username).toBe('john_doe');
    });

    it('should search users by name', async () => {
      const response = await request(app)
        .get('/api/users/search?q=Jane')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toHaveLength(1);
      expect(response.body.data.users[0].name).toBe('Jane Smith');
    });

    it('should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/api/users/search?q=nonexistent')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users).toHaveLength(0);
    });

    it('should filter by role', async () => {
      const response = await request(app)
        .get('/api/users/search?role=artist')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.users.every(user => user.role === 'artist')).toBe(true);
    });
  });

  describe('POST /api/users/follow/:id', () => {
    it('should follow user with valid authentication', async () => {
      const response = await request(app)
        .post(`/api/users/follow/${testArtist._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('followed');

      // التحقق من إضافة المتابعة
      const updatedUser = await User.findById(testUser._id);
      const updatedArtist = await User.findById(testArtist._id);
      
      expect(updatedUser.following).toContain(testArtist._id);
      expect(updatedArtist.followers).toContain(testUser._id);
    });

    it('should unfollow user if already following', async () => {
      // إضافة متابعة أولاً
      testUser.following.push(testArtist._id);
      testArtist.followers.push(testUser._id);
      await testUser.save();
      await testArtist.save();

      const response = await request(app)
        .post(`/api/users/follow/${testArtist._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('unfollowed');

      // التحقق من إزالة المتابعة
      const updatedUser = await User.findById(testUser._id);
      const updatedArtist = await User.findById(testArtist._id);
      
      expect(updatedUser.following).not.toContain(testArtist._id);
      expect(updatedArtist.followers).not.toContain(testUser._id);
    });

    it('should not follow without authentication', async () => {
      const response = await request(app)
        .post(`/api/users/follow/${testArtist._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not follow self', async () => {
      const response = await request(app)
        .post(`/api/users/follow/${testUser._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('cannot follow yourself');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/users/follow/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/following', () => {
    beforeEach(async () => {
      // إضافة متابعات للاختبار
      testUser.following.push(testArtist._id);
      testArtist.followers.push(testUser._id);
      await testUser.save();
      await testArtist.save();
    });

    it('should get following list with authentication', async () => {
      const response = await request(app)
        .get('/api/users/following')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.following).toHaveLength(1);
      expect(response.body.data.following[0]._id).toBe(testArtist._id.toString());
    });

    it('should not get following list without authentication', async () => {
      const response = await request(app)
        .get('/api/users/following')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/followers', () => {
    beforeEach(async () => {
      // إضافة متابعين للاختبار
      testArtist.followers.push(testUser._id);
      testUser.following.push(testArtist._id);
      await testArtist.save();
      await testUser.save();
    });

    it('should get followers list with authentication', async () => {
      const response = await request(app)
        .get('/api/users/followers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.followers).toHaveLength(0); // المستخدم العادي ليس له متابعين
    });

    it('should get artist followers', async () => {
      // تسجيل دخول كفنان
      const artistLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'artist@test.com',
          password: 'TestPassword123!'
        });

      const artistAuthToken = artistLoginResponse.body.data.token;

      const response = await request(app)
        .get('/api/users/followers')
        .set('Authorization', `Bearer ${artistAuthToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.followers).toHaveLength(1);
      expect(response.body.data.followers[0]._id).toBe(testUser._id.toString());
    });

    it('should not get followers list without authentication', async () => {
      const response = await request(app)
        .get('/api/users/followers')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/me', () => {
    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user._id).toBe(testUser._id.toString());
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should not get current user without authentication', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/me', () => {
    it('should update current user profile', async () => {
      const updateData = {
        name: 'Updated Name',
        bio: 'Updated bio',
        location: 'Updated Location'
      };

      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe(updateData.name);
      expect(response.body.data.user.bio).toBe(updateData.bio);
      expect(response.body.data.user.location).toBe(updateData.location);
    });

    it('should not update profile without authentication', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put('/api/users/me')
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not update profile with invalid data', async () => {
      const updateData = {
        email: 'invalid-email'
      };

      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/me/songs', () => {
    it('should get current user songs (for artists)', async () => {
      // تسجيل دخول كفنان
      const artistLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'artist@test.com',
          password: 'TestPassword123!'
        });

      const artistAuthToken = artistLoginResponse.body.data.token;

      const response = await request(app)
        .get('/api/users/me/songs')
        .set('Authorization', `Bearer ${artistAuthToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.songs).toHaveLength(3);
    });

    it('should return empty array for non-artist users', async () => {
      const response = await request(app)
        .get('/api/users/me/songs')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.songs).toHaveLength(0);
    });

    it('should not get songs without authentication', async () => {
      const response = await request(app)
        .get('/api/users/me/songs')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/me/albums', () => {
    it('should get current user albums (for artists)', async () => {
      // تسجيل دخول كفنان
      const artistLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'artist@test.com',
          password: 'TestPassword123!'
        });

      const artistAuthToken = artistLoginResponse.body.data.token;

      const response = await request(app)
        .get('/api/users/me/albums')
        .set('Authorization', `Bearer ${artistAuthToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.albums).toHaveLength(2);
    });

    it('should return empty array for non-artist users', async () => {
      const response = await request(app)
        .get('/api/users/me/albums')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.albums).toHaveLength(0);
    });

    it('should not get albums without authentication', async () => {
      const response = await request(app)
        .get('/api/users/me/albums')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
