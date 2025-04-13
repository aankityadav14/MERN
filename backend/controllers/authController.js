const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "your_secret_key"; // Replace with a strong secret key

// ✅ Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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
      role,
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

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both email and password'
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address'
      });
    }

    // Check if admin exists
    const admin = await User.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'No account found with this email address'
      });
    }

    // Check if account is active (assuming you have an 'active' field in your User model)
    if (admin.active === false) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect password'
      });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { 
        id: admin._id, 
        role: admin.role,
        email: admin.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Success response
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ Get All Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admins", error });
  }
};

// ✅ Update Admin
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword, ...otherUpdates } = req.body;

    // First find the admin
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    // If password update is requested
    if (newPassword) {
      // Verify current password first
      const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: 'error',
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      otherUpdates.password = await bcrypt.hash(newPassword, 10);
    }

    // Update admin with new data
    const updatedAdmin = await User.findByIdAndUpdate(
      id,
      { $set: otherUpdates },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Admin updated successfully',
      data: {
        user: {
          id: updatedAdmin._id,
          name: updatedAdmin.name,
          email: updatedAdmin.email,
          role: updatedAdmin.role
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error updating admin',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ✅ Delete Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdmin = await User.findByIdAndDelete(id);

    if (!deletedAdmin) {
      return res.status(404).json({
        status: 'error',
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Admin deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting admin',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
