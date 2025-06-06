const express = require('express');
const router = express.Router();

const { createTraining } = require('../controllers/Training');

router.post('/add-training', createTraining);

module.exports = router;