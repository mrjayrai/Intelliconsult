const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0,
  },
  certification: {
    type: String,
    default: null,
  },
  endorsements: {
    type: Number,
    default: 1,
  }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  githubUrl: {
    type: String,
    required: true,
  },
  projectInfo: {
    type: String,
    required: true,
  },
  skillsUsed: {
    type: [String],
    required: true,
  },
  timeConsumedInDays: {
    type: Number,
    required: true,
    min: 1,
  }
}, { _id: false });

const userSkillSetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, 
  },
  skills: [skillSchema],
  projects: [projectSchema],
}, { timestamps: true });

const UserSkillSet = mongoose.model('UserSkillSet', userSkillSetSchema);

module.exports = UserSkillSet;
