const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['consultant', 'manager'],
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  onBench: {
    type: Boolean,
    required: function () {
      return this.role === 'consultant';
    },
  },
  imageUrl: {
    type: String,
  },
  DOJ: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
