const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const dotenv = require('dotenv');

dotenv.config();

// Controller function to handle file upload and forward to Flask
const handleAttendanceUpload = async (req, res) => {
  try {
    // Ensure a file is present
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const filePath = req.file.path;

    // Create form-data and append file
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));

    // Make request to Flask API
    const flaskResponse = await axios.post(
      process.env.flaskserver+"api/attendance/upload", // <-- update if Flask runs on another host/port
      form,
      {
        headers: form.getHeaders(),
        timeout: 120000 // 2 minutes timeout
      }
    );

    // Clean up uploaded file after forwarding
    fs.unlinkSync(filePath);

    // Return Flask API response to frontend
    return res.status(200).json(flaskResponse.data);
  } catch (error) {
    return res.status(500).json({
      error: error.message || "Something went wrong while processing the file.",
      details: error.response?.data || null
    });
  }
};

module.exports = { handleAttendanceUpload };
