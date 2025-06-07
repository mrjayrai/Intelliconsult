const express = require('express');
const router = express.Router();

const {addOpportunity} = require('../controllers/Addopportunity');
const getMatchedOpportunityf  = require('../controllers/GetMatchedOpportunity');

router.post('/add-opportunity', addOpportunity);
router.post('/get-matched-opportunity', getMatchedOpportunityf);

module.exports = router;