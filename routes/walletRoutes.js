const express = require("express");
const auth = require("../middleware/auth");

const walletController = require("../controller/walletController");

const router = express.Router();

router.post("/credit", auth, walletController.credit);
router.post("/debit", auth, walletController.debit);
router.get("/balance", auth, walletController.getBalance);
router.get("/audit", auth, walletController.getAuditLog);

module.exports = router;
