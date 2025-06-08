const path = require('path');
const axios = require('axios');
const fs = require('fs');
const FormData = require("form-data");
const UserResumeTracker = require('../models/UserResumeTracker');
const UserSkillSet = require('../models/UserSkillSet'); // Assuming this model is already created
const dotenv = require('dotenv');

dotenv.config();

const addResume = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!req.file || !userId) {
      return res.status(400).json({ message: 'User ID and resume file are required.' });
    }

    const resumePath = req.file.path;

    // Prepare form data to send resume file to Flask server
    const formData = new FormData();
    formData.append('file', fs.createReadStream(resumePath));

    // Post resume file to Flask server
    const flaskResponse = await axios.post(
      process.env.flaskserver + 'api/resume/add',
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    // Extract simple skills array from Flask response
    const extractedSkills = flaskResponse.data.skills;

    // Convert each skill name into detailed skill object with default values
    const structuredSkills = extractedSkills.map(skill => ({
      name: skill,
      yearsOfExperience: 0,
      certification: "",
      endorsements: 0
    }));

    // Save resume info to UserResumeTracker collection
    const newResume = new UserResumeTracker({
      userId,
      resumePath,
      skills: extractedSkills,  // or structuredSkills if you prefer
      status: 'new'
    });

    await newResume.save();

    // Update or insert the detailed skills in UserSkillSet collection
    await UserSkillSet.findOneAndUpdate(
      { userId },
      { $set: { skills: structuredSkills } },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: 'Resume uploaded and skills updated successfully',
      resume: newResume
    });

  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { addResume };
