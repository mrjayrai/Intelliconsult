const Opportunity = require('../models/Opportunity');
const UserSkillSet = require('../models/UserSkillSet');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getMatchedOpportunityf = async (req, res) => {
    try {
        // Fetch opportunities (only required fields)
        const opportunitiesData = await Opportunity.find({}, {
            name: 1,
            keySkills: 1,
            postingDate: 1
        });

        // Fetch user skill sets (only required fields)
        const userSkillSets = await UserSkillSet.find({}, {
            userId: 1,
            skills: 1
        });

        // Transform consultants
        const consultants = userSkillSets.map(user => ({
            userId: user.userId.toString(),
            skills: user.skills.map(skill => ({
                name: skill.name,
                yearsOfExperience: skill.yearsOfExperience,
                endorsements: skill.endorsements
            }))
        }));

        // Transform opportunities
        const opportunities = opportunitiesData.map(op => ({
            text: `Opportunity: ${op.name}. Required Skills: ${op.keySkills.join(', ')}`,
            date: new Date(op.postingDate).toISOString().split('T')[0] // format to YYYY-MM-DD
        }));

        // Final payload to send to Flask
        const payload = {
            consultants,
            opportunities
        };

        // Call Python Flask API
        const flaskResponse = await axios.post(process.env.flaskserver+'api/opportunity/handle', payload);

        // Return response from Flask
        res.status(200).json(flaskResponse.data);

    } catch (error) {
        console.error('Error matching opportunities:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = getMatchedOpportunityf;
