const assignedTrainingSchema = require('../models/AssignedTraining');
const StudentTrainingCompletion = require('../models/TrainingCompleted');

const getAssignedTraining = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Fetch all assigned trainings
    const assignedTraining = await assignedTrainingSchema
      .findOne({ userId })
      .populate('trainings.trainingId');

    if (!assignedTraining) {
      return res.status(404).json({ message: 'No assigned training found for this user.' });
    }

    // Fetch completed training IDs
    const completedRecord = await StudentTrainingCompletion.findOne({ userId });
    const completedTrainingIds = completedRecord
      ? completedRecord.trainingsCompleted.map(t => t.trainingId.toString())
      : [];

    // Filter out completed trainings
    const pendingTrainings = assignedTraining.trainings.filter(t =>
      !completedTrainingIds.includes(t.trainingId?._id?.toString())
    );

    res.status(200).json({ success: true, data: { userId, trainings: pendingTrainings } });
  } catch (error) {
    console.error('Error fetching assigned training:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAssignedTraining };
