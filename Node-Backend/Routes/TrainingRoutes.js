const express = require('express');
const router = express.Router();

const { createTraining } = require('../controllers/Training');
const { addCompletedTraining } = require('../controllers/AddTrainingCompleted');
const {assignTraining} = require('../controllers/AssignTraining');
const {getTrainingScore }= require('../controllers/GetTrainingScore');

router.post('/add-training', createTraining);
router.post('/add-completed-training', addCompletedTraining);
router.post('/assign-training', assignTraining);
router.post('/get-training-score', getTrainingScore);

module.exports = router;