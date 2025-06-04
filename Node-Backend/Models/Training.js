const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  trainerName: {
    type: String,
    required: true
  },
  noOfSeats: {
    type: Number,
    required: true,
    min: 1
  },
  noOfPeopleEnrolled: {
    type: Number,
    default: 0,
    min: 0
  },
  eligibilityCriteria: {
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0
    },
    mustHaveSkills: {
      type: [String],
      default: []
    }
  },
  prerequisites: {
    goodToKnowSkills: {
      type: [String],
      default: []
    }
  },
  passingCriteria: {
    minAttendancePercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    minMarks: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  skillsToBeAcquired: {
    type: [String],
    required: true
  }
}, {
  timestamps: true
});

const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;
