const AcceptOpportunity = require('../models/AcceptOpportunity');
const InviteOpportunity = require('../models/InviteOpportunity');
const mongoose = require('mongoose');

const acceptOpportunityInvite = async (req, res) => {
  const { userId, opportunityId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(opportunityId)) {
    return res.status(400).json({ message: 'Invalid userId or opportunityId' });
  }

  try {
    // 1. Add to AcceptOpportunity collection
    const alreadyAccepted = await AcceptOpportunity.findOne({ userID: userId, Opportunity: opportunityId });

    if (!alreadyAccepted) {
      const accepted = new AcceptOpportunity({
        userID: userId,
        Opportunity: opportunityId,
      });

      await accepted.save();
    }

    // 2. Remove from InviteOpportunity's Opportunity array
    await InviteOpportunity.updateOne(
      { userId },
      { $pull: { Opportunity: opportunityId } }
    );

    return res.status(200).json({ message: 'Opportunity accepted successfully' });
  } catch (error) {
    console.error('Error accepting opportunity:', error);
    return res.status(500).json({ message: 'Server error while accepting opportunity' });
  }
};

module.exports = {
  acceptOpportunityInvite,
};
