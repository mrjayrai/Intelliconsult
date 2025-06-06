const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('./config/db');
const UserSchema = require('./models/User');
const AttendanceSchema = require('./models/Attendance');
const TrainingSchema = require('./models/Training');
const OpportunitySchema = require('./models/Opportunity');
const UserSkillSchema = require('./models/UserSkillSet');
const userRoutes = require('./routes/UserRoutes');
const skillRoutes = require('./routes/SkillsRoutes');
const AttendanceRoutes = require('./routes/AttendanceRoutes');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/users',userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/attendance', AttendanceRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('Node.js Server is Running');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});