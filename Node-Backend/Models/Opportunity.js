const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  keySkills: {
    type: [String],
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0,
  },
  postingDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  lastDateToApply: {
    type: Date,
    required: true,
  },
  hiringManagerName: {
    type: String,
    required: true,
  },
  hiringManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  numberOfOpenings: {
    type: Number,
    required: true,
    min: 1,
  },
}, { timestamps: true });

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

module.exports = Opportunity;
