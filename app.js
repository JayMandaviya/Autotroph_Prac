require('dotenv').config();
const express = require("express");
const app = express();

const sessionRoutes = require("./routes/sessionRoutes");
const walletRoutes = require("./routes/walletRoutes");

app.use(express.json());

app.use('/session', sessionRoutes);
app.use('/wallet',walletRoutes);

module.exports = app;
