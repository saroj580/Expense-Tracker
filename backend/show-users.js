require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./model/user.model');

async function showUsers() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({}).select('-password');
    
    console.log('===== REGISTERED USERS =====');
    if (users.length === 0) {
      console.log('No users found in the database');
    } else {
      users.forEach((user, index) => {
        console.log(`\nUser #${index + 1}:`);
        console.log(`Full Name: ${user.fullName}`);
        console.log(`Email: ${user.email}`);
        console.log(`ID: ${user._id}`);
        console.log(`Created: ${user.createdAt}`);
      });
      
      console.log(`\nTotal users: ${users.length}`);
    }

  } catch (error) {
    console.error('Error listing users:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

showUsers(); 