const express = require('express');
const router = express.Router();

const { createTraining } = require('../controllers/Training');
const { addCompletedTraining } = require('../controllers/AddTrainingCompleted');
const {assignTraining} = require('../controllers/AssignTraining');

router.post('/add-training', createTraining);
router.post('/add-completed-training', addCompletedTraining);
router.post('/assign-training', assignTraining);

module.exports = router;