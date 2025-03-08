require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const facultyRoutes = require("./routes/facultyRoutes");
const eventRoutes = require("./routes/eventRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const authRoutes = require("./routes/authRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const timeTableRoutes = require("./routes/timeTableRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const academicRoutes = require("./routes/AcademicRoutes");
const mentorMenteeRoutes = require('./routes/mentorMenteeRoutes');
const app = express();

// Middleware
app.use(express.json()); // Parse JSON request body
app.use(cors()); // Enable CORS

// Routes
app.use("/api/faculty", facultyRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/timetable", timeTableRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/academic", academicRoutes);
app.use('/api/mentor-mentee', mentorMenteeRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true, // <-- Remove this if using Mongoose v6+
    useUnifiedTopology: true, // <-- Remove this if using Mongoose v6+
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error connecting to DB:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
