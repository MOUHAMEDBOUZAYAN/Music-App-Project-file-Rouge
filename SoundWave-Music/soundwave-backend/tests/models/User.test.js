const mongoose = require('mongoose');
const User = require('../../src/models/User');
const { createTestUser } = require('../testData');

describe('User Model', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('User Creation', () => {
    it('should create a new user with valid data', async () => {
      const userData = createTestUser('artist');
      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.role).toBe(userData.role);
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.bio).toBe(userData.bio);
      expect(savedUser.isVerified).toBe(userData.isVerified);
    });

    it('should hash password before saving', async () => {
      const userData = createTestUser('listener');
      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.password).not.toBe(userData.password);
      expect(savedUser.password).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash pattern
    });

    it('should set default values correctly', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'TestPassword123!',
        role: 'listener'
      };
      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser.isVerified).toBe(false);
      expect(savedUser.followers).toEqual([]);
      expect(savedUser.following).toEqual([]);
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });
  });

  describe('User Validation', () => {
    it('should require username', async () => {
      const userData = createTestUser('listener');
      delete userData.username;
      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should require email', async () => {
      const userData = createTestUser('listener');
      delete userData.email;
      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should require password', async () => {
      const userData = createTestUser('listener');
      delete userData.password;
      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should require valid email format', async () => {
      const userData = createTestUser('listener');
      userData.email = 'invalid-email';
      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });

    it('should require unique username', async () => {
      const userData1 = createTestUser('listener');
      const userData2 = createTestUser('artist');
      userData2.username = userData1.username;

      const user1 = new User(userData1);
      await user1.save();

      const user2 = new User(userData2);
      await expect(user2.save()).rejects.toThrow();
    });

    it('should require unique email', async () => {
      const userData1 = createTestUser('listener');
      const userData2 = createTestUser('artist');
      userData2.email = userData1.email;

      const user1 = new User(userData1);
      await user1.save();

      const user2 = new User(userData2);
      await expect(user2.save()).rejects.toThrow();
    });

    it('should validate role enum', async () => {
      const userData = createTestUser('listener');
      userData.role = 'invalid-role';
      const user = new User(userData);

      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('User Methods', () => {
    it('should compare password correctly', async () => {
      const userData = createTestUser('listener');
      const user = new User(userData);
      await user.save();

      const isMatch = await user.comparePassword(userData.password);
      expect(isMatch).toBe(true);

      const isNotMatch = await user.comparePassword('wrongpassword');
      expect(isNotMatch).toBe(false);
    });

    it('should generate JWT token', async () => {
      const userData = createTestUser('artist');
      const user = new User(userData);
      await user.save();

      const token = user.getSignedJwtToken();
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });
  });

  describe('User Relationships', () => {
    it('should handle followers relationship', async () => {
      const followerData = createTestUser('listener');
      const followingData = createTestUser('artist');
      
      const follower = new User(followerData);
      const following = new User(followingData);
      
      await follower.save();
      await following.save();

      // Add follower
      following.followers.push(follower._id);
      follower.following.push(following._id);
      
      await following.save();
      await follower.save();

      const updatedFollowing = await User.findById(following._id);
      const updatedFollower = await User.findById(follower._id);

      expect(updatedFollowing.followers).toContain(follower._id);
      expect(updatedFollower.following).toContain(following._id);
    });
  });

  describe('User Queries', () => {
    beforeEach(async () => {
      const users = [
        createTestUser('artist'),
        createTestUser('listener'),
        createTestUser('admin')
      ];
      
      for (const userData of users) {
        const user = new User(userData);
        await user.save();
      }
    });

    it('should find users by role', async () => {
      const artists = await User.find({ role: 'artist' });
      const listeners = await User.find({ role: 'listener' });
      const admins = await User.find({ role: 'admin' });

      expect(artists).toHaveLength(1);
      expect(listeners).toHaveLength(1);
      expect(admins).toHaveLength(1);
    });

    it('should find verified users', async () => {
      const verifiedUsers = await User.find({ isVerified: true });
      expect(verifiedUsers).toHaveLength(3);
    });

    it('should search users by username', async () => {
      const user = await User.findOne({ username: 'testartist' });
      expect(user).toBeDefined();
      expect(user.role).toBe('artist');
    });
  });
});
