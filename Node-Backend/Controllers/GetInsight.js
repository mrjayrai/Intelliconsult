const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require("mongoose");

dotenv.config();

const User = require("../models/User");
const Attendance = require("../models/Attendance");
const TrainingCompleted = require("../models/TrainingCompleted");
const OpportunityAccepted = require("../models/AcceptOpportunity");
const OpportunityInvite = require("../models/InviteOpportunity");
const TrainingAssigned = require("../models/AssignedTraining");
const ResumeTracker = require("../models/UserResumeTracker");
const UserSkillset = require("../models/UserSkillSet");

const getConsultantInsights = async (req, res) => {
  try {
    const users = await User.find({ role: "consultant" });

    const insights = await Promise.all(users.map(async (user) => {
      const userId = user._id;

      const [
        attendance,
        completedTrainings,
        acceptedOpportunities,
        invitedOpportunities,
        trainingAssignments,
        resume,
        skills
      ] = await Promise.all([
        Attendance.findOne({ userId }),
        TrainingCompleted.findOne({ userId }),
        OpportunityAccepted.find({ userID: userId }),
        OpportunityInvite.findOne({ userId }),
        TrainingAssigned.findOne({ userId }),
        ResumeTracker.findOne({ userId }),
        UserSkillset.findOne({ userId })
      ]);

      return {
        userId: userId.toString(),
        name: user.name,
        email: user.email,
        city: user.city,
        onBench: user.onBench,
        imageUrl: user.imageUrl,
        doj: user.DOJ,
        attendanceSheet: attendance?.attendanceSheet || [],
        trainingsCompleted: completedTrainings?.trainingsCompleted || [],
        opportunityAccepted: acceptedOpportunities.map(op => op.Opportunity.toString()),
        opportunityInvited: invitedOpportunities?.Opportunity.map(oid => oid.toString()) || [],
        trainingsAssigned: trainingAssignments?.trainings || [],
        resumeDetails: {
          path: resume?.resumePath || null,
          skills: resume?.skills || [],
          status: resume?.status || null,
          updatedDate: resume?.updatedDate || null
        },
        skills: skills?.skills || [],
        projects: skills?.projects || []
      };
    }));

    // 🔁 Send consultants data to Python server
    const pythonResponse = await axios.post(process.env.flaskserver + '/api/attendance/analyze', {
      consultants: insights
    });

    // ✅ Return Python's response
    return res.status(200).json({
      status: "success",
      analysis: pythonResponse.data
    });

  } catch (error) {
    console.error("Error fetching consultant data:", error.message);
    return res.status(500).json({
      status: "failure",
      error: error.message
    });
  }
};

module.exports = { getConsultantInsights };