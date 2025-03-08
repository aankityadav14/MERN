const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log("🔒 Authorization Header:", token); // Debugging line
    if (!token) {
      return res.status(401).json({ message: "Access Denied. No token provided." });
    }

    console.log("🟢 Received Token:", token); // Debugging line

    // Remove "Bearer " if present
    const extractedToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    
    console.log("🔑 Extracted Token:", extractedToken); // Debugging line

    // Verify Token
    const verified = jwt.verify(extractedToken, process.env.JWT_SECRET);

    console.log("✅ Token Verified:", verified); // Debugging line

    req.user = verified; // Attach user info to request
    next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error.message);
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
