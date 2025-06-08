const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/UserRegister');
const { loginUser } = require('../controllers/UserLogin');
const { addResume } = require('../controllers/AddResume');
const upload = require('../middleware/uploads');


router.post('/register',upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);
router.post('/add-resume', upload.single('file'), addResume);

module.exports = router;