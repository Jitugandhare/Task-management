const express = require("express");
const Task = require('../model/task.model.js');
const User = require('../model/user.model.js');


const getDashboardData = async (req, res) => {
    try {


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });


    }
}



const getUserDashboardData = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });


    }
}

// Get all tasks(Admin:all, user:only assigned)

const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};
        if (status) {
            filter.status = status;
        }

        let tasks;
        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo", "name email profileImageUrl"
            )
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
                "assignedTo",
                "name email profileImageUrl"
            )
        }

        // Add completed todoCheckList count to each task

        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.completed
                ).length;
                return { ...task._doc, completedTodoCount: completedCount }
            })
        )
        // status summary count
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user.role }
        )

        const pendingTasks = await Task.countDocuments({
            ...filter, status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        })


        const inProgressTasks = await Task.countDocuments({
            ...filter, status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        })

        const compeletedTasks = await Task.countDocuments({
            ...filter, status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        })
res.json({
    tasks,statusSummary:{
        all:allTasks,
        pendingTasks,
        inProgressTasks,
        compeletedTasks,
    }
})


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });


    }
}


const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo", "name email profileImageUrl"
        );
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const createTask = async (req, res) => {
    try {

        const {
            title, description, priority,
            dueDate, assignedTo, attachments,
            todoChecklist
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ message: "assigned-to must be an array of user ID's" })
        }

        const task = await Task.create({
            title, description, priority,
            dueDate, assignedTo,
            createdBy: req.user._id,
            attachments,
            todoChecklist: todoChecklist,
        })
        res.status(201).json({ message: "Task created successfully", task })


    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });


    }
}

const updateTask = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });


    }
}



const updateTaskCheckList = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });


    }
}


const updateTaskStatus = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });


    }
}

const deleteTask = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });


    }
}






module.exports = {
    getDashboardData, getUserDashboardData,
    getTasks, getTaskById, createTask, updateTask,
    updateTaskCheckList, updateTaskStatus,
    deleteTask
}const express = require("express");
const router=express.Router();
const {protect,adminOnly}=require('../middleware/authMiddleware.js')
const {getDashboardData,getUserDashboardData,
    getTasks,getTaskById,createTask,updateTask,
    updateTaskCheckList,updateTaskStatus,
deleteTask
}=require('../controller/task.controller.js')



router.get('/dashboard-data',protect,getDashboardData)
router.get('/user-dashboard-data',protect,getUserDashboardData)
router.get('/',protect,getTasks)
router.get('/:id',protect,getTaskById)
router.post('/',protect,adminOnly,createTask)
router.put('/:id',protect,updateTask)
router.put('/:id/todo',protect,updateTaskCheckList)
router.put('/:id/status',protect,updateTaskStatus)
router.delete('/:id',protect,adminOnly,deleteTask)






module.exports=router;
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: { type: String, required: true }, 
    completed: { type: Boolean, default: false }, 
});

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    description: { type: String },
    priority: { 
        type: String, 
        enum: ['Low', 'High', 'Medium'], 
        default: 'Medium' 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'In Progress', 'Completed'], 
        default: 'Pending' 
    },
    dueDate: { type: Date, required: true }, 
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    createdBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    attachments: [{ type: String }], 
    todoChecklist: [todoSchema], 
    progress: { type: Number, default: 0 }, 
}, 
{
    timestamps: true 
});


const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
const jwt = require('jsonwebtoken');
const User = require('../model/user.model.js')


const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        // console.log('Token:', token);

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // console.log('Decoded:', decoded);

            req.user = await User.findById(decoded.id).select("-password");
            // console.log('User from DB:', req.user);
            next();
        } else {
            res.status(401).json({ message: "Not authorized, no token" })
        }
    } catch (error) {
        res.status(401).json({ message: "token failed", message: error.message })

    }
}

// middleware only for admin access

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied, admin only" })

    }
}


module.exports = { adminOnly, protect }