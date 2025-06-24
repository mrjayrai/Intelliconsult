const mongoose = require('mongoose');


const InviteOpportunityScehma = new mongoose.Schema({
userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
},
Opportunity:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity',
    }
]
});

const InviteOpportunity = mongoose.model('InviteOpportunity',InviteOpportunityScehma);

module.exports = InviteOpportunity;
