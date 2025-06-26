const express = require('express');
const router = express.Router();

const {addOpportunity} = require('../controllers/Addopportunity');
const getMatchedOpportunityFromSingleEntry  = require('../controllers/GetMatchedOpportunity');
const { getOpportunitiesByManagerId } = require('../controllers/GetOpportunity');
const { InviteOpportunity } = require('../controllers/SendOpportunity');
const { getUserOpportunities } = require('../controllers/FetchInvite');
const { acceptOpportunityInvite } = require('../controllers/AcceptOpportunity');

router.post('/add-opportunity', addOpportunity);
router.post('/get-matched-opportunity', getMatchedOpportunityFromSingleEntry);
router.post('/get-manager-opportunity',getOpportunitiesByManagerId);
router.post('/send-invite',InviteOpportunity);
router.post('/fetch-invite', getUserOpportunities);
router.post('/accept-opportunity', acceptOpportunityInvite);

module.exports = router;