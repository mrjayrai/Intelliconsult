const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploads');
const { handleAttendanceUpload } = require('../controllers/AttendanceSummary');
const { addAttendance } = require('../controllers/Attendanceadd');
const { getUserTrainingController } = require('../controllers/GetAttendancedetails');

router.post('/add-attendance', addAttendance);
router.post('/get-attendance',getUserTrainingController);

router.post("/upload", upload.single("file"), handleAttendanceUpload);

module.exports = router;