const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connection=require("./configue/db.js")
const authRoutes=require('./routes/auth.route.js');
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



app.use('/api/auth',authRoutes)
// app.use('/api/user',userRoutes)
// app.use('/api/task',taskRoutes)
// app.use('/api/reports',reportsRoutes)






const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await connection;
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.log(error)
    }
});