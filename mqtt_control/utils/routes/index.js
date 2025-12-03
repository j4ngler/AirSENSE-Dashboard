const express = require("express");
const commentRoutes = require("./comment.route.js");
const router = express.Router();
const authenticationRoutes = require('./authentication.route.js');
const deviceRoute = require("./device.route.js");

// router.use("/chat", chatRoutes);
// router.use("/comment", commentRoutes);
router.use("/comment", commentRoutes);
router.use("/auth", authenticationRoutes);
router.use("/device", deviceRoute);

module.exports = router;
