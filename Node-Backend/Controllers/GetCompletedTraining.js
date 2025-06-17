const completedTrainingSchema = require('../models/TrainingCompleted');

const getCompletedTraining = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const completedTraining = await completedTrainingSchema
      .findOne({ userId })
      .populate('trainingsCompleted.trainingId'); // Correct path

    if (!completedTraining) {
      return res.status(404).json({ message: 'No completed training found for this user.' });
    }

    res.status(200).json({ success: true, data: completedTraining });
  } catch (error) {
    console.error('Error fetching Completed training:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getCompletedTraining };
