const StudentTrainingCompletion = require('../models/TrainingCompleted');
const UserSkillSet = require('../models/UserSkillSet');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const getTrainingScore = async (req, res) => {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ message: 'userId is required.' });
    }

    // 1. Fetch user skill data
    const userSkillData = await UserSkillSet.findOne({ userId }).lean();
    if (!userSkillData) {
      return res.status(404).json({ message: 'User skills not found.' });
    }

    const skills = userSkillData.skills.map(skill => ({
      name: skill.name,
      yearsOfExperience: skill.yearsOfExperience,
      certification: skill.certification,
      endorsements: skill.endorsements
    }));

    // 2. Extract required skill names
    const requiredSkillNames = userSkillData.skills.map(skill => skill.name);

    // 3. Fetch completed trainings
    const completedTrainingData = await StudentTrainingCompletion.findOne({ userId })
      .populate('trainingsCompleted.trainingId')
      .lean();

    const completedTrainings = completedTrainingData
      ? completedTrainingData.trainingsCompleted.flatMap(tc =>
          tc.trainingId?.skillsToBeAcquired || []
        )
      : [];

    // 4. Convert userId to MongoDB ObjectId format
    const objectIdUserId = { "$oid": userId.toString() };

    // 5. Construct the final payload
    const payload = {
      consultants: [
        {
          userId: objectIdUserId,
          skills
        }
      ],
      required_skills_map: {
        [userId]: requiredSkillNames
      },
      completed_trainings_map: {
        [userId]: completedTrainings
      }
    };

    // Optional: Send to Flask server
    const flaskResponse = await axios.post(process.env.flaskserver + 'api/training/handle', payload);

    return res.status(200).json(flaskResponse.data);

  } catch (error) {
    console.error('Error fetching training score:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTrainingScore
};
