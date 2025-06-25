const InviteOpportunityModel = require('../models/InviteOpportunity');
const OpportunityModel = require('../models/Opportunity');

const getUserOpportunities = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'userId is required' });
        }

        // Find the user's invited opportunities and populate full opportunity details
        const inviteDoc = await InviteOpportunityModel.findOne({ userId })
            .populate({
                path: 'Opportunity',
                model: 'Opportunity',
                select: '-__v', // optionally exclude internal fields like __v
            });

        if (!inviteDoc || inviteDoc.Opportunity.length === 0) {
            return res.status(404).json({ message: 'No opportunities found for this user' });
        }

        res.status(200).json({
            message: 'User opportunities fetched successfully',
            opportunities: inviteDoc.Opportunity,
        });

    } catch (error) {
        console.error('Error fetching user opportunities:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getUserOpportunities };
