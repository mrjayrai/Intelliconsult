const mongoose = require('mongoose');
const userResumeTrackerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumePath: {
    type: String,
    required: true
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['new', 'updated'],
    default: 'new'
  },
  skills:[{
    type: String,
    required: true
  }]
}, {
  timestamps: true
});


const UserResumeTracker = mongoose.model('UserResumeTracker', userResumeTrackerSchema);
module.exports = UserResumeTracker;