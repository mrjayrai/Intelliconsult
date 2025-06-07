const express = require('express');
const router = express.Router();

const { createTraining } = require('../controllers/Training');
const { addCompletedTraining } = require('../controllers/AddTrainingCompleted');

router.post('/add-training', createTraining);
router.post('/add-completed-training', addCompletedTraining);

module.exports = router;