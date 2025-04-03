require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./model/user.model');
const bcrypt = require('bcryptjs');

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists. No need to create.');
      return;
    }

    // Create a test user
    const testUser = new User({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    // Save the user to the database
    await testUser.save();
    console.log('Test user created successfully!');
    console.log('Credentials: email=test@example.com, password=password123');

  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

createTestUser(); 