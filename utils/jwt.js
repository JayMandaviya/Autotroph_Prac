const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30m" });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken };
