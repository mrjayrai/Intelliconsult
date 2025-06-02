const User = require('../models/User'); 
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    try {
        const {
            email,
            password,
            Domain,
            role,
            skills,
            totalworkingDays,
            attendedDays,
            city,
            state,
            country,
            profilePicture,
            yearsOfExperience
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

     
        const newUser = new User({
            email,
            password: hashedPassword,
            Domain,
            role,
            skills,
            totalworkingDays,
            attendedDays,
            city,
            state,
            country,
            profilePicture,
            yearsOfExperience
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully.', userId: newUser._id });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    registerUser,
};
