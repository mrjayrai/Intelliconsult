const TrainingAssignment = require('../models/AssignedTraining');

const assignTraining = async (req, res) => {
  try {
    const { userId, trainingId, assignedDate } = req.body;

    // Validate required fields
    if (!userId || !trainingId || !assignedDate) {
      return res.status(400).json({
        message: 'userId, trainingId, and assignedDate are required.'
      });
    }

    // Check if record exists for the user
    let userAssignment = await TrainingAssignment.findOne({ userId });

    const newTraining = {
      trainingId,
      assignedDate
    };

    if (userAssignment) {
      // Check if training is already assigned to avoid duplication
      const alreadyAssigned = userAssignment.trainings.some(
        t => t.trainingId.toString() === trainingId
      );

      if (alreadyAssigned) {
        return res.status(400).json({
          message: 'This training is already assigned to the user.'
        });
      }

      // Add to existing assignments
      userAssignment.trainings.push(newTraining);
    } else {
      // Create a new assignment record
      userAssignment = new TrainingAssignment({
        userId,
        trainings: [newTraining]
      });
    }

    await userAssignment.save();
    res.status(201).json({
      message: 'Training assigned successfully.',
      data: userAssignment
    });

  } catch (error) {
    console.error('Error assigning training:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  assignTraining
};
