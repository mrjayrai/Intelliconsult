const mongoose = require('mongoose');

const assignedTrainingSchema = new mongoose.Schema({
  trainingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Training',
    required: true
  },
  assignedDate: {
    type: Date,
    required: true
  },
  completedDate: {
    type: Date // optional
  }
});

const userTrainingAssignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainings: {
    type: [assignedTrainingSchema],
    default: []
  }
}, {
  timestamps: true
});

const TrainingAssignment = mongoose.model('TrainingAssignment', userTrainingAssignmentSchema);

module.exports = TrainingAssignment;
