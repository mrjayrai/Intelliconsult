const express = require('express');
const router = express.Router();
const { registerUser } = require('../Controllers/UserRegister');
const { loginUser } = require('../Controllers/UserLogin');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;