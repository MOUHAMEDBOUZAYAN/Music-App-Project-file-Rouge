const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/soundwave';
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    // Get database name from connection
    const dbName = conn.connection.name;
    const dbHost = conn.connection.host;
    
    console.log('\n📊 Database Connection Status:');
    console.log('✅ Database connected:', dbHost);
    console.log('📊 Database name:', dbName);
    console.log('🔗 Connection string:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    
  } catch (error) {
    console.log('\n❌ Database Connection Error:');
    console.error('💥 MongoDB connection error:', error.message);
    console.log('⚠️  Continuing without database connection...');
    // Don't exit, just continue without database
  }
};

module.exports = connectDB;
