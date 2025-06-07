const Training = require('../models/Training');
const User = require('../models/User');

const createTraining = async (req, res) => {
  try {
    const {
      name,
      startDate,
      endDate,
      trainerName,
      noOfSeats,
      eligibilityCriteria,
      prerequisites,
      passingCriteria,
      skillsToBeAcquired,
      managerId // Manager trying to create the training
    } = req.body;

    // Validate required fields
    if (
      !name || !startDate || !endDate || !trainerName || !noOfSeats ||
      !passingCriteria?.minAttendancePercentage || passingCriteria.minMarks == null ||
      !skillsToBeAcquired || !Array.isArray(skillsToBeAcquired) ||
      !managerId
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check startDate < endDate
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    // Validate manager role
    const manager = await User.findById(managerId);
    if (!manager) {
      return res.status(404).json({ message: 'Manager not found' });
    }

    if (manager.role.toLowerCase() !== 'manager') {
      return res.status(403).json({ message: 'Only managers are allowed to create trainings' });
    }

    // Create training
    const newTraining = new Training({
      name,
      startDate,
      endDate,
      trainerName,
      noOfSeats,
      eligibilityCriteria: {
        yearsOfExperience: eligibilityCriteria?.yearsOfExperience || 0,
        mustHaveSkills: eligibilityCriteria?.mustHaveSkills || []
      },
      prerequisites: {
        goodToKnowSkills: prerequisites?.goodToKnowSkills || []
      },
      passingCriteria,
      skillsToBeAcquired
    });

    await newTraining.save();

    res.status(201).json({
      message: 'Training created successfully',
      data: newTraining
    });

  } catch (error) {
    console.error('Error creating training:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTraining
};
