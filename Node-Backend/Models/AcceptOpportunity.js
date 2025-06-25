const mongoose = require('mongoose');

const AcceptedOpportunitySchema = new mongoose.Schema({
userID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
},
Opportunity:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity',
    },
});

const AcceptOpportunity = mongoose.model('AcceptOpportunity',AcceptedOpportunitySchema);

module.exports = AcceptOpportunity;

