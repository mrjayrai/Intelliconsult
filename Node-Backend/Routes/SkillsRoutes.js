const express = require('express');
const router = express.Router();

const { addUserSkillSet } = require('../controllers/UserSkillSetFeed');

router.post('/add-skill-set', addUserSkillSet);

module.exports = router;