const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./configue/db.js"); 

// Route imports
const authRoutes = require('./routes/auth.route.js');
const userRoutes = require('./routes/user.route.js');
const taskRoutes = require('./routes/task.route.js');
const reportsRoutes = require('./routes/reports.route.js');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/reports', reportsRoutes);

// Serve static files from "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 404 Handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global Error Handler (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await connection; 
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});
