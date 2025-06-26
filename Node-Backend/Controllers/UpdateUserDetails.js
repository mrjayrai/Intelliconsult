const User = require('../models/User');


const updateUserProfile = async (req, res) => {
  const { userId, name, email, mobileNumber } = req.body;

  if (!userId || !name || !email || !mobileNumber) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, mobileNumber },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({
      message: 'User profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { updateUserProfile };
