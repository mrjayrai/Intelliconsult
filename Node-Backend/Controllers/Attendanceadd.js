const attendanceModel = require('../models/Attendance');

const addAttendance = async (req, res) => {
  try {
    const { userId, attendanceEntry } = req.body;

    if (!userId || !attendanceEntry) {
      return res.status(400).json({ message: 'userId and attendanceEntry are required' });
    }

    let attendanceDoc = await attendanceModel.findOne({ userId });

    if (!attendanceDoc) {
      // If no document exists for user, create one
      attendanceDoc = new attendanceModel({
        userId,
        attendanceSheet: [attendanceEntry]
      });
    } else {
      // Otherwise, push new entry to the sheet
      attendanceDoc.attendanceSheet.push(attendanceEntry);
    }

    await attendanceDoc.save();
    res.status(200).json({ message: 'Attendance saved successfully', data: attendanceDoc });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

module.exports = { addAttendance };
