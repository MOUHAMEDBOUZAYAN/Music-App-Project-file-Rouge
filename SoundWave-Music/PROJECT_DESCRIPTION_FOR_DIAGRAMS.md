# 🎵 SoundWave Music Platform - Functional Description for Diagrams

## 📋 Project Overview

**SoundWave** is a comprehensive music streaming platform that serves as a professional alternative to Spotify with additional features for artists. The platform enables users to listen to music, create playlists, follow artists, and manage their musical content.

## 👥 User Roles & Capabilities

### 1. **Listener** (Default Role)
- **Authentication**: Register, Login, Logout
- **Music Consumption**: 
  - Browse and search music
  - Play songs and albums
  - Create and manage playlists
  - Like/unlike songs and albums
  - Follow/unfollow artists
- **Social Features**:
  - View artist profiles
  - See followed artists in library
  - Access new releases from followed artists
- **Profile Management**: Update profile, change password

### 2. **Artist** (Extended Role)
- **All Listener capabilities** +
- **Content Management**:
  - Upload songs with audio files and cover images
  - Create and manage albums
  - Edit/update song information
  - Delete songs and albums
- **Dashboard**: Access artist dashboard for content management
- **Analytics**: View performance statistics
- **Social**: Manage followers and following

### 3. **Admin** (Full Access)
- **All Artist capabilities** +
- **System Management**:
  - User management
  - Content moderation
  - System monitoring
  - Administrative controls

## 🏗️ System Architecture

### **Frontend (React.js)**
- **Technology**: React 18, Vite, Tailwind CSS
- **State Management**: Context API (AuthContext, MusicContext, SidebarContext)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **UI Components**: Lucide React icons, React Hot Toast

### **Backend (Node.js/Express)**
- **Technology**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **File Upload**: Multer with Cloudinary integration
- **Validation**: Express-validator, Joi
- **Security**: Helmet, CORS, Rate limiting

### **Database (MongoDB)**
- **Models**: User, Song, Album, Playlist, Comment, Follow, ExternalFavorite
- **Relationships**: Complex many-to-many relationships between users, songs, albums

## 📊 Data Models & Relationships

### **User Model**
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: Enum ['listener', 'artist', 'admin'],
  profilePicture: String,
  bio: String,
  followers: [ObjectId -> User],
  following: [ObjectId -> User],
  followedAlbums: [ObjectId -> Album],
  createdAt: Date
}
```

### **Song Model**
```javascript
{
  title: String,
  artist: ObjectId -> User,
  album: String,
  duration: Number,
  audioUrl: String,
  coverImage: String,
  genre: [String],
  tags: [String],
  plays: Number,
  likes: [ObjectId -> User],
  comments: [ObjectId -> Comment],
  isPublic: Boolean,
  releaseDate: Date
}
```

### **Album Model**
```javascript
{
  title: String,
  artist: ObjectId -> User,
  releaseDate: Date,
  coverImage: String,
  songs: [ObjectId -> Song],
  genre: [String],
  description: String,
  songsCount: Number,
  views: Number,
  likes: [ObjectId -> User],
  likesCount: Number,
  followers: [ObjectId -> User]
}
```

### **Playlist Model**
```javascript
{
  name: String,
  owner: ObjectId -> User,
  description: String,
  songs: [ObjectId -> Song],
  isPublic: Boolean,
  isDraft: Boolean,
  coverImage: String
}
```

## 🔄 Main User Flows

### **1. Authentication Flow**
1. User visits platform
2. User registers/logs in
3. System validates credentials
4. JWT token generated and stored
5. User redirected to appropriate dashboard

### **2. Music Discovery Flow**
1. User browses home page
2. System loads trending music, new releases
3. User can search for specific songs/artists
4. User can filter by genre, popularity, date
5. User clicks on song to play

### **3. Music Playback Flow**
1. User selects song
2. Music player loads audio file
3. User can play/pause, skip, adjust volume
4. System tracks play count
5. User can add to queue, like, add to playlist

### **4. Artist Content Management Flow**
1. Artist logs into dashboard
2. Artist uploads new song (audio + cover)
3. System processes and stores files
4. Song appears in artist's catalog
5. Song becomes available to listeners

### **5. Social Interaction Flow**
1. User views artist profile
2. User can follow/unfollow artist
3. User can like/unlike songs
4. System updates relationship data
5. User sees updates in their library

## 🛠️ API Endpoints

### **Authentication Routes**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update user profile
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### **Song Routes**
- `GET /api/songs` - Search songs
- `GET /api/songs/:id` - Get song details
- `GET /api/songs/artist/:artistId` - Get artist's songs
- `POST /api/songs` - Upload new song (Artist only)
- `PUT /api/songs/:id` - Update song (Owner only)
- `DELETE /api/songs/:id` - Delete song (Owner only)
- `POST /api/songs/:id/like` - Like/unlike song

### **Album Routes**
- `GET /api/albums` - Get all albums
- `GET /api/albums/:id` - Get album details
- `GET /api/albums/artist/:artistId` - Get artist's albums
- `POST /api/albums` - Create album (Artist only)
- `PUT /api/albums/:id` - Update album (Owner only)
- `DELETE /api/albums/:id` - Delete album (Owner only)
- `POST /api/albums/:id/like` - Like/unlike album

### **User Routes**
- `GET /api/users/profile/:id` - Get user profile
- `GET /api/users/search` - Search users
- `POST /api/users/follow/:id` - Follow/unfollow user
- `GET /api/users/following` - Get following list
- `GET /api/users/followers` - Get followers list
- `GET /api/users/me/songs` - Get user's songs
- `GET /api/users/me/albums` - Get user's albums

### **Playlist Routes**
- `GET /api/playlists` - Get user's playlists
- `POST /api/playlists` - Create playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/songs` - Add song to playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist

## 🎵 Music Player Features

### **Core Playback**
- Play/Pause functionality
- Skip to next/previous song
- Volume control
- Progress bar with seeking
- Repeat and shuffle modes

### **Queue Management**
- Add songs to queue
- Reorder queue
- Clear queue
- Auto-play next song

### **Social Features**
- Like/unlike songs
- Add to playlists
- Share songs
- View song details

## 📱 Responsive Design

### **Desktop (Large Screens)**
- Full sidebar navigation
- Complete music player bar
- Header with search and profile
- Grid layouts for content

### **Tablet (Medium Screens)**
- Collapsible sidebar
- Mobile navigation bar
- Responsive music player
- Adaptive layouts

### **Mobile (Small Screens)**
- Hidden sidebar
- Bottom navigation bar
- Compact music player
- Touch-optimized controls
- Swipe gestures

## 🔐 Security Features

### **Authentication & Authorization**
- JWT token-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Token expiration and refresh

### **Data Protection**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting

### **File Upload Security**
- File type validation
- File size limits
- Secure file storage
- Virus scanning (optional)

## 🧪 Testing Strategy

### **Unit Tests**
- Model validation tests
- Service function tests
- Utility function tests
- Component tests

### **Integration Tests**
- API endpoint tests
- Database integration tests
- Authentication flow tests
- File upload tests

### **End-to-End Tests**
- User journey tests
- Cross-browser compatibility
- Performance tests
- Security tests

## 🚀 Deployment & DevOps

### **Containerization**
- Docker containers for each service
- Docker Compose for orchestration
- Multi-stage builds for optimization
- Health checks for monitoring

### **Environment Management**
- Development environment
- Production environment
- Environment-specific configurations
- Secret management

### **Monitoring & Logging**
- Application logs
- Error tracking
- Performance monitoring
- User activity logging

## 📈 Performance Optimizations

### **Frontend Optimizations**
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies

### **Backend Optimizations**
- Database indexing
- Query optimization
- Caching with Redis
- CDN for static files

### **Database Optimizations**
- Proper indexing
- Connection pooling
- Query optimization
- Data archiving

## 🔄 Integration Points

### **External Services**
- Cloudinary for file storage
- Spotify API for music data
- Email services for notifications
- Payment processing (future)

### **Third-party APIs**
- Music metadata APIs
- Social media integration
- Analytics services
- Monitoring tools

This description provides a comprehensive overview of the SoundWave Music Platform that can be used to generate various types of diagrams including class diagrams, sequence diagrams, use case diagrams, and system architecture diagrams.
