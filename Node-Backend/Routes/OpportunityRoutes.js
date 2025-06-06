const express = require('express');
const router = express.Router();

const {addOpportunity} = require('../controllers/Addopportunity');

router.post('/add-opportunity', addOpportunity);

module.exports = router;