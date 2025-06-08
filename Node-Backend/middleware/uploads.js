const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists or create it
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, uniqueName);
  }
});

// Updated file filter to allow images, CSV, and resumes (PDF, DOC, DOCX)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|csv|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype.toLowerCase());

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, CSV, PDF, DOC, and DOCX files are allowed'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
