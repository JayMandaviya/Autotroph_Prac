const express = require("express");
const router = express.Router();
const { createSession } = require("../models/memoryStore");

router.post("/start", (req, res) => {
  const userId = req.body.userId;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  const { sessionId, expiry } = createSession(userId);
  res.json({ sessionId, expiry });
});

module.exports = router;
