const express = require('express');
const router = express.Router();
const { registerUser } = require('../Controllers/UserRegister');
const { loginUser } = require('../Controllers/UserLogin');
const upload = require('../middleware/uploads');

router.post('/register',upload.single('profilePicture'), registerUser);
router.post('/login', loginUser);

module.exports = router;