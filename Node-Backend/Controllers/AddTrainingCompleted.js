const StudentTrainingCompletion = require('../models/TrainingCompleted');

// Controller to add a completed training for a student
const addCompletedTraining = async (req, res) => {
  try {
    const { userId, trainingId, completedDate, score, certificateUrl, feedback } = req.body;

    // Validate required fields
    if (!userId || !trainingId || !completedDate || score === undefined) {
      return res.status(400).json({ message: 'userId, trainingId, completedDate, and score are required.' });
    }

    // Check if a record for this user already exists
    let studentRecord = await StudentTrainingCompletion.findOne({ userId });

    const newTrainingEntry = {
      trainingId,
      completedDate,
      score,
      certificateUrl,
      feedback
    };

    if (studentRecord) {
      // Append the new training to existing user's record
      studentRecord.trainingsCompleted.push(newTrainingEntry);
    } else {
      // Create a new record for the student
      studentRecord = new StudentTrainingCompletion({
        userId,
        trainingsCompleted: [newTrainingEntry]
      });
    }

    await studentRecord.save();
    res.status(201).json({ message: 'Training completion recorded successfully.', data: studentRecord });

  } catch (error) {
    console.error('Error adding completed training:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addCompletedTraining
};
