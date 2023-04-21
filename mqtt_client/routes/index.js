const express = require("express");
const commentRoutes = require("./comment.route.js");
const router = express.Router();
const authenticationRoutes = require('./authentication.route.js')

// router.use("/chat", chatRoutes);
// router.use("/comment", commentRoutes);
router.use("/comment", commentRoutes);
router.use("/authentication", authenticationRoutes)

module.exports = router;
