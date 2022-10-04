const express = require("express");
const chatRoutes = require("./chat.route.js");
const historyRoutes = require("./history.route.js");
const router = express.Router();

// router.use("/chat", chatRoutes);
router.use("/comment", chatRoutes);
router.use("/history", historyRoutes);


module.exports = router;
