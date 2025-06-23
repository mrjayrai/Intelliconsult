const UserSkillSet = require('../models/UserSkillSet');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getMatchedOpportunityFromSingleEntry = async (req, res) => {
    try {
        const opportunity = req.body;

        // Validate required fields
        const { name, keySkills, postingDate } = opportunity;
        if (!name || !Array.isArray(keySkills) || !postingDate) {
            return res.status(400).json({ message: 'Missing or invalid opportunity fields' });
        }

        // Format the posting date
        const formattedPostingDate = new Date(postingDate);
        if (isNaN(formattedPostingDate.getTime())) {
            return res.status(400).json({ message: 'Invalid postingDate format' });
        }

        // Fetch all user skill sets
        const userSkillSets = await UserSkillSet.find({}, {
            userId: 1,
            skills: 1
        });

        // Format consultants
        const consultants = userSkillSets.map(user => ({
            userId: user.userId.toString(),
            skills: user.skills.map(skill => ({
                name: skill.name,
                yearsOfExperience: skill.yearsOfExperience,
                endorsements: skill.endorsements
            }))
        }));

        // Format single opportunity
        const opportunities = [{
            text: `Opportunity: ${name}. Required Skills: ${keySkills.join(', ')}`,
            date: formattedPostingDate.toISOString().split('T')[0]
        }];

        // Build payload
        const payload = {
            consultants,
            opportunities
        };

        // Send to Flask for matching
        const flaskResponse = await axios.post(`${process.env.flaskserver}api/opportunity/handle`, payload);

        // Return matched consultants from Flask
        res.status(200).json(flaskResponse.data);

    } catch (error) {
        console.error('Error matching opportunity:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getMatchedOpportunityFromSingleEntry;
