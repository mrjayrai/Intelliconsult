const express = require('express');
const router = express.Router();

const {addOpportunity} = require('../controllers/Addopportunity');

router.post('/add-opportunity', addOpportunity);
router.post('/get-matched-opportunity', require('../controllers/GetMatchedOpportunity'));

module.exports = router;