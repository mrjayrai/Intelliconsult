const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./Config/db');
const UserSchema = require('./Models/User');
const AttendanceSchema = require('./Models/Attendance');
const TrainingSchema = require('./Models/Training');
const OpportunitySchema = require('./Models/Opportunity');
const UserSkillSchema = require('./Models/UserSkillSet');
const userRoutes = require('./Routes/UserRoutes');
const skillRoutes = require('./Routes/SkillsRoutes');
const AttendanceRoutes = require('./Routes/AttendanceRoutes');
const TrainingRoutes = require('./Routes/TrainingRoutes');
const OpportunityRoutes = require('./Routes/OpportunityRoutes');
const path = require('path');

connectDB();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

app.use('/api/users',userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/attendance', AttendanceRoutes);
app.use('/api/opportunities', OpportunityRoutes);
app.use('/api/trainings', TrainingRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
    res.send('Node.js Server is Running');
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});