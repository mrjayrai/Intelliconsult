const express = require('express');
const router = express.Router();
const { registerUser } = require('../controllers/UserRegister');
const { loginUser } = require('../controllers/UserLogin');
const upload = require('../middleware/uploads');

router.post('/register',upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);

module.exports = router;