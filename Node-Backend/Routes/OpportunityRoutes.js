const express = require('express');
const router = express.Router();

const {addOpportunity} = require('../controllers/Addopportunity');
const getMatchedOpportunityFromSingleEntry  = require('../controllers/GetMatchedOpportunity');
const { getOpportunitiesByManagerId } = require('../controllers/GetOpportunity');

router.post('/add-opportunity', addOpportunity);
router.post('/get-matched-opportunity', getMatchedOpportunityFromSingleEntry);
router.post('/get-manager-opportunity',getOpportunitiesByManagerId);

module.exports = router;