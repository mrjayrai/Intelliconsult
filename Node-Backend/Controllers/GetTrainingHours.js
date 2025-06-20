const Attendance = require('../models/Attendance');
const Training = require('../models/Training');
const TrainingAssignment = require('../models/AssignedTraining'); // your training assignment model

const getTotalTrainingHoursForUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const hoursPerDay = 3;

    // 1. Fetch assigned trainings for user
    const assignment = await TrainingAssignment.findOne({ userId });

    if (!assignment || assignment.trainings.length === 0) {
      return res.status(404).json({ message: 'No trainings assigned to this user.' });
    }

    const assignedTrainingIds = assignment.trainings.map(t => t.trainingId.toString());

    // 2. Fetch attendance data
    const attendanceData = await Attendance.findOne({ userId });

    if (!attendanceData || attendanceData.attendanceSheet.length === 0) {
      return res.status(404).json({ message: 'No attendance data found for user.' });
    }

    // 3. Calculate hours for assigned trainings only
    const trainingHoursMap = {};

    for (const entry of attendanceData.attendanceSheet) {
      const trainingId = entry.trainingId?.toString();
      if (assignedTrainingIds.includes(trainingId)) {
        const hours = entry.daysPresent.length * hoursPerDay;
        trainingHoursMap[trainingId] = (trainingHoursMap[trainingId] || 0) + hours;
      }
    }

    // 4. Fetch training names
    const trainings = await Training.find({ _id: { $in: Object.keys(trainingHoursMap) } });

    const result = trainings.map(training => ({
      trainingId: training._id,
      trainingName: training.name,
      hoursAttended: trainingHoursMap[training._id.toString()] || 0
    }));

    // 5. Total hours
    const totalHours = result.reduce((sum, t) => sum + t.hoursAttended, 0);

    return res.status(200).json({
      userId,
      totalHours,
      trainings: result
    });

  } catch (error) {
    console.error("Error fetching training hours:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getTotalTrainingHoursForUser };
