const express = require("express");
const Task = require('../model/task.model.js')
const User = require('../model/user.model.js')
const bcrypt = require("bcryptjs");


const getUser = async (req, res) => {
    try {
        const users = await User.find({ role: 'member' }).select("-password");

        const usersWithTaskCounts = [];
        for (const user of users) {
            const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
            const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
            const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });

            usersWithTaskCounts.push({
                ...user._doc,
                pendingTasks,
                inProgressTasks,
                completedTasks,
            });
        }

        res.json(usersWithTaskCounts);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getUserById = async (req, res) => {

    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" })

        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })

    }
}

// const deleteUser = async (req, res) => {
//     try {

//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message })

//     }
// }






module.exports = { getUser, getUserById, }