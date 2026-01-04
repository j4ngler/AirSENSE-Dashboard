const express = require("express");
const router = express.Router();

// Home page
router.get("/", (req, res) => {
  res.render("home/home", { route: "home", title: "Electric-Nose Dashboard" });
});

// Login pages
router.get("/login/admin", (req, res) => {
  res.render("admin/admin", { route: "admin" });
});

router.get("/login/user", (req, res) => {
  res.render("authen/login", { route: "login" });
});

// Register page
router.get("/register", (req, res) => {
  res.render("authen/register", { route: "register" });
});

// Dashboard
router.get("/dashboard", (req, res) => {
  res.render("home/dashboard", { route: "dashboard", title: "Control Dashboard" });
});

// Device management
router.get("/devices", (req, res) => {
  res.render("home/devices", { route: "devices", title: "Device Management" });
});

// Control panel
router.get("/control", (req, res) => {
  res.render("home/control", { route: "control", title: "System Control" });
});

// Settings page
router.get("/settings", (req, res) => {
  res.render("home/settings", { route: "settings", title: "Settings" });
});

module.exports = router;

