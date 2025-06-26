const User = require('../models/User'); 


const getConsultantCount = async (req, res) => {
  try {
    const consultantCount = await User.countDocuments({ role: 'consultant' });
    res.status(200).json({ count: consultantCount });
  } catch (error) {
    console.error('Error fetching consultant count:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getConsultantCount };
