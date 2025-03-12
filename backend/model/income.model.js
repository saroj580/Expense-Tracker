const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    icone: {
        type: String,
    },
    source: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model("Income", incomeSchema)
