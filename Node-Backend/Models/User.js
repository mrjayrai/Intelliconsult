const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        passwordHash: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["Developer", "Manager"],
            required: true
        },
        location: {
            type: String,
            default: "Unknown"
        },
        experience:
        {
            type: Number,
            default: 0
        },
        skills: {
            type: [String],
            default: []
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);
module.exports = mongoose.model("User", userSchema);
