const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

const addOpportunity = async (req, res) => {
  try {
    const {
      name,
      keySkills,
      yearsOfExperience,
      postingDate,
      lastDateToApply,
      numberOfOpenings,
      hiringManagerId
    } = req.body;

    if (
      !name || !keySkills || !yearsOfExperience || !lastDateToApply ||
      !numberOfOpenings || !hiringManagerId
    ) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Validate manager exists and has role "manager"
    const manager = await User.findById(hiringManagerId);
    if (!manager) {
      return res.status(404).json({ message: 'Hiring manager not found' });
    }

    if (manager.role.toLowerCase() !== 'manager') {
      return res.status(403).json({ message: 'Only managers can create opportunities' });
    }

    const newOpportunity = new Opportunity({
      name,
      keySkills,
      yearsOfExperience,
      postingDate: postingDate || new Date(),
      lastDateToApply,
      numberOfOpenings,
      hiringManagerName: manager.name,
      hiringManagerId: manager._id
    });

    await newOpportunity.save();

    res.status(201).json({
      message: 'Opportunity created successfully',
      data: newOpportunity
    });

  } catch (error) {
    console.error('Error creating opportunity:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  addOpportunity
};
