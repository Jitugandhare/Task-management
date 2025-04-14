const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connection = require("./configue/db.js")
const authRoutes = require('./routes/auth.route.js');
const userRoutes = require('./routes/user.route.js')
const taskRoutes = require('./routes/task.route.js');
const reportsRoutes = require('./routes/reports.route.js');

dotenv.config();

const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
app.use(express.json());



app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/reports', reportsRoutes)

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await connection;
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.log(error)
    }
});