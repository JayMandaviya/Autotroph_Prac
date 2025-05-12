const { v4: uuidv4 } = require("uuid");

const store = {
  sessions: new Map(),
  wallets: new Map(),
  auditLogs: new Map(),
};

function createSession(userId) {
  let sessionId = uuidv4();
  const expiry = Date.now() + 30 * 60 * 1000;
  store.sessions.set(sessionId, { userId, expiry });
  return { sessionId, expiry };
}

function getSession(sessionId) {
  return store.sessions.get(sessionId);
}

module.exports = { store, createSession, getSession };
