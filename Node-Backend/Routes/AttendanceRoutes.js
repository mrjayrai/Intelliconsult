const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const { handleAttendanceUpload } = require('../controllers/AttendanceSummary');
const { addAttendance } = require('../controllers/Attendanceadd');

router.post('/add-attendance', addAttendance);

router.post("/upload", upload.single("file"), handleAttendanceUpload);

module.exports = router;