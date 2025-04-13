const express = require("express");
const router=express.Router();
const {protect,adminOnly}=require('../middleware/authMiddleware.js')
const {getUser,getUserById,deleteUser}=require('../controller/user.controller.js')



router.get('/',protect, adminOnly,getUser);
router.get('/:id',protect,getUserById)

/*  router.delete('/:id',protect,adminOnly,deleteUser);
*/




module.exports=router;