const Opportunity = require('../models/Opportunity'); // Adjust path as needed
const mongoose = require('mongoose');

const getOpportunitiesByManagerId = async (req, res) => {
  try {
    const { managerId } = req.body;

    if (!managerId || !mongoose.Types.ObjectId.isValid(managerId)) {
      return res.status(400).json({ message: 'Invalid or missing manager ID' });
    }

    const opportunities = await Opportunity.find({ hiringManagerId: managerId }).sort({ postingDate: -1 });

    return res.status(200).json({
      message: 'Opportunities fetched successfully',
      count: opportunities.length,
      opportunities,
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getOpportunitiesByManagerId,
};
