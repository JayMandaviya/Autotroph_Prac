const { store } = require("../models/memoryStore");

function walletEnsure(userId) {
  if (!store.wallets.has(userId)) {
    store.wallets.set(userId, { balance: 0, lock: false });
    store.auditLogs.set(userId, []);
  }
}

async function lockAndExecute(userId, fn) {
  const wallet = store.wallets.get(userId);
  if (wallet.lock) throw new Error("Operation in progress");
  wallet.lock = true;

  try {
    await fn(wallet);
  } finally {
    wallet.lock = false;
  }
}

exports.credit = async (req, res) => {
  const amount = Number(req.body.amount);
  if (amount <= 0) return res.status(400).json({ error: "Invlid amount" });

  const userId = req.userId;
  walletEnsure(userId);

  try {
    await lockAndExecute(userId, async (wallet) => {
      wallet.balance += amount;
      store.auditLogs
        .get(userId)
        .push({ type: "credit", amount, timestamp: Date.now() });
    });
    res.json({ message: "Credited Successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.debit = async (req, res) => {
  const amount = Number(req.body.amount);
  if (amount <= 0) return res.status(400).json({ error: "Invalid amount" });

  const userId = req.userId;
  walletEnsure(userId);

  try {
    await lockAndExecute(userId, async (wallet) => {
      if (wallet.balance < amount) throw new Error("Insufficient Balance");
      wallet.balance -= amount;
      store.auditLogs
        .get(userId)
        .push({ type: "debit", amount, timestamp: Date.now() });
    });
    res.json({ message: "Debited Successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBalance = (req, res) => {
  const userId = req.userId;
  walletEnsure(userId);
  res.json({ balance: store.wallets.get(userId).balance });
};

exports.getAuditLog = (req, res) => {
  const userId = req.userId;
  res.json({ logs: store.auditLogs.get(userId) || [] });
};
