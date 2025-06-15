const express = require('express');
const router = express.Router();

const { addUserSkillSet } = require('../controllers/UserSkillSetFeed');
const { getUserSkills } = require('../controllers/GetSkills');

router.post('/add-skill-set', addUserSkillSet);
router.post('/getskills', getUserSkills);


module.exports = router;