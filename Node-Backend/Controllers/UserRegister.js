const User = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');

const registerUser = async (req, res) => {
    try {
        const {
            name,
            mobileNumber,
            DOB,
            city,
            role,
            password,
            email,
            onBench,
            DOJ
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Validate that onBench is present if role is 'consultant'
        if (role === 'consultant' && typeof onBench === 'undefined') {
            return res.status(400).json({ message: 'onBench is required for consultants.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Construct image path if file was uploaded
        const imageUrl = req.file ? path.join('uploads', req.file.filename) : null;

        const newUser = new User({
            name,
            mobileNumber,
            DOB,
            city,
            role,
            isActive: true,
            password: hashedPassword,
            email,
            onBench: role === 'consultant' ? onBench : undefined,
            imageUrl,
            DOJ
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
