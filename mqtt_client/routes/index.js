const express = require("express");
const commentRoutes = require("./comment.route.js");
const router = express.Router();
const authenticationRoutes = require('./authentication.route.js')

// router.use("/chat", chatRoutes);
// router.use("/comment", commentRoutes);
router.use("/comment", commentRoutes);
router.use("/auth", authenticationRoutes)

module.exports = router;
