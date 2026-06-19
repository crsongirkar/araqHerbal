const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ADMIN_COOKIE_NAME = "araq_admin_token";

const JWT_SECRET = process.env.JWT_SECRET || (
  console.warn("⚠️ JWT_SECRET is not set in environment variables. Generating a secure temporary secret key for this session."),
  crypto.randomBytes(32).toString("hex")
);

const adminAuth = (req, res, next) => {
  const token = req.cookies[ADMIN_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized. Admin session required." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.role === "Administrator") {
      return next();
    }
    return res.status(401).json({ error: "Unauthorized. Admin privilege required." });
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized. Invalid admin session token." });
  }
};

module.exports = {
  adminAuth,
  ADMIN_COOKIE_NAME,
  JWT_SECRET
};
