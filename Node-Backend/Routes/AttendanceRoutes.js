const express = require('express');
const router = express.Router();

const { addAttendance } = require('../Controllers/Attendanceadd');

router.post('/add-attendance', addAttendance);

module.exports = router;