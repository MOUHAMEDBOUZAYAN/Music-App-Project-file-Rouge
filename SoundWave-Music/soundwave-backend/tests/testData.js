// بيانات اختبار شاملة لتطبيق SoundWave

const testUsers = {
  artist: {
    username: 'testartist',
    email: 'artist@test.com',
    password: 'TestPassword123!',
    role: 'artist',
    name: 'Test Artist',
    bio: 'I am a test artist',
    profilePicture: '/uploads/images/test-artist.jpg',
    isVerified: true,
    followers: [],
    following: []
  },
  listener: {
    username: 'testlistener',
    email: 'listener@test.com',
    password: 'TestPassword123!',
    role: 'listener',
    name: 'Test Listener',
    bio: 'I love music',
    profilePicture: '/uploads/images/test-listener.jpg',
    isVerified: true,
    followers: [],
    following: []
  },
  admin: {
    username: 'testadmin',
    email: 'admin@test.com',
    password: 'TestPassword123!',
    role: 'admin',
    name: 'Test Admin',
    bio: 'I manage the platform',
    profilePicture: '/uploads/images/test-admin.jpg',
    isVerified: true,
    followers: [],
    following: []
  }
};

const testSongs = [
  {
    title: 'Test Song 1',
    artist: null, // سيتم تعيينه في الاختبار
    album: null,
    genre: 'Pop',
    duration: 180,
    audioUrl: '/uploads/audio/test-song-1.mp3',
    coverImage: '/uploads/images/test-cover-1.jpg',
    plays: 0,
    likes: [],
    comments: [],
    isPublic: true
  },
  {
    title: 'Test Song 2',
    artist: null,
    album: null,
    genre: 'Rock',
    duration: 240,
    audioUrl: '/uploads/audio/test-song-2.mp3',
    coverImage: '/uploads/images/test-cover-2.jpg',
    plays: 0,
    likes: [],
    comments: [],
    isPublic: true
  },
  {
    title: 'Private Song',
    artist: null,
    album: null,
    genre: 'Jazz',
    duration: 300,
    audioUrl: '/uploads/audio/private-song.mp3',
    coverImage: '/uploads/images/private-cover.jpg',
    plays: 0,
    likes: [],
    comments: [],
    isPublic: false
  }
];

const testAlbums = [
  {
    title: 'Test Album 1',
    artist: null, // سيتم تعيينه في الاختبار
    genre: 'Pop',
    releaseDate: new Date('2024-01-01'),
    coverImage: '/uploads/images/test-album-1.jpg',
    songs: [],
    likes: [],
    isPublic: true
  },
  {
    title: 'Test Album 2',
    artist: null,
    genre: 'Rock',
    releaseDate: new Date('2024-02-01'),
    coverImage: '/uploads/images/test-album-2.jpg',
    songs: [],
    likes: [],
    isPublic: true
  }
];

const testPlaylists = [
  {
    name: 'My Test Playlist',
    description: 'A test playlist',
    owner: null, // سيتم تعيينه في الاختبار
    songs: [],
    isPublic: true,
    likes: []
  },
  {
    name: 'Private Playlist',
    description: 'A private test playlist',
    owner: null,
    songs: [],
    isPublic: false,
    likes: []
  }
];

const testComments = [
  {
    content: 'This is a great song!',
    author: null, // سيتم تعيينه في الاختبار
    song: null,
    likes: [],
    replies: []
  },
  {
    content: 'Amazing work!',
    author: null,
    song: null,
    likes: [],
    replies: []
  }
];

const testFollows = [
  {
    follower: null, // سيتم تعيينه في الاختبار
    following: null,
    createdAt: new Date()
  }
];

const testExternalFavorites = [
  {
    userId: null, // سيتم تعيينه في الاختبار
    spotifyId: 'spotify:track:1234567890',
    type: 'track',
    title: 'External Song',
    artist: 'External Artist',
    album: 'External Album',
    imageUrl: 'https://example.com/image.jpg',
    previewUrl: 'https://example.com/preview.mp3',
    externalUrl: 'https://open.spotify.com/track/1234567890'
  }
];

// دوال مساعدة لإنشاء بيانات الاختبار
const createTestUser = (userType = 'listener') => {
  return { ...testUsers[userType] };
};

const createTestSong = (overrides = {}) => {
  return { ...testSongs[0], ...overrides };
};

const createTestAlbum = (overrides = {}) => {
  return { ...testAlbums[0], ...overrides };
};

const createTestPlaylist = (overrides = {}) => {
  return { ...testPlaylists[0], ...overrides };
};

const createTestComment = (overrides = {}) => {
  return { ...testComments[0], ...overrides };
};

const createTestFollow = (overrides = {}) => {
  return { ...testFollows[0], ...overrides };
};

const createTestExternalFavorite = (overrides = {}) => {
  return { ...testExternalFavorites[0], ...overrides };
};

// بيانات API للاختبار
const apiTestData = {
  validLoginCredentials: {
    email: 'artist@test.com',
    password: 'TestPassword123!'
  },
  invalidLoginCredentials: {
    email: 'invalid@test.com',
    password: 'wrongpassword'
  },
  validRegistrationData: {
    username: 'newuser',
    email: 'newuser@test.com',
    password: 'NewPassword123!',
    confirmPassword: 'NewPassword123!',
    role: 'listener',
    name: 'New User'
  },
  invalidRegistrationData: {
    username: '',
    email: 'invalid-email',
    password: '123',
    confirmPassword: '456',
    role: 'invalid-role'
  },
  validSongData: {
    title: 'New Test Song',
    genre: 'Electronic',
    isPublic: true
  },
  invalidSongData: {
    title: '',
    genre: 'InvalidGenre',
    isPublic: 'not-boolean'
  },
  validAlbumData: {
    title: 'New Test Album',
    genre: 'Electronic',
    releaseDate: '2024-12-01',
    isPublic: true
  },
  invalidAlbumData: {
    title: '',
    genre: 'InvalidGenre',
    releaseDate: 'invalid-date',
    isPublic: 'not-boolean'
  }
};

module.exports = {
  testUsers,
  testSongs,
  testAlbums,
  testPlaylists,
  testComments,
  testFollows,
  testExternalFavorites,
  apiTestData,
  createTestUser,
  createTestSong,
  createTestAlbum,
  createTestPlaylist,
  createTestComment,
  createTestFollow,
  createTestExternalFavorite
};
