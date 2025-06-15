const skillSchema = require('../models/UserSkillSet');

const getUserSkills = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    const skillSet = await skillSchema.findOne(
      { userId },
      { skills: 1, projects: 1, _id: 0 } // 👈 only return skills and projects
    );

    if (!skillSet) {
      return res.status(404).json({ message: 'No Skills found for this user.' });
    }

    res.status(200).json({ success: true, data: skillSet });
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getUserSkills };
