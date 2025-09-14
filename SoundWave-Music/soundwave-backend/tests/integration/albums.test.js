const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');
const Album = require('../../src/models/Album');
const Song = require('../../src/models/Song');
const { createTestUser, createTestAlbum, createTestSong } = require('../testData');

describe('Albums API Integration Tests', () => {
  let authToken;
  let testArtist;
  let testSongs;

  beforeEach(async () => {
    await User.deleteMany({});
    await Album.deleteMany({});
    await Song.deleteMany({});

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

    // إنشاء أغاني للاختبار
    testSongs = [];
    for (let i = 0; i < 3; i++) {
      const songData = createTestSong();
      songData.title = `Test Song ${i + 1}`;
      songData.artist = testArtist._id;
      
      const song = new Song(songData);
      await song.save();
      testSongs.push(song);
    }
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Album.deleteMany({});
    await Song.deleteMany({});
  });

  describe('POST /api/albums', () => {
    it('should create a new album with valid data', async () => {
      const albumData = {
        title: 'Test Album',
        genre: 'Pop',
        releaseDate: '2024-01-01',
        songs: testSongs.map(song => song._id),
        isPublic: true
      };

      const response = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${authToken}`)
        .send(albumData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.album).toBeDefined();
      expect(response.body.data.album.title).toBe(albumData.title);
      expect(response.body.data.album.artist.toString()).toBe(testArtist._id.toString());
      expect(response.body.data.album.genre).toBe(albumData.genre);
      expect(response.body.data.album.songs).toHaveLength(3);
    });

    it('should create album without songs', async () => {
      const albumData = {
        title: 'Empty Album',
        genre: 'Rock',
        releaseDate: '2024-01-01',
        isPublic: true
      };

      const response = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${authToken}`)
        .send(albumData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.album.songs).toHaveLength(0);
    });

    it('should not create album without authentication', async () => {
      const albumData = {
        title: 'Test Album',
        genre: 'Pop'
      };

      const response = await request(app)
        .post('/api/albums')
        .send(albumData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not create album with invalid data', async () => {
      const albumData = {
        title: '',
        genre: 'InvalidGenre'
      };

      const response = await request(app)
        .post('/api/albums')
        .set('Authorization', `Bearer ${authToken}`)
        .send(albumData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/albums', () => {
    beforeEach(async () => {
      // إنشاء عدة ألبومات للاختبار
      const albums = [
        { ...createTestAlbum(), title: 'Public Album 1', artist: testArtist._id, isPublic: true, genre: 'Pop' },
        { ...createTestAlbum(), title: 'Public Album 2', artist: testArtist._id, isPublic: true, genre: 'Rock' },
        { ...createTestAlbum(), title: 'Private Album', artist: testArtist._id, isPublic: false, genre: 'Jazz' }
      ];

      for (const albumData of albums) {
        const album = new Album(albumData);
        await album.save();
      }
    });

    it('should get all public albums', async () => {
      const response = await request(app)
        .get('/api/albums')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.albums).toHaveLength(2);
      expect(response.body.data.albums.every(album => album.isPublic)).toBe(true);
    });

    it('should get albums with pagination', async () => {
      const response = await request(app)
        .get('/api/albums?page=1&limit=1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.albums).toHaveLength(1);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should get albums by genre', async () => {
      const response = await request(app)
        .get('/api/albums?genre=Pop')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.albums).toHaveLength(1);
      expect(response.body.data.albums[0].genre).toBe('Pop');
    });

    it('should search albums by title', async () => {
      const response = await request(app)
        .get('/api/albums?search=Public')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.albums).toHaveLength(2);
    });
  });

  describe('GET /api/albums/:id', () => {
    let testAlbum;

    beforeEach(async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;
      albumData.songs = testSongs.map(song => song._id);
      testAlbum = new Album(albumData);
      await testAlbum.save();
    });

    it('should get album by id', async () => {
      const response = await request(app)
        .get(`/api/albums/${testAlbum._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.album).toBeDefined();
      expect(response.body.data.album._id).toBe(testAlbum._id.toString());
    });

    it('should populate artist and songs', async () => {
      const response = await request(app)
        .get(`/api/albums/${testAlbum._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.album.artist).toBeDefined();
      expect(response.body.data.album.songs).toHaveLength(3);
    });

    it('should return 404 for non-existent album', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/albums/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/albums/:id', () => {
    let testAlbum;

    beforeEach(async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;
      testAlbum = new Album(albumData);
      await testAlbum.save();
    });

    it('should update album with valid data', async () => {
      const updateData = {
        title: 'Updated Album Title',
        genre: 'Rock'
      };

      const response = await request(app)
        .put(`/api/albums/${testAlbum._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.album.title).toBe(updateData.title);
      expect(response.body.data.album.genre).toBe(updateData.genre);
    });

    it('should add songs to album', async () => {
      const updateData = {
        songs: testSongs.map(song => song._id)
      };

      const response = await request(app)
        .put(`/api/albums/${testAlbum._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.album.songs).toHaveLength(3);
    });

    it('should not update album without authentication', async () => {
      const updateData = {
        title: 'Updated Album Title'
      };

      const response = await request(app)
        .put(`/api/albums/${testAlbum._id}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not update album with invalid data', async () => {
      const updateData = {
        title: '',
        genre: 'InvalidGenre'
      };

      const response = await request(app)
        .put(`/api/albums/${testAlbum._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/albums/:id', () => {
    let testAlbum;

    beforeEach(async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;
      testAlbum = new Album(albumData);
      await testAlbum.save();
    });

    it('should delete album with valid authentication', async () => {
      const response = await request(app)
        .delete(`/api/albums/${testAlbum._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');

      // التحقق من حذف الألبوم
      const deletedAlbum = await Album.findById(testAlbum._id);
      expect(deletedAlbum).toBeNull();
    });

    it('should not delete album without authentication', async () => {
      const response = await request(app)
        .delete(`/api/albums/${testAlbum._id}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not delete album by non-owner', async () => {
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
        .delete(`/api/albums/${testAlbum._id}`)
        .set('Authorization', `Bearer ${otherAuthToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/albums/:id/like', () => {
    let testAlbum;

    beforeEach(async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;
      testAlbum = new Album(albumData);
      await testAlbum.save();
    });

    it('should like album with valid authentication', async () => {
      const response = await request(app)
        .post(`/api/albums/${testAlbum._id}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('liked');

      // التحقق من إضافة الإعجاب
      const updatedAlbum = await Album.findById(testAlbum._id);
      expect(updatedAlbum.likes).toContain(testArtist._id);
    });

    it('should unlike album if already liked', async () => {
      // إضافة إعجاب أولاً
      testAlbum.likes.push(testArtist._id);
      await testAlbum.save();

      const response = await request(app)
        .post(`/api/albums/${testAlbum._id}/like`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('unliked');

      // التحقق من إزالة الإعجاب
      const updatedAlbum = await Album.findById(testAlbum._id);
      expect(updatedAlbum.likes).not.toContain(testArtist._id);
    });

    it('should not like album without authentication', async () => {
      const response = await request(app)
        .post(`/api/albums/${testAlbum._id}/like`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/albums/artist/:artistId', () => {
    beforeEach(async () => {
      // إنشاء عدة ألبومات للفنان
      const albums = [
        { ...createTestAlbum(), title: 'Album 1', artist: testArtist._id, genre: 'Pop' },
        { ...createTestAlbum(), title: 'Album 2', artist: testArtist._id, genre: 'Rock' },
        { ...createTestAlbum(), title: 'Album 3', artist: testArtist._id, genre: 'Jazz' }
      ];

      for (const albumData of albums) {
        const album = new Album(albumData);
        await album.save();
      }
    });

    it('should get albums by artist', async () => {
      const response = await request(app)
        .get(`/api/albums/artist/${testArtist._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
    });

    it('should return empty array for artist with no albums', async () => {
      const newArtistData = createTestUser('artist');
      newArtistData.username = 'newartist';
      newArtistData.email = 'newartist@test.com';
      const newArtist = new User(newArtistData);
      await newArtist.save();

      const response = await request(app)
        .get(`/api/albums/artist/${newArtist._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return 404 for non-existent artist', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/albums/artist/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
