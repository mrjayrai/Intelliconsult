// controllers/trainingController.js

const TrainingRecord = require('../models/Attendance'); // Adjust path to your model

// GET /api/trainings/:userId
const getUserTrainingController = async (req, res) => {
  try {
    const { userId } = req.body;

    // Fetch all training records for the user
    const trainingRecord = await TrainingRecord.findOne({ userId });

    if (!trainingRecord) {
      return res.status(404).json({ message: 'No training records found for the user.' });
    }

    res.status(200).json({ success: true, data: trainingRecord });
  } catch (error) {
    console.error('Error fetching training:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getUserTrainingController,
};
