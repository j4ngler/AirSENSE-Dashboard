const express = require("express");
const authCtrl = require("../controllers/auth.controller.js");
const userCtrl = require("../controllers/user.controller");
const isAuthenticated = require("../middlewares/authenticate.js");
const validate = require("../config/joi.validate.js");
const schema = require("../utils/validator.js");
const User = require("../models/database/user.model.js");
const router = express.Router();

// Login
router.route("/login").post(validate(schema.login), (req, res) => {
  authCtrl.login(req, res);
});

// Register new User
router.route("/register").post(validate(schema.register), (req, res) => {
  userCtrl.registerUser(req, res);
});

// Logout
router.post("/logout", (req, res) => {
  authCtrl.logOut(req, res);
});

// Get current user
router.route("/user").get(isAuthenticated, (req, res) => {
  User.query({
    where: { user_id: req.currentUser.user_id },
    select: [
      "user_id",
      "username",
      "fullname",
      "phone_number",
      "email",
      "address",
      "avatar",
      "permission_id",
    ],
  })
    .fetch({ require: false })
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: "No such user" });
      } else {
        res.status(200).json({
          user: user,
        });
      }
    });
});

// Change password
router.route("/changePassword")
  .put(validate(schema.changePassword), isAuthenticated, (req, res) => {
    userCtrl.changePassword(req, res);
  });

module.exports = router;

