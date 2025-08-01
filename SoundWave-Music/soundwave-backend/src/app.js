const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Import middleware
const {
  corsConfig,
  securityHeaders,
  requestLogger,
  performanceLogger,
  generalLimiter,
  errorHandler,
  notFound
} = require('./middleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware de sécurité et CORS
app.use(securityHeaders);
app.use(corsConfig);

// Middleware de limitation de taux général
app.use(generalLimiter);

// Middleware de logging
app.use(requestLogger);
app.use(performanceLogger);

// Middleware de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth/spotify', require('./routes/spotify.routes'));
app.use('/api/users', require('./routes/users'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/search', require('./routes/search'));
app.use('/api/social', require('./routes/social'));

// Routes 404 - doit être placé avant le middleware d'erreur
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 