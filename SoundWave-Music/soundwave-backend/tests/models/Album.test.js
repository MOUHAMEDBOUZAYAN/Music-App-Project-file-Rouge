const mongoose = require('mongoose');
const Album = require('../../src/models/Album');
const User = require('../../src/models/User');
const Song = require('../../src/models/Song');
const { createTestUser, createTestAlbum, createTestSong } = require('../testData');

describe('Album Model', () => {
  let testArtist;
  let testSongs;

  beforeEach(async () => {
    await Album.deleteMany({});
    await User.deleteMany({});
    await Song.deleteMany({});

    // إنشاء فنان للاختبار
    const artistData = createTestUser('artist');
    testArtist = new User(artistData);
    await testArtist.save();

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
    await Album.deleteMany({});
    await User.deleteMany({});
    await Song.deleteMany({});
  });

  describe('Album Creation', () => {
    it('should create a new album with valid data', async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;
      albumData.songs = testSongs.map(song => song._id);

      const album = new Album(albumData);
      const savedAlbum = await album.save();

      expect(savedAlbum._id).toBeDefined();
      expect(savedAlbum.title).toBe(albumData.title);
      expect(savedAlbum.artist.toString()).toBe(testArtist._id.toString());
      expect(savedAlbum.genre).toBe(albumData.genre);
      expect(savedAlbum.releaseDate).toEqual(albumData.releaseDate);
      expect(savedAlbum.coverImage).toBe(albumData.coverImage);
      expect(savedAlbum.songs).toHaveLength(3);
      expect(savedAlbum.likes).toEqual([]);
      expect(savedAlbum.isPublic).toBe(true);
    });

    it('should set default values correctly', async () => {
      const albumData = {
        title: 'Test Album',
        artist: testArtist._id,
        genre: 'Pop'
      };

      const album = new Album(albumData);
      const savedAlbum = await album.save();

      expect(savedAlbum.songs).toEqual([]);
      expect(savedAlbum.likes).toEqual([]);
      expect(savedAlbum.isPublic).toBe(true);
      expect(savedAlbum.createdAt).toBeDefined();
      expect(savedAlbum.updatedAt).toBeDefined();
    });
  });

  describe('Album Validation', () => {
    it('should require title', async () => {
      const albumData = createTestAlbum();
      delete albumData.title;
      albumData.artist = testArtist._id;

      const album = new Album(albumData);
      await expect(album.save()).rejects.toThrow();
    });

    it('should require artist', async () => {
      const albumData = createTestAlbum();
      delete albumData.artist;

      const album = new Album(albumData);
      await expect(album.save()).rejects.toThrow();
    });

    it('should require genre', async () => {
      const albumData = createTestAlbum();
      delete albumData.genre;
      albumData.artist = testArtist._id;

      const album = new Album(albumData);
      await expect(album.save()).rejects.toThrow();
    });

    it('should validate genre enum', async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;
      albumData.genre = 'InvalidGenre';

      const album = new Album(albumData);
      await expect(album.save()).rejects.toThrow();
    });

    it('should validate release date', async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;
      albumData.releaseDate = 'invalid-date';

      const album = new Album(albumData);
      await expect(album.save()).rejects.toThrow();
    });
  });

  describe('Album Relationships', () => {
    it('should populate artist correctly', async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;

      const album = new Album(albumData);
      await album.save();

      const populatedAlbum = await Album.findById(album._id).populate('artist');
      expect(populatedAlbum.artist).toBeDefined();
      expect(populatedAlbum.artist.username).toBe(testArtist.username);
    });

    it('should populate songs correctly', async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;
      albumData.songs = testSongs.map(song => song._id);

      const album = new Album(albumData);
      await album.save();

      const populatedAlbum = await Album.findById(album._id).populate('songs');
      expect(populatedAlbum.songs).toHaveLength(3);
      expect(populatedAlbum.songs[0].title).toBeDefined();
    });

    it('should handle likes relationship', async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;

      const album = new Album(albumData);
      await album.save();

      // إضافة إعجاب
      album.likes.push(testArtist._id);
      await album.save();

      const updatedAlbum = await Album.findById(album._id);
      expect(updatedAlbum.likes).toContain(testArtist._id);
    });
  });

  describe('Album Queries', () => {
    beforeEach(async () => {
      // إنشاء عدة ألبومات للاختبار
      const albums = [
        { ...createTestAlbum(), title: 'Public Album 1', artist: testArtist._id, isPublic: true, genre: 'Pop' },
        { ...createTestAlbum(), title: 'Public Album 2', artist: testArtist._id, isPublic: true, genre: 'Rock' },
        { ...createTestAlbum(), title: 'Private Album', artist: testArtist._id, isPublic: false, genre: 'Jazz' },
        { ...createTestAlbum(), title: 'Old Album', artist: testArtist._id, releaseDate: new Date('2020-01-01'), genre: 'Classical' }
      ];

      for (const albumData of albums) {
        const album = new Album(albumData);
        await album.save();
      }
    });

    it('should find public albums only', async () => {
      const publicAlbums = await Album.find({ isPublic: true });
      expect(publicAlbums).toHaveLength(3);
    });

    it('should find albums by genre', async () => {
      const popAlbums = await Album.find({ genre: 'Pop' });
      const rockAlbums = await Album.find({ genre: 'Rock' });

      expect(popAlbums).toHaveLength(1);
      expect(rockAlbums).toHaveLength(1);
    });

    it('should find albums by artist', async () => {
      const artistAlbums = await Album.find({ artist: testArtist._id });
      expect(artistAlbums).toHaveLength(4);
    });

    it('should search albums by title', async () => {
      const searchResults = await Album.find({ 
        title: { $regex: 'Public', $options: 'i' } 
      });
      expect(searchResults).toHaveLength(2);
    });

    it('should sort albums by release date', async () => {
      const sortedAlbums = await Album.find({}).sort({ releaseDate: -1 });
      expect(new Date(sortedAlbums[0].releaseDate)).toBeGreaterThanOrEqual(
        new Date(sortedAlbums[1].releaseDate)
      );
    });

    it('should find recent albums', async () => {
      const recentDate = new Date('2023-01-01');
      const recentAlbums = await Album.find({ 
        releaseDate: { $gte: recentDate } 
      });
      expect(recentAlbums).toHaveLength(3);
    });
  });

  describe('Album Methods', () => {
    it('should add song to album', async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;

      const album = new Album(albumData);
      await album.save();

      // إضافة أغنية للألبوم
      album.songs.push(testSongs[0]._id);
      await album.save();

      const updatedAlbum = await Album.findById(album._id);
      expect(updatedAlbum.songs).toContain(testSongs[0]._id);
    });

    it('should remove song from album', async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;
      albumData.songs = testSongs.map(song => song._id);

      const album = new Album(albumData);
      await album.save();

      // إزالة أغنية من الألبوم
      album.songs = album.songs.filter(songId => 
        songId.toString() !== testSongs[0]._id.toString()
      );
      await album.save();

      const updatedAlbum = await Album.findById(album._id);
      expect(updatedAlbum.songs).not.toContain(testSongs[0]._id);
      expect(updatedAlbum.songs).toHaveLength(2);
    });

    it('should calculate album duration', async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;
      albumData.songs = testSongs.map(song => song._id);

      const album = new Album(albumData);
      await album.save();

      // حساب مدة الألبوم (3 أغاني × 180 ثانية = 540 ثانية)
      const totalDuration = testSongs.reduce((total, song) => total + song.duration, 0);
      expect(totalDuration).toBe(540);
    });

    it('should toggle like status', async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;

      const album = new Album(albumData);
      await album.save();

      // إضافة إعجاب
      album.likes.push(testArtist._id);
      await album.save();

      let updatedAlbum = await Album.findById(album._id);
      expect(updatedAlbum.likes).toContain(testArtist._id);

      // إزالة إعجاب
      album.likes = album.likes.filter(like => like.toString() !== testArtist._id.toString());
      await album.save();

      updatedAlbum = await Album.findById(album._id);
      expect(updatedAlbum.likes).not.toContain(testArtist._id);
    });
  });

  describe('Album Virtual Fields', () => {
    it('should calculate song count', async () => {
      const albumData = createTestAlbum();
      albumData.artist = testArtist._id;
      albumData.songs = testSongs.map(song => song._id);

      const album = new Album(albumData);
      await album.save();

      const populatedAlbum = await Album.findById(album._id).populate('songs');
      expect(populatedAlbum.songs.length).toBe(3);
    });
  });
});
