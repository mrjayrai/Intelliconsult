const AcceptOpportunity = require('../models/AcceptOpportunity');
const Opportunity = require('../models/Opportunity');
const mongoose = require('mongoose');

const getAcceptedOpportunities = async (req, res) => {
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  try {
    const accepted = await AcceptOpportunity.find({ userID: userId }).populate('Opportunity');

    const formatted = accepted.map((entry) => ({
      _id: entry._id,
      opportunityId: entry.Opportunity._id,
      name: entry.Opportunity.name,
      keySkills: entry.Opportunity.keySkills,
      yearsOfExperience: entry.Opportunity.yearsOfExperience,
      postingDate: entry.Opportunity.postingDate,
      lastDateToApply: entry.Opportunity.lastDateToApply,
      hiringManagerName: entry.Opportunity.hiringManagerName,
      numberOfOpenings: entry.Opportunity.numberOfOpenings,
    }));

    res.status(200).json({ message: 'Accepted opportunities fetched successfully', opportunities: formatted });
  } catch (error) {
    console.error('Error fetching accepted opportunities:', error);
    res.status(500).json({ message: 'Server error while fetching accepted opportunities' });
  }
};

module.exports = {
  getAcceptedOpportunities,
};
