const express = require("express");
const authRoutes = require("./auth.route.js");
const userRoutes = require("./user.route.js");
const deviceRoutes = require("./device.route.js");
const controlRoutes = require("./control.route.js");
const router = express.Router();

// mount auth routes at /auth
router.use("/auth", authRoutes);

// mount user routes at /users
router.use("/users", userRoutes);

// mount device routes at /devices
router.use("/devices", deviceRoutes);

// mount control routes at /control
router.use("/control", controlRoutes);

module.exports = router;

