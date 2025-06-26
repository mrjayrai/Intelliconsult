const TrainingAssignment = require('../models/AssignedTraining');


const getUsersWithTrainingCount = async (req, res) => {
  try {
    const count = await TrainingAssignment.countDocuments({
      trainings: { $exists: true, $not: { $size: 0 } }
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching training assignment count:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getUsersWithTrainingCount };
