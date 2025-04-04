require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./model/user.model');

// Email of the user whose password you want to reset
const userEmail = 'saroch123@gmail.com';  // Change this to the email you want to reset
const newPassword = 'password123';         // New password to set

async function resetPassword() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find the user
    const user = await User.findOne({ email: userEmail });
    
    if (!user) {
      console.log(`User with email ${userEmail} not found`);
      return;
    }

    // Update the password
    user.password = newPassword;
    await user.save();
    
    console.log(`Password reset successful for ${userEmail}`);
    console.log(`New password is: ${newPassword}`);

  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

resetPassword(); 