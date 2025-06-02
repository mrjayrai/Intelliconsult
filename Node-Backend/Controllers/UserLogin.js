const bcrypt = require('bcryptjs');
const User = require('../models/User');


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Return user data excluding password
        const { password: _, ...userData } = user.toObject();
        res.status(200).json({ message: 'Login successful.', user: userData });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
module.exports = {
    loginUser,
};