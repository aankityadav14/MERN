const express = require("express");
const { registerAdmin, getAllAdmins,loginAdmin } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerAdmin); // Register admin
router.post("/login",loginAdmin) //loginadmin
router.get("/", getAllAdmins); // Get all admins

module.exports = router;
