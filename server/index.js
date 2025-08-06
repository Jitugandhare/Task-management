const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const connection = require("./configue/db.js"); // Ensure this is the correct path to your DB configuration

// Route imports
const authRoutes = require('./routes/auth.route.js');
const userRoutes = require('./routes/user.route.js');
const taskRoutes = require('./routes/task.route.js');
const reportsRoutes = require('./routes/reports.route.js');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || "*", // Use CLIENT_URL from .env, fallback to "*" (open CORS)
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

// Serve frontend (for Single Page App, e.g., React)
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all route to handle frontend routing for single-page apps
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});

// 404 Handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global Error Handler (optional but recommended)
app.use((err, req, res, next) => {
    console.error(err.stack);
    if (process.env.NODE_ENV === 'development') {
        res.status(500).json({ message: err.message, stack: err.stack });
    } else {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await connection.connect; 
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});
