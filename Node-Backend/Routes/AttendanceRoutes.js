const express = require('express');
const router = express.Router();

const { addAttendance } = require('../controllers/Attendanceadd');

router.post('/add-attendance', addAttendance);

module.exports = router;