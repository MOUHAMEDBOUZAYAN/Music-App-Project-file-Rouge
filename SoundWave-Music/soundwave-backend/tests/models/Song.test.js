const mongoose = require('mongoose');
const Song = require('../../src/models/Song');
const User = require('../../src/models/User');
const Album = require('../../src/models/Album');
const { createTestUser, createTestSong, createTestAlbum } = require('../testData');

describe('Song Model', () => {
  let testArtist;
  let testAlbum;

  beforeEach(async () => {
    await Song.deleteMany({});
    await User.deleteMany({});
    await Album.deleteMany({});

    // إنشاء فنان للاختبار
    const artistData = createTestUser('artist');
    testArtist = new User(artistData);
    await testArtist.save();

    // إنشاء ألبوم للاختبار
    const albumData = createTestAlbum();
    albumData.artist = testArtist._id;
    testAlbum = new Album(albumData);
    await testAlbum.save();
  });

  afterEach(async () => {
    await Song.deleteMany({});
    await User.deleteMany({});
    await Album.deleteMany({});
  });

  describe('Song Creation', () => {
    it('should create a new song with valid data', async () => {
      const songData = createTestSong();
      songData.artist = testArtist._id;
      songData.album = testAlbum._id;

      const song = new Song(songData);
      const savedSong = await song.save();

      expect(savedSong._id).toBeDefined();
      expect(savedSong.title).toBe(songData.title);
      expect(savedSong.artist.toString()).toBe(testArtist._id.toString());
      expect(savedSong.album.toString()).toBe(testAlbum._id.toString());
      expect(savedSong.genre).toBe(songData.genre);
      expect(savedSong.duration).toBe(songData.duration);
      expect(savedSong.audioUrl).toBe(songData.audioUrl);
      expect(savedSong.coverImage).toBe(songData.coverImage);
      expect(savedSong.plays).toBe(0);
      expect(savedSong.likes).toEqual([]);
      expect(savedSong.comments).toEqual([]);
      expect(savedSong.isPublic).toBe(true);
    });

    it('should set default values correctly', async () => {
      const songData = {
        title: 'Test Song',
        artist: testArtist._id,
        genre: 'Pop'
      };

      const song = new Song(songData);
      const savedSong = await song.save();

      expect(savedSong.plays).toBe(0);
      expect(savedSong.likes).toEqual([]);
      expect(savedSong.comments).toEqual([]);
      expect(savedSong.isPublic).toBe(true);
      expect(savedSong.createdAt).toBeDefined();
      expect(savedSong.updatedAt).toBeDefined();
    });
  });

  describe('Song Validation', () => {
    it('should require title', async () => {
      const songData = createTestSong();
      delete songData.title;
      songData.artist = testArtist._id;

      const song = new Song(songData);
      await expect(song.save()).rejects.toThrow();
    });

    it('should require artist', async () => {
      const songData = createTestSong();
      delete songData.artist;

      const song = new Song(songData);
      await expect(song.save()).rejects.toThrow();
    });

    it('should require genre', async () => {
      const songData = createTestSong();
      delete songData.genre;
      songData.artist = testArtist._id;

      const song = new Song(songData);
      await expect(song.save()).rejects.toThrow();
    });

    it('should validate genre enum', async () => {
      const songData = createTestSong();
      songData.artist = testArtist._id;
      songData.genre = 'InvalidGenre';

      const song = new Song(songData);
      await expect(song.save()).rejects.toThrow();
    });

    it('should validate duration as positive number', async () => {
      const songData = createTestSong();
      songData.artist = testArtist._id;
      songData.duration = -100;

      const song = new Song(songData);
      await expect(song.save()).rejects.toThrow();
    });
  });

  describe('Song Relationships', () => {
    it('should populate artist correctly', async () => {
      const songData = createTestSong();
      songData.artist = testArtist._id;

      const song = new Song(songData);
      await song.save();

      const populatedSong = await Song.findById(song._id).populate('artist');
      expect(populatedSong.artist).toBeDefined();
      expect(populatedSong.artist.username).toBe(testArtist.username);
    });

    it('should populate album correctly', async () => {
      const songData = createTestSong();
      songData.artist = testArtist._id;
      songData.album = testAlbum._id;

      const song = new Song(songData);
      await song.save();

      const populatedSong = await Song.findById(song._id).populate('album');
      expect(populatedSong.album).toBeDefined();
      expect(populatedSong.album.title).toBe(testAlbum.title);
    });

    it('should handle likes relationship', async () => {
      const songData = createTestSong();
      songData.artist = testArtist._id;

      const song = new Song(songData);
      await song.save();

      // إضافة إعجاب
      song.likes.push(testArtist._id);
      await song.save();

      const updatedSong = await Song.findById(song._id);
      expect(updatedSong.likes).toContain(testArtist._id);
    });
  });

  describe('Song Queries', () => {
    beforeEach(async () => {
      // إنشاء عدة أغاني للاختبار
      const songs = [
        { ...createTestSong(), title: 'Public Song 1', artist: testArtist._id, isPublic: true },
        { ...createTestSong(), title: 'Public Song 2', artist: testArtist._id, isPublic: true },
        { ...createTestSong(), title: 'Private Song', artist: testArtist._id, isPublic: false },
        { ...createTestSong(), title: 'Pop Song', artist: testArtist._id, genre: 'Pop' },
        { ...createTestSong(), title: 'Rock Song', artist: testArtist._id, genre: 'Rock' }
      ];

      for (const songData of songs) {
        const song = new Song(songData);
        await song.save();
      }
    });

    it('should find public songs only', async () => {
      const publicSongs = await Song.find({ isPublic: true });
      expect(publicSongs).toHaveLength(4);
    });

    it('should find songs by genre', async () => {
      const popSongs = await Song.find({ genre: 'Pop' });
      const rockSongs = await Song.find({ genre: 'Rock' });

      expect(popSongs).toHaveLength(1);
      expect(rockSongs).toHaveLength(1);
    });

    it('should find songs by artist', async () => {
      const artistSongs = await Song.find({ artist: testArtist._id });
      expect(artistSongs).toHaveLength(5);
    });

    it('should search songs by title', async () => {
      const searchResults = await Song.find({ 
        title: { $regex: 'Public', $options: 'i' } 
      });
      expect(searchResults).toHaveLength(2);
    });

    it('should sort songs by plays', async () => {
      // تحديث عدد التشغيلات
      await Song.updateMany({}, { $set: { plays: Math.floor(Math.random() * 100) } });
      
      const sortedSongs = await Song.find({}).sort({ plays: -1 });
      expect(sortedSongs[0].plays).toBeGreaterThanOrEqual(sortedSongs[1].plays);
    });
  });

  describe('Song Methods', () => {
    it('should increment plays count', async () => {
      const songData = createTestSong();
      songData.artist = testArtist._id;

      const song = new Song(songData);
      await song.save();

      expect(song.plays).toBe(0);

      song.plays += 1;
      await song.save();

      const updatedSong = await Song.findById(song._id);
      expect(updatedSong.plays).toBe(1);
    });

    it('should toggle like status', async () => {
      const songData = createTestSong();
      songData.artist = testArtist._id;

      const song = new Song(songData);
      await song.save();

      // إضافة إعجاب
      song.likes.push(testArtist._id);
      await song.save();

      let updatedSong = await Song.findById(song._id);
      expect(updatedSong.likes).toContain(testArtist._id);

      // إزالة إعجاب
      song.likes = song.likes.filter(like => like.toString() !== testArtist._id.toString());
      await song.save();

      updatedSong = await Song.findById(song._id);
      expect(updatedSong.likes).not.toContain(testArtist._id);
    });
  });
});
