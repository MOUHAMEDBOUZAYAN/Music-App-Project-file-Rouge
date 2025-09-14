const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Song = require('../../src/models/Song');
const Album = require('../../src/models/Album');
const { createTestUser, createTestSong, createTestAlbum } = require('../testData');

describe('Songs API Integration Tests', () => {
  let authToken;
  let testArtist;
  let testAlbum;

  beforeEach(async () => {
    await User.deleteMany({});
    await Song.deleteMany({});
    await Album.deleteMany({});

    // إنشاء فنان وتسجيل الدخول
    const artistData = createTestUser('artist');
    testArtist = new User(artistData);
    await testArtist.save();

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: artistData.email,
        password: artistData.password
      });

    authToken = loginResponse.body.data.token;

    // إنشاء ألبوم للاختبار
    const albumData = createTestAlbum();
    albumData.artist = testArtist._id;
    testAlbum = new Album(albumData);
    await testAlbum.save();
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Song.deleteMany({});
    await Album.deleteMany({});
  });

  describe('POST /api/songs', () => {
    it('should create a new song with valid data', async () => {
      const songData = {
        title: 'Test Song',
        genre: 'Pop',
        duration: 180,
        album: testAlbum._id,
        isPublic: true
      };

      const response = await request(app)
        .post('/api/songs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(songData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.song).toBeDefined();
      expect(response.body.data.song.title).toBe(songData.title);
      expect(response.body.data.song.artist.toString()).toBe(testArtist._id.toString());
      expect(response.body.data.song.genre).toBe(songData.genre);
    });

    it('should not create song without authentication', async () => {
      const songData = {
        title: 'Test Song',
        genre: 'Pop'
      };

      const response = await request(app)
        .post('/api/songs')
        .send(songData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not create song with invalid data', async () => {
      const songData = {
        title: '',
        genre: 'InvalidGenre'
      };

      const response = await request(app)
        .post('/api/songs')
        .set('Authorization', `Bearer ${authToken}`)
        .send(songData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/songs', () => {
    beforeEach(async () => {
      // إنشاء عدة أغاني للاختبار
      const songs = [
        { ...createTestSong(), title: 'Public Song 1', artist: testArtist._id, isPublic: true, genre: 'Pop' },
        { ...createTestSong(), title: 'Public Song 2', artist: testArtist._id, isPublic: true, genre: 'Rock' },
        { ...createTestSong(), title: 'Private Song', artist: testArtist._id, isPublic: false, genre: 'Jazz' }
      ];

      for (const songData of songs) {
        const song = new Song(songData);
        await song.save();
      }
    });

    it('should get all public songs', async () => {
      const response = await request(app)
        .get('/api/songs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.songs).toHaveLength(2);
      expect(response.body.data.songs.every(song => song.isPublic)).toBe(true);
    });

    it('should get songs with pagination', async () => {
      const response = await request(app)
        .get('/api/songs?page=1&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.songs).toHaveLength(1);
      expect(response.body.data.pagination).toBeDefined();
      expect(response.body.data.pagination.page).toBe(1);
      expect(response.body.data.pagination.limit).toBe(1);
    });

    it('should get songs by genre', async () => {
      const response = await request(app)
        .get('/api/songs?genre=Pop')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.songs).toHaveLength(1);
      expect(response.body.data.songs[0].genre).toBe('Pop');
    });

    it('should search songs by title', async () => {
      const response = await request(app)
        .get('/api/songs?search=Public')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.songs).toHaveLength(2);
    });

    it('should sort songs by creation date', async () => {
      const response = await request(app)
        .get('/api/songs?sortBy=createdAt&sortOrder=desc')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.songs).toHaveLength(2);
    });
  });

  describe('GET /api/songs/:id', () => {
    let testSong;

    beforeEach(async () => {
      const songData = createTestSong();
      songData.artist = testArtist._id;
      songData.album = testAlbum._id;
      testSong = new Song(songData);
      await testSong.save();
    });

    it('should get song by id', async () => {
      const response = await request(app)
        .get(`/api/songs/${testSong._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.song).toBeDefined();
      expect(response.body.data.song._id).toBe(testSong._id.toString());
    });

    it('should populate artist and album', async () => {
      const response = await request(app)
        .get(`/api/songs/${testSong._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.song.artist).toBeDefined();
      expect(response.body.data.song.album).toBeDefined();
    });

    it('should return 404 for non-existent song', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/songs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/songs/artist/:artistId', () => {
    beforeEach(async () => {
      // إنشاء عدة أغاني للفنان
      const songs = [
        { ...createTestSong(), title: 'Song 1', artist: testArtist._id, genre: 'Pop' },
        { ...createTestSong(), title: 'Song 2', artist: testArtist._id, genre: 'Rock' },
        { ...createTestSong(), title: 'Song 3', artist: testArtist._id, genre: 'Jazz' }
      ];

      for (const songData of songs) {
        const song = new Song(songData);
        await song.save();
      }
    });

    it('should get songs by artist', async () => {
      const response = await request(app)
        .get(`/api/songs/artist/${testArtist._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
    });

    it('should return empty array for artist with no songs', async () => {
      const newArtistData = createTestUser('artist');
      newArtistData.username = 'newartist';
      newArtistData.email = 'newartist@test.com';
      const newArtist = new User(newArtistData);
      await newArtist.save();

      const response = await request(app)
        .get(`/api/songs/artist/${newArtist._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return 404 for non-existent artist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/songs/artist/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/songs/:id', () => {
    let testSong;

    beforeEach(async () => {
      const songData = createTestSong();
      songData.artist = testArtist._id;
      testSong = new Song(songData);
      await testSong.save();
    });

    it('should update song with valid data', async () => {
      const updateData = {
        title: 'Updated Song Title',
        genre: 'Rock'
      };

      const response = await request(app)
        .put(`/api/songs/${testSong._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.song.title).toBe(updateData.title);
      expect(response.body.data.song.genre).toBe(updateData.genre);
    });

    it('should not update song without authentication', async () => {
      const updateData = {
        title: 'Updated Song Title'
      };

      const response = await request(app)
        .put(`/api/songs/${testSong._id}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not update song with invalid data', async () => {
      const updateData = {
        title: '',
        genre: 'InvalidGenre'
      };

      const response = await request(app)
        .put(`/api/songs/${testSong._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should not update song by non-owner', async () => {
      // إنشاء مستخدم آخر
      const otherUserData = createTestUser('artist');
      otherUserData.username = 'otherartist';
      otherUserData.email = 'other@test.com';
      const otherUser = new User(otherUserData);
      await otherUser.save();

      const otherLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: otherUserData.email,
          password: otherUserData.password
        });

      const otherAuthToken = otherLoginResponse.body.data.token;

      const updateData = {
        title: 'Updated Song Title'
      };

      const response = await request(app)
        .put(`/api/songs/${testSong._id}`)
        .set('Authorization', `Bearer ${otherAuthToken}`)
        .send(updateData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/songs/:id', () => {
    let testSong;

    beforeEach(async () => {
      const songData = createTestSong();
      songData.artist = testArtist._id;
      testSong = new Song(songData);
      await testSong.save();
    });

    it('should delete song with valid authentication', async () => {
      const response = await request(app)
        .delete(`/api/songs/${testSong._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // التحقق من حذف الأغنية
      const deletedSong = await Song.findById(testSong._id);
      expect(deletedSong).toBeNull();
    });

    it('should not delete song without authentication', async () => {
      const response = await request(app)
        .delete(`/api/songs/${testSong._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not delete song by non-owner', async () => {
      // إنشاء مستخدم آخر
      const otherUserData = createTestUser('artist');
      otherUserData.username = 'otherartist';
      otherUserData.email = 'other@test.com';
      const otherUser = new User(otherUserData);
      await otherUser.save();

      const otherLoginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: otherUserData.email,
          password: otherUserData.password
        });

      const otherAuthToken = otherLoginResponse.body.data.token;

      const response = await request(app)
        .delete(`/api/songs/${testSong._id}`)
        .set('Authorization', `Bearer ${otherAuthToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/songs/:id/like', () => {
    let testSong;

    beforeEach(async () => {
      const songData = createTestSong();
      songData.artist = testArtist._id;
      testSong = new Song(songData);
      await testSong.save();
    });

    it('should like song with valid authentication', async () => {
      const response = await request(app)
        .post(`/api/songs/${testSong._id}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('liked');

      // التحقق من إضافة الإعجاب
      const updatedSong = await Song.findById(testSong._id);
      expect(updatedSong.likes).toContain(testArtist._id);
    });

    it('should unlike song if already liked', async () => {
      // إضافة إعجاب أولاً
      testSong.likes.push(testArtist._id);
      await testSong.save();

      const response = await request(app)
        .post(`/api/songs/${testSong._id}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('unliked');

      // التحقق من إزالة الإعجاب
      const updatedSong = await Song.findById(testSong._id);
      expect(updatedSong.likes).not.toContain(testArtist._id);
    });

    it('should not like song without authentication', async () => {
      const response = await request(app)
        .post(`/api/songs/${testSong._id}/like`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
