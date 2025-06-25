const InviteOpportunityModel = require('../models/InviteOpportunity');

const InviteOpportunity = async (req, res) => {
    try {
        const { userId, opportunityId } = req.body;

        if (!userId || !opportunityId) {
            return res.status(400).json({ message: 'userId and opportunityId are required' });
        }

        // Check if the consultant already has an invite document
        let invite = await InviteOpportunityModel.findOne({ userId });

        if (invite) {
            // Check if the opportunity is already invited
            if (!invite.Opportunity.includes(opportunityId)) {
                invite.Opportunity.push(opportunityId);
                await invite.save();
            }
        } else {
            // Create new invite document
            invite = new InviteOpportunityModel({
                userId,
                Opportunity: [opportunityId]
            });
            await invite.save();
        }

        res.status(200).json({ message: 'Opportunity invitation sent successfully', data: invite });

    } catch (error) {
        console.error('Error Sending Invite to Consultant: ', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { InviteOpportunity };
