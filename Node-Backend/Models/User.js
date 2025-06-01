const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    Domain:{
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    skills: [
        {
            name: {
                type: String,
                required: true,
            },
            experienceInYears: {
                type: Number,
                required: true,
                min: 0,
            }
        }
    ],
    totalworkingDays: {
        type: Number,
        default: 0,
    },
    attendedDays: {
        type: Number,
        default: 0,
    },
    city: {
        type: String,
        default: '',
    },
    state: {
        type: String,
        default: '',
    },
    country: {
        type: String,
        default: '',
    },
    profilePicture: {
        type: String,
        default: '',
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    yearsOfExperience: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("User", userSchema);