const Attendance = require('../models/Attendance');
const TrainingAssignment = require('../models/AssignedTraining');
const User = require('../models/User');

const getMonthlyTrainingHoursForAllUsers = async (req, res) => {
  try {
    const hoursPerDay = 9;
    const monthHoursMap = {}; // userId -> [12 months]

    // Get all consultants
    const consultants = await User.find({ role: 'consultant' });

    for (const user of consultants) {
      const userId = user._id.toString();
      const monthHours = Array(12).fill(0); // Jan–Dec

      const assignment = await TrainingAssignment.findOne({ userId });
      if (!assignment || assignment.trainings.length === 0) {
        monthHoursMap[userId] = monthHours;
        continue;
      }

      const assignedTrainingIds = assignment.trainings.map(t => t.trainingId.toString());

      const attendanceData = await Attendance.findOne({ userId });
      if (!attendanceData || attendanceData.attendanceSheet.length === 0) {
        monthHoursMap[userId] = monthHours;
        continue;
      }

      const weekdayMap = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 0,
      };

      const getDateFromWeek = (week, year, weekday) => {
        const simple = new Date(year, 0, 1 + (week - 1) * 7);
        const dow = simple.getDay();
        const ISOweekStart = new Date(simple);
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
            continue;
          }

          if (isNaN(date.getTime())) continue;

          const monthIndex = date.getMonth();
          monthHours[monthIndex] += hoursPerDay;
        }
      }

      monthHoursMap[userId] = monthHours;
    }

    return res.status(200).json({
      monthlyHoursMap: monthHoursMap, // { userId1: [12], userId2: [12], ... }
    });
  } catch (error) {
    console.error("Error in getMonthlyTrainingHoursForAllUsers:", error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getMonthlyTrainingHoursForAllUsers };
