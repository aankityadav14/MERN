const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_secret_key"; // Replace with a strong secret key

// ✅ Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Admin already exists" });

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create Admin User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });
    await newUser.save();

    res
      .status(201)
      .json({ message: "Admin registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error });
  }
};

// ✅ Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await User.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Check Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET, // Ensure this is correct
      { expiresIn: "1d" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// ✅ Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error });
  }
};
