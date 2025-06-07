const express = require('express');
const router = express.Router();

const {addOpportunity} = require('../Controllers/Addopportunity');
const { getMatchedOpportunity } = require('../Controllers/GetMatchedOpportunity');

router.post('/add-opportunity', addOpportunity);
router.post('/get-matched-opportunity', getMatchedOpportunity);

module.exports = router;