const User = require('../models/User');

const getAllConsultantsBasicInfo = async (req, res) => {
  try {
    const consultants = await User.find(
      { role: 'consultant' },
      { _id: 1, name: 1, email: 1 }
    );

    res.status(200).json({
      message: 'Consultants fetched successfully',
      count: consultants.length,
      consultants
    });
  } catch (error) {
    console.error('Error fetching consultants:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllConsultantsBasicInfo
};
