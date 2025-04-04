const excelJS = require('exceljs');
const Task = require('../model/task.model.js');
const User = require('../model/user.model.js');

// Export Task Report as an Excel file
const exportTasksReport = async (req, res) => {
    try {
        // Fetch tasks and populate assignedTo field with user details
        const tasks = await Task.find().populate("assignedTo", "name email");

        // Create a new Excel workbook and worksheet
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Task Report');

        // Define columns for the task report
        worksheet.columns = [
            { header: "Task ID", key: "_id", width: 25 },
            { header: "Title", key: "title", width: 30 },
            { header: "Description", key: "description", width: 50 },
            { header: "Priority", key: "priority", width: 15 },
            { header: "Status", key: "status", width: 20 },
            { header: "Due Date", key: "dueDate", width: 20 },
            { header: "Assigned To", key: "assignedTo", width: 30 }
        ];

        // Loop through tasks and add rows to the worksheet
        tasks.forEach((task) => {
            const assignedTo = task.assignedTo
                .map((user) => `${user.name} (${user.email})`)
                .join(", ");

            worksheet.addRow({
                _id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate.toISOString().split("T")[0],
                assignedTo: assignedTo || "Unassigned"
            });
        });

        // Set the response headers for downloading the Excel file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=tasks_report.xlsx');

        // Write the workbook to the response
        workbook.xlsx.write(res).then(() => {
            res.end();
        });

    } catch (error) {
        res.status(500).json({
            message: "Error exporting tasks",
            error: error.message
        });
    }
};

// Export User Report as an Excel file
const exportUsersReport = async (req, res) => {
    try {
        // Fetch users from the database
        const users = await User.find().select("name email _id role createdAt").lean();

        const userTask = await Task.find().populate("assignedTo", "name email _id");

        const userTaskMap = {};
        users.forEach((user) => {
            userTaskMap[user._id] = {
                name: user.name,
                email: user.email,
                taskCount: 0,
                pendingTasks: 0,
                inProgressTasks: 0,
                completedTasks: 0,
            };
        });

        userTask.forEach((task) => {
            if (task.assignedTo) {
                task.assignedTo.forEach((assignedUser) => {
                    if (userTaskMap[assignedUser._id]) {
                        userTaskMap[assignedUser._id].taskCount += 1;
                        if (task.status === "Pending") {
                            userTaskMap[assignedUser._id].pendingTasks += 1;
                        } else if (task.status === "In Progress") {
                            userTaskMap[assignedUser._id].inProgressTasks += 1;
                        } else if (task.status === "Completed") {
                            userTaskMap[assignedUser._id].completedTasks += 1;
                        }
                    }
                });
            }
        });

        // Create a new Excel workbook and worksheet
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('User Task Report');

        // Define columns for the user report
        worksheet.columns = [
            { header: "Name", key: "name", width: 30 },
            { header: "Email", key: "email", width: 40 },
            { header: "Total Assigned Task", key: "taskCount", width: 20 },
            { header: "Pending Tasks", key: "pendingTasks", width: 20 },
            { header: "In Progress Tasks", key: "inProgressTasks", width: 20 },
            { header: "Completed Tasks", key: "completedTasks", width: 20 },
        ];

        // Loop through users and add rows to the worksheet
        users.forEach((user) => {
            worksheet.addRow({
                name: user.name,
                email: user.email,
                taskCount: userTaskMap[user._id].taskCount,
                pendingTasks: userTaskMap[user._id].pendingTasks,
                inProgressTasks: userTaskMap[user._id].inProgressTasks,
                completedTasks: userTaskMap[user._id].completedTasks,
            });
        });

        // Set the response headers for downloading the Excel file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users_report.xlsx');

        // Write the workbook to the response
        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        res.status(500).json({
            message: "Error exporting users",
            error: error.message
        });
    }
};

module.exports = { exportTasksReport, exportUsersReport };
