const express = require("express");
const { registerAdmin, getAllAdmins,loginAdmin,updateAdmin,deleteAdmin } = require("../controllers/authController");
const isAdmin = require("../middleware/adminMiddleware");
const router = express.Router();

router.post("/register", registerAdmin); // Register admin
router.post("/login",loginAdmin) //loginadmin
router.get("/",isAdmin, getAllAdmins); // Get all admins
router.put("/user/:id",isAdmin,updateAdmin); //updateadmin
router.delete("/user/:id",isAdmin,deleteAdmin); //deleteadmin


module.exports = router;
