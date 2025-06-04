const mongoose = require('mongoose');

const attendanceEntrySchema = new mongoose.Schema({
  weekNo: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  totalDaysInWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 7,
  },
  daysPresent: {
    type: [String], // e.g., ["Monday", "Tuesday"]
    required: true,
    validate: [arr => arr.length <= 7, 'A week has at most 7 days'],
  },
  trainingAttended: {
    type: String, // e.g., "Java Backend Training"
    default: null,
  },
  trainingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Training', // if you have a Training schema
    default: null,
  }
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  attendanceSheet: {
    type: [attendanceEntrySchema],
    default: [],
  }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
