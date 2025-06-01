//To be submitted by Developers
const mongoose = require("mongoose");

const dataFeedSchema = new mongoose.Schema(
    {
        submittedBy:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content:
        {
            type: String,
            required: true
        },
        metadata: 
        {
            type: Object,//to hold dynamic file type, source etc.
            default: {}
        },
        status: {
            type: String,
            enum: ["Pending", "Sorted", "Processed"],
            default: "Pending"
        },
        tags: {
            type: [String],
            default: []
        },
        submittedAt: {
            type: Date,
            default: Date.now
        }
    }
);
module.exports = mongoose.model("DataFeed", dataFeedSchema);
