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

    // Weekday mapping (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const weekdayMap = {
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
      Sunday: 0,
    };

    // Utility to get the date of the Nth weekday of a year and week number
    const getDateFromWeek = (week, year, weekday) => {
      const simple = new Date(year, 0, 1 + (week - 1) * 7);
      const dow = simple.getDay(); // 0 (Sun) - 6 (Sat)
      const ISOweekStart = simple;
      if (dow <= 4) {
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
      } else {
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
      }
      ISOweekStart.setDate(ISOweekStart.getDate() + weekday - 1);
      return new Date(ISOweekStart);
    };

    for (const entry of attendanceData.attendanceSheet) {
      const trainingId = entry.trainingId?.toString();
      if (!assignedTrainingIds.includes(trainingId)) continue;

      for (const rawDay of entry.daysPresent) {
        let date;

        if (rawDay.includes('-')) {
          date = new Date(rawDay);
        } else if (weekdayMap[rawDay] !== undefined) {
          date = getDateFromWeek(entry.weekNo, entry.year, weekdayMap[rawDay]);
        } else {
          continue; // Skip unrecognized day formats
        }

        if (isNaN(date.getTime())) continue;

        const monthIndex = date.getMonth(); // 0 = Jan
        monthHours[monthIndex] += hoursPerDay;
      }
    }

    return res.status(200).json({
      userId,
      monthlyHours: monthHours,
    });
  } catch (error) {
    console.error("Error in monthly hours controller:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getMonthlyTrainingHoursForUser };
