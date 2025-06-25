const UserSkillSet = require('../models/UserSkillSet');
const User = require('../models/User'); 
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getMatchedOpportunityFromSingleEntry = async (req, res) => {
  try {
    const opportunity = req.body;
    const { name, keySkills, postingDate } = opportunity;

    if (!name || !Array.isArray(keySkills) || !postingDate) {
      return res.status(400).json({ message: 'Missing or invalid opportunity fields' });
    }

    const formattedPostingDate = new Date(postingDate);
    if (isNaN(formattedPostingDate.getTime())) {
      return res.status(400).json({ message: 'Invalid postingDate format' });
    }

    // 1. Get all user skill sets
    const userSkillSets = await UserSkillSet.find({}, { userId: 1, skills: 1 });

    // 2. Format consultants for ML input
    const consultants = userSkillSets.map(user => ({
      userId: user.userId.toString(),
      skills: user.skills.map(skill => ({
        name: skill.name,
        yearsOfExperience: skill.yearsOfExperience,
        endorsements: skill.endorsements
      }))
    }));

    // 3. Build payload for ML
    const opportunities = [{
      text: `Opportunity: ${name}. Required Skills: ${keySkills.join(', ')}`,
      date: formattedPostingDate.toISOString().split('T')[0]
    }];

    const payload = { consultants, opportunities };

    // 4. Call Flask ML service
    const flaskResponse = await axios.post(`${process.env.flaskserver}api/opportunity/handle`, payload);
    const flaskData = flaskResponse.data;

    // 5. Filter consultants who matched at least one opportunity
    const matchedConsultants = flaskData.consultant_matches.filter(c => c.matched_opportunities.length > 0);

    // 6. Fetch user details for matched consultants
    const userIds = matchedConsultants.map(c => c.userId);
    const users = await User.find({ _id: { $in: userIds } }, { name: 1, email: 1 }); // Customize projection

    // 7. Merge user details into matched consultant list
    const enrichedConsultants = matchedConsultants.map(c => {
      const user = users.find(u => u._id.toString() === c.userId);
      return {
        userId: c.userId,
        name: user?.name || 'Unknown',
        email: user?.email || '',
        matched_opportunities: c.matched_opportunities
      };
    });

    // 8. Return clean response
    return res.status(200).json({
      status: 'success',
      clustered_opportunities: flaskData.clustered_opportunities,
      consultant_matches: enrichedConsultants
    });

  } catch (error) {
    console.error('Error matching opportunity:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = getMatchedOpportunityFromSingleEntry;
