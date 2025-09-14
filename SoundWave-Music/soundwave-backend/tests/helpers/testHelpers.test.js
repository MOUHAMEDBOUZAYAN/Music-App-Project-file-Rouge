const mongoose = require('mongoose');
const {
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
} = require('./testHelpers');
const User = require('../../src/models/User');
const Song = require('../../src/models/Song');
const Album = require('../../src/models/Album');

describe('Test Helpers', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe('createTestUserWithRole', () => {
    it('should create user with specified role', async () => {
      const user = await createTestUserWithRole('artist');
      
      expect(user).toBeDefined();
      expect(user.role).toBe('artist');
      expect(user._id).toBeDefined();
    });

    it('should create user with overrides', async () => {
      const overrides = { name: 'Custom Name' };
      const user = await createTestUserWithRole('listener', overrides);
      
      expect(user.name).toBe('Custom Name');
      expect(user.role).toBe('listener');
    });
  });

  describe('createArtistWithContent', () => {
    it('should create artist with songs and albums', async () => {
      const { artist, songs, albums } = await createArtistWithContent({
        songsCount: 2,
        albumsCount: 1
      });

      expect(artist).toBeDefined();
      expect(artist.role).toBe('artist');
      expect(songs).toHaveLength(2);
      expect(albums).toHaveLength(1);
    });

    it('should create artist with default content', async () => {
      const { artist, songs, albums } = await createArtistWithContent();

      expect(artist).toBeDefined();
      expect(songs).toHaveLength(3);
      expect(albums).toHaveLength(2);
    });
  });

  describe('createFollowRelationship', () => {
    it('should create follow relationship between users', async () => {
      const follower = await createTestUserWithRole('listener');
      const following = await createTestUserWithRole('artist');

      await createFollowRelationship(follower, following);

      const updatedFollower = await User.findById(follower._id);
      const updatedFollowing = await User.findById(following._id);

      expect(updatedFollower.following).toContain(following._id);
      expect(updatedFollowing.followers).toContain(follower._id);
    });
  });

  describe('likeSong', () => {
    it('should add like to song', async () => {
      const user = await createTestUserWithRole('listener');
      const artist = await createTestUserWithRole('artist');
      
      const songData = createValidSongData(artist);
      const song = new Song(songData);
      await song.save();

      await likeSong(user, song);

      const updatedSong = await Song.findById(song._id);
      expect(updatedSong.likes).toContain(user._id);
    });
  });

  describe('likeAlbum', () => {
    it('should add like to album', async () => {
      const user = await createTestUserWithRole('listener');
      const artist = await createTestUserWithRole('artist');
      
      const albumData = createValidAlbumData(artist);
      const album = new Album(albumData);
      await album.save();

      await likeAlbum(user, album);

      const updatedAlbum = await Album.findById(album._id);
      expect(updatedAlbum.likes).toContain(user._id);
    });
  });

  describe('createAuthToken', () => {
    it('should create valid JWT token', async () => {
      const user = await createTestUserWithRole('artist');
      const token = createAuthToken(user);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
  });

  describe('createAuthenticatedRequest', () => {
    it('should create request with auth headers', async () => {
      const user = await createTestUserWithRole('artist');
      const request = createAuthenticatedRequest(user);

      expect(request.headers).toBeDefined();
      expect(request.headers.Authorization).toContain('Bearer');
    });
  });

  describe('wait', () => {
    it('should wait for specified time', async () => {
      const start = Date.now();
      await wait(100);
      const end = Date.now();

      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });

  describe('hasField', () => {
    it('should return true if object has field', () => {
      const obj = { name: 'test', value: 123 };
      
      expect(hasField(obj, 'name')).toBe(true);
      expect(hasField(obj, 'value')).toBe(true);
    });

    it('should return false if object does not have field', () => {
      const obj = { name: 'test' };
      
      expect(hasField(obj, 'missing')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(hasField(null, 'field')).toBe(false);
      expect(hasField(undefined, 'field')).toBe(false);
    });
  });

  describe('hasAllFields', () => {
    it('should return true if object has all fields', () => {
      const obj = { name: 'test', value: 123, active: true };
      
      expect(hasAllFields(obj, ['name', 'value'])).toBe(true);
      expect(hasAllFields(obj, ['name', 'value', 'active'])).toBe(true);
    });

    it('should return false if object missing any field', () => {
      const obj = { name: 'test', value: 123 };
      
      expect(hasAllFields(obj, ['name', 'missing'])).toBe(false);
    });
  });

  describe('createValidObjectId', () => {
    it('should create valid MongoDB ObjectId', () => {
      const id = createValidObjectId();
      
      expect(mongoose.Types.ObjectId.isValid(id)).toBe(true);
    });
  });

  describe('createInvalidObjectId', () => {
    it('should create invalid ObjectId', () => {
      const id = createInvalidObjectId();
      
      expect(mongoose.Types.ObjectId.isValid(id)).toBe(false);
    });
  });

  describe('createValidSongData', () => {
    it('should create valid song data', async () => {
      const artist = await createTestUserWithRole('artist');
      const songData = createValidSongData(artist);

      expect(songData.title).toBe('Test Song');
      expect(songData.artist).toBe(artist._id);
      expect(songData.genre).toBe('Pop');
      expect(songData.duration).toBe(180);
      expect(songData.isPublic).toBe(true);
    });

    it('should create song data with album', async () => {
      const artist = await createTestUserWithRole('artist');
      const album = new Album(createValidAlbumData(artist));
      await album.save();

      const songData = createValidSongData(artist, album);

      expect(songData.album).toBe(album._id);
    });
  });

  describe('createValidAlbumData', () => {
    it('should create valid album data', async () => {
      const artist = await createTestUserWithRole('artist');
      const albumData = createValidAlbumData(artist);

      expect(albumData.title).toBe('Test Album');
      expect(albumData.artist).toBe(artist._id);
      expect(albumData.genre).toBe('Pop');
      expect(albumData.releaseDate).toBe('2024-01-01');
      expect(albumData.isPublic).toBe(true);
    });

    it('should create album data with songs', async () => {
      const artist = await createTestUserWithRole('artist');
      const songs = [];
      
      for (let i = 0; i < 2; i++) {
        const song = new Song(createValidSongData(artist));
        await song.save();
        songs.push(song);
      }

      const albumData = createValidAlbumData(artist, songs);

      expect(albumData.songs).toHaveLength(2);
      expect(albumData.songs[0]).toBe(songs[0]._id);
    });
  });

  describe('createValidUserData', () => {
    it('should create valid user data', () => {
      const userData = createValidUserData('artist');

      expect(userData.username).toBeDefined();
      expect(userData.email).toBeDefined();
      expect(userData.password).toBe('TestPassword123!');
      expect(userData.role).toBe('artist');
      expect(userData.name).toBeDefined();
    });

    it('should create unique data each time', () => {
      const userData1 = createValidUserData('artist');
      const userData2 = createValidUserData('artist');

      expect(userData1.username).not.toBe(userData2.username);
      expect(userData1.email).not.toBe(userData2.email);
    });
  });

  describe('validateApiResponse', () => {
    it('should validate successful response', () => {
      const response = {
        status: 200,
        body: {
          success: true,
          data: { user: { id: 1 } }
        }
      };

      expect(() => validateApiResponse(response, 200, true)).not.toThrow();
    });

    it('should validate error response', () => {
      const response = {
        status: 400,
        body: {
          success: false,
          message: 'Error message'
        }
      };

      expect(() => validateApiResponse(response, 400, false)).not.toThrow();
    });

    it('should throw for invalid status', () => {
      const response = {
        status: 200,
        body: { success: true, data: {} }
      };

      expect(() => validateApiResponse(response, 400, true)).toThrow();
    });
  });

  describe('createTempFile and deleteTempFile', () => {
    it('should create and delete temp file', () => {
      const content = 'test content';
      const filePath = createTempFile(content, '.txt');

      expect(filePath).toBeDefined();
      
      const fs = require('fs');
      expect(fs.existsSync(filePath)).toBe(true);
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      expect(fileContent).toBe(content);

      deleteTempFile(filePath);
      expect(fs.existsSync(filePath)).toBe(false);
    });
  });
});
