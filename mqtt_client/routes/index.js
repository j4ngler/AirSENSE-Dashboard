const express = require("express");
const commentRoutes = require("./comment.route.js");
const historyRoutes = require("./history.route.js");
const router = express.Router();

// router.use("/chat", chatRoutes);
router.use("/comment", commentRoutes);
router.use("/history", historyRoutes);


module.exports = router;
