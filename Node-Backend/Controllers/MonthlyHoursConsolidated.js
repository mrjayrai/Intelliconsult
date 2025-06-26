const Attendance = require('../models/Attendance');
const TrainingAssignment = require('../models/AssignedTraining');

const getAllUsersMonthlyHours = async (req, res) => {
  try {
    const hoursPerDay = 9;
    const monthlyHours = Array(12).fill(0); // Jan to Dec

    const allAssignments = await TrainingAssignment.find({});

    const allAttendance = await Attendance.find({});

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
      const ISOweekStart = simple;
      if (dow <= 4) {
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
      } else {
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
      }
      ISOweekStart.setDate(ISOweekStart.getDate() + weekday - 1);
      return new Date(ISOweekStart);
    };

    const assignmentMap = new Map();
    for (const assignment of allAssignments) {
      assignmentMap.set(
        assignment.userId.toString(),
        assignment.trainings.map(t => t.trainingId.toString())
      );
    }

    for (const attendance of allAttendance) {
      const userId = attendance.userId.toString();
      const assignedTrainings = assignmentMap.get(userId) || [];

      for (const entry of attendance.attendanceSheet) {
        const trainingId = entry.trainingId?.toString();
        if (!assignedTrainings.includes(trainingId)) continue;

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
          monthlyHours[monthIndex] += hoursPerDay;
        }
      }
    }

    return res.status(200).json({
      monthlyHours,
    });
  } catch (error) {
    console.error("Error calculating monthly training hours:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllUsersMonthlyHours,
};
