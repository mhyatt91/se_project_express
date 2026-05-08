const jwt = require("jsonwebtoken");

const JWT_SECRET = "your-secret-key"; // move to env in real apps

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Check if header exists
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization required" });
    }

    // Extract token
    const token = authorization.replace("Bearer ", "");

    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach user payload to request
    req.user = payload;

    // Continue
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
