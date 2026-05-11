const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Authorization required" });
    }
    const token = authorization.replace("Bearer ", "");

    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;

    next();
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Invalid or expired token" });
  }
};
