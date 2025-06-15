const assignedTrainingSchema = require('../models/AssignedTraining');

const getAssignedTraining = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const assignedTraining = await assignedTrainingSchema
      .findOne({ userId })
      .populate('trainings.trainingId'); // 👈 This is key

    if (!assignedTraining) {
      return res.status(404).json({ message: 'No assigned training found for this user.' });
    }

    res.status(200).json({ success: true, data: assignedTraining });
  } catch (error) {
    console.error('Error fetching assigned training:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAssignedTraining };
