const Attendance = require('../models/Attendance');
const TrainingAssignment = require('../models/AssignedTraining');

const getMonthlyTrainingHoursForUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const hoursPerDay = 9;
    const monthHours = Array(12).fill(0); // Jan to Dec

    const assignment = await TrainingAssignment.findOne({ userId });
    if (!assignment || assignment.trainings.length === 0) {
      return res.status(404).json({ message: 'No trainings assigned to this user.' });
    }

    const assignedTrainingIds = assignment.trainings.map(t => t.trainingId.toString());
    const attendanceData = await Attendance.findOne({ userId });

    if (!attendanceData || attendanceData.attendanceSheet.length === 0) {
      return res.status(404).json({ message: 'No attendance data found for user.' });
    }

    for (const entry of attendanceData.attendanceSheet) {
      const trainingId = entry.trainingId?.toString();

      if (!assignedTrainingIds.includes(trainingId)) continue;

      for (const rawDay of entry.daysPresent) {
        const date = new Date(rawDay);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid date detected: ${rawDay}`);
          continue;
        }

        const monthIndex = date.getMonth(); // 0 = Jan, 11 = Dec
        monthHours[monthIndex] += hoursPerDay;
      }
    }

    return res.status(200).json({ userId, monthlyHours: monthHours });
  } catch (error) {
    console.error("Error in monthly hours controller:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getMonthlyTrainingHoursForUser };
