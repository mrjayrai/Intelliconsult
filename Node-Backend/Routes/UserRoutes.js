const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/UserRegister');
const { loginUser } = require('../controllers/UserLogin');
const { addResume } = require('../controllers/AddResume');
const { getTotalTrainingHoursForUser } = require('../controllers/GetTrainingHours');
const { getMonthlyTrainingHoursForUser } = require('../controllers/GetMonthlyhours');
const { getAllConsultantsBasicInfo } = require('../controllers/GetConsultantDetails');
const { updateUserProfile } = require('../controllers/UpdateUserDetails');
const { getConsultantCount } = require('../controllers/GetConsultantCount');
const { getUsersWithTrainingCount } = require('../controllers/GetConsultantAssigned');
const { getMonthlyTrainingHoursForAllUsers } = require('../controllers/MonthlyHoursConsolidated');
const upload = require('../middleware/uploads');


router.post('/register',upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);
router.post('/add-resume', upload.single('file'), addResume);
router.post('/get-training-hours',getTotalTrainingHoursForUser);
router.post('/get-monthly-training-hours',getMonthlyTrainingHoursForUser);
router.post('/get-consultant',getAllConsultantsBasicInfo);
router.post('/update-user',updateUserProfile);
router.post('/get-consultant-count',getConsultantCount);
router.post('/get-consultant-enaged',getUsersWithTrainingCount);
router.post('/get-monthly-hours',getMonthlyTrainingHoursForAllUsers);
module.exports = router;