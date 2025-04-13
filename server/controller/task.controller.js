const express = require("express");
const Task = require('../model/task.model.js');
const User = require('../model/user.model.js');


// const getDashboardData = async (req, res) => {
//     try {
//         // Check if the user is an admin
//         if (req.user.role !== 'admin') {
//             return res.status(403).json({ message: "Unauthorized access" });
//         }

//         // Get the total count of tasks (all tasks)
//         const allTasksCount = await Task.countDocuments();

//         // Get task count by status
//         const pendingTasksCount = await Task.countDocuments({ status: 'Pending' });
//         const inProgressTasksCount = await Task.countDocuments({ status: 'In Progress' });
//         const completedTasksCount = await Task.countDocuments({ status: 'Completed' });

//         // Get the number of users (you can use specific filters if necessary, like active users)
//         const allUsersCount = await User.countDocuments();
        
//         // You could also add additional statistics, such as users with assigned tasks, or average number of tasks per user
//         const usersWithTasksCount = await User.countDocuments({ tasks: { $gte: 1 } });

//         // Collect the data into a summary object
//         const dashboardSummary = {
//             allTasksCount,
//             pendingTasksCount,
//             inProgressTasksCount,
//             completedTasksCount,
//             allUsersCount,
//             usersWithTasksCount
//         };

//         // Respond with the dashboard data
//         res.json({
//             message: "Dashboard data retrieved successfully",
//             data: dashboardSummary
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };




// const getUserDashboardData = async (req, res) => {
//     try {
//         // Get tasks assigned to the logged-in user
//         const assignedTasks = await Task.find({ assignedTo: req.user._id })
//             .populate("assignedTo", "name email profileImageUrl");

//         if (!assignedTasks) {
//             return res.status(404).json({ message: "No tasks found for this user" });
//         }

//         // Get task counts by status for the user
//         const pendingTasksCount = await Task.countDocuments({
//             assignedTo: req.user._id,
//             status: "Pending"
//         });

//         const inProgressTasksCount = await Task.countDocuments({
//             assignedTo: req.user._id,
//             status: "In Progress"
//         });

//         const completedTasksCount = await Task.countDocuments({
//             assignedTo: req.user._id,
//             status: "Completed"
//         });

//         // Add completed todo checklist count to each task (optional)
//         const tasksWithCompletion = await Promise.all(
//             assignedTasks.map(async (task) => {
//                 const completedCount = task.todoChecklist.filter(
//                     (item) => item.completed
//                 ).length;
//                 return { ...task._doc, completedTodoCount: completedCount };
//             })
//         );

//         // Prepare the user dashboard data
//         const userDashboardData = {
//             tasks: tasksWithCompletion, // All tasks assigned to the user, with their completion counts
//             statusSummary: {
//                 pendingTasks: pendingTasksCount,
//                 inProgressTasks: inProgressTasksCount,
//                 completedTasks: completedTasksCount
//             }
//         };

//         // Respond with the user-specific dashboard data
//         res.json({
//             message: "User dashboard data retrieved successfully",
//             data: userDashboardData
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

const getDashboardData = async (req, res) => {
    try {
        // Only admins are allowed to view dashboard data
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        // Run all count queries in parallel to optimize performance
        const [
            allTasksCount,
            pendingTasksCount,
            inProgressTasksCount,
            completedTasksCount,
            allUsersCount,
            usersWithTasksCount
        ] = await Promise.all([  // **Optimized the queries by running them in parallel**
            Task.countDocuments(),
            Task.countDocuments({ status: 'Pending' }),
            Task.countDocuments({ status: 'In Progress' }),
            Task.countDocuments({ status: 'Completed' }),
            User.countDocuments(),
            User.countDocuments({ tasks: { $exists: true, $not: { $size: 0 } } })  // **Updated to check if 'tasks' field exists and is not an empty array**
        ]);

        // Calculate additional stats (optional)
        const tasksPerUserAvg = allUsersCount ? allTasksCount / allUsersCount : 0;  // **Newly added: Calculated the average number of tasks per user**

        // Collect the data into a summary object
        const dashboardSummary = {
            allTasksCount,
            pendingTasksCount,
            inProgressTasksCount,
            completedTasksCount,
            allUsersCount,
            usersWithTasksCount,
            tasksPerUserAvg  // **Included tasksPerUserAvg in the response**
        };

        // Respond with the dashboard data
        res.status(200).json({
            message: "Dashboard data retrieved successfully",
            data: dashboardSummary
        });
    } catch (error) {
        // Handle server errors
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const getUserDashboardData = async (req, res) => {
    try {
        // Get tasks assigned to the logged-in user
        const assignedTasks = await Task.find({ assignedTo: req.user._id })
            .populate("assignedTo", "name email profileImageUrl");

        // ✅ FIXED: Check for empty array instead of falsy check
        if (assignedTasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        // ✅ FIXED: Aggregate all task status counts in a single DB query
        const statusCounts = await Task.aggregate([
            { $match: { assignedTo: req.user._id } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // ✅ FIXED: Map aggregation results to structured summary
        const statusSummary = {
            pendingTasks: 0,
            inProgressTasks: 0,
            completedTasks: 0
        };

        statusCounts.forEach(({ _id, count }) => {
            if (_id === "Pending") statusSummary.pendingTasks = count;
            else if (_id === "In Progress") statusSummary.inProgressTasks = count;
            else if (_id === "Completed") statusSummary.completedTasks = count;
        });

        // ✅ FIXED: Use .toObject() instead of accessing _doc directly
        const tasksWithCompletion = await Promise.all(
            assignedTasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.completed
                ).length;
                return { ...task.toObject(), completedTodoCount: completedCount };
            })
        );

        // Prepare the user dashboard data
        const userDashboardData = {
            tasks: tasksWithCompletion,
            statusSummary
        };

        // Respond with the user-specific dashboard data
        res.json({
            message: "User dashboard data retrieved successfully",
            data: userDashboardData
        });
    } catch (error) {
        // ✅ ADDED: Log error to server console for easier debugging
        console.error("Error in getUserDashboardData:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// Get all tasks(Admin:all, user:only assigned)


const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        // Only apply status filter if it's provided and not empty
        if (status && status.trim() !== "") {
            filter.status = status;
        }

        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate("assignedTo", "name email profileImageUrl");
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate("assignedTo", "name email profileImageUrl");
        }

        // Add completed todoCheckList count to each task
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(item => item.completed).length;
                return { ...task._doc, completedTodoCount: completedCount };
            })
        );

        // Status summary counts
        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : { assignedTo: req.user._id }
        );

        const pendingTasks = await Task.countDocuments({
            status: "Pending",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        const inProgressTasks = await Task.countDocuments({
            status: "In Progress",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        const completedTasks = await Task.countDocuments({
            status: "Completed",
            ...(req.user.role !== "admin" && { assignedTo: req.user._id })
        });

        res.json({
            tasks,
            statusSummary: {
                all: allTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks, 
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


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

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if (!Array.isArray(req.body.assignedTo)) {
                return res.status(400).json({ message: "assigned-to must be an array of user ID's" })
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.json({ message: "Task updated successfully", updatedTask })

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });


    }
}



const updateTaskCheckList = async (req, res) => {
    try {
        const { todoChecklist } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Only allow updates if user is assigned to the task or is an admin
        if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized to update checklist" });
        }

        // Update the checklist and progress
        task.todoChecklist = todoChecklist;
        const completedCount = task.todoChecklist.filter(item => item.completed).length;
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        // Set the status based on progress
        if (task.progress === 100) {
            task.status = "Completed";
        } else if (task.progress > 0) {
            task.status = "In Progress";
        } else {
            task.status = "Pending";
        }

        // Save the task with updated checklist and progress
        await task.save();

        // Fetch the updated task with populated assigned user details
        const updatedTask = await Task.findById(req.params.id).populate("assignedTo", "name email profileImageUrl");

        // Respond with updated task and success message
        res.json({
            message: "Task checklist updated", 
            task: updatedTask
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        // Check if the user is assigned to the task or is an admin
        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if (!isAssigned && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not Authorized" });
        }

        // Update the task status
        task.status = req.body.status;

        // If status is "Completed", mark all checklist items as completed and set progress to 100
        if (task.status === "Completed") {
            task.todoChecklist.forEach((item) => {
                item.completed = true; // Mark each checklist item as completed
            });
            task.progress = 100; // Set task progress to 100% when completed
        } else {
            // If status isn't "Completed", recalculate the progress based on checklist completion
            const completedItems = task.todoChecklist.filter(item => item.completed).length;
            const totalItems = task.todoChecklist.length;
            task.progress = totalItems ? (completedItems / totalItems) * 100 : 0; // Calculate progress percentage
        }

        // Save the updated task
        const updatedTask = await task.save();

        res.json({ message: "Task status updated successfully", updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        await task.deleteOne();
        res.json({ message: "Task deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });


    }
}






module.exports = {
    getDashboardData, getUserDashboardData,
    getTasks, getTaskById, createTask, updateTask,
    updateTaskCheckList, updateTaskStatus,
    deleteTask
}