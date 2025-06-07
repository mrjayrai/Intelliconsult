const mongoose = require('mongoose');

const completedTrainingSchema = new mongoose.Schema({
  trainingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Training',
    required: true
  },
  completedDate: {
    type: Date,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  certificateUrl: {
    type: String // Optional, if you provide certificates
  },
  feedback: {
    type: String // Optional, feedback from student
  }
});

const studentTrainingCompletionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // assuming there's a User model
    required: true
  },
  trainingsCompleted: {
    type: [completedTrainingSchema],
    default: []
  }
}, {
  timestamps: true
});

const StudentTrainingCompletion = mongoose.model('StudentTrainingCompletion', studentTrainingCompletionSchema);

module.exports = StudentTrainingCompletion;
