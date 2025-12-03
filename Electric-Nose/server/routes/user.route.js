const express = require("express");
const userCtrl = require("../controllers/user.controller");
const isAuthenticated = require("../middlewares/authenticate.js");
const router = express.Router();

// Get all users
router.get("/", isAuthenticated, (req, res) => {
  userCtrl.getUsers(req, res);
});

// Get user by ID
router.get("/:id", isAuthenticated, (req, res) => {
  userCtrl.getUserById(req, res);
});

// Update user
router.put("/:id", isAuthenticated, (req, res) => {
  userCtrl.updateUser(req, res);
});

// Delete user
router.delete("/:id", isAuthenticated, (req, res) => {
  userCtrl.deleteUser(req, res);
});

module.exports = router;

