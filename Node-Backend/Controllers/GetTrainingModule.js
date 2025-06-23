const Training = require('../models/Training');

const getUpcomingTrainings = async (req, res) => {
  try {
    const currentDate = new Date();

    // Find trainings where endDate is in the future
    const trainings = await Training.find({
      endDate: { $gte: currentDate }
    });

    res.status(200).json({
      message: 'Upcoming trainings fetched successfully',
      data: trainings
    });
  } catch (error) {
    console.error('Error fetching trainings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUpcomingTrainings
};
