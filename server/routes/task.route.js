const express = require("express");
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




// Route for tasks
// router.get('/tasks/:id', protect, getTaskById);



module.exports=router;