const jwt = require("jsonwebtoken");
const User = require("../modules/admin/admin.model"); // Assuming user model is here based on existing structure

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");

    // Check if user still exists
    const user = await User.findByPk(decoded.id || decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Exclude password from the user object attached to req
    const { password, ...userWithoutPassword } = user.toJSON();
    req.user = userWithoutPassword;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
