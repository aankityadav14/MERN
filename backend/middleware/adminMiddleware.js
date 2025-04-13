const jwt = require('jsonwebtoken');
const Admin = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log(token);
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const user = await Admin.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            console.log("User role is not admin");
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }

        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = isAdmin;