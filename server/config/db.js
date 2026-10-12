const mongoose = require('mongoose');

let isConnected = false;
const inMemoryHistory = [];

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log('ℹ️ No MONGODB_URI provided. History will be stored in-memory for this session.');
    isConnected = false;
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    isConnected = true;
    console.log('✅ Connected successfully to MongoDB');
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection failed: ${error.message}`);
    console.log('ℹ️ Running in fallback mode: core analyzer works 100%, history stored in-memory.');
    isConnected = false;
    return false;
  }
};

const isDbConnected = () => isConnected && mongoose.connection.readyState === 1;

module.exports = {
  connectDB,
  isDbConnected,
  inMemoryHistory,
};
