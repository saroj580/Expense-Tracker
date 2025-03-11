const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    }, 
    type: { 
        type: String, 
        enum: ['Reminder', 'Alert', 'Info'], 
        required: true 
    },
    isRead: {
        type: Boolean,
        default: false
    }, 
   createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Notification", notificationSchema);
