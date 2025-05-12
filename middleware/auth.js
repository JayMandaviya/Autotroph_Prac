const { getSession } = require("../models/memoryStore");

module.exports = (req, res, next) => {
  const sessionId = req.headers["x-session-id"];
  if (!sessionId) return res.status(401).json({ error: "Missing session ID" });

  const session = getSession(sessionId);
  console.log("session",session,sessionId);
  
  if (!session || session.expiry < Date.now()) {
    return res.status(401).json({ error: "Invalid session" });
  }

  req.userId = session.userId;
  next();
};
