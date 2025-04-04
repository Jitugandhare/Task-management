const express = require("express");
const router=express.Router();
const  {protect,adminOnly}=require('../middleware/authMiddleware.js')
const {exportTasksReport,exportUsersReport}=require("../controller/reports.controller.js")

router.get('/export/tasks',protect,adminOnly ,exportTasksReport)
router.get('/export/users',protect,adminOnly ,exportUsersReport)







module.exports=router;