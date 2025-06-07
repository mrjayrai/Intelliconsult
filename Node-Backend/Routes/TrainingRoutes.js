const express = require('express');
const router = express.Router();

const { createTraining } = require('../Controllers/Training');

router.post('/add-training', createTraining);

module.exports = router;