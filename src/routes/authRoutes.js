const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Correct import of the User model
const { hashSync } = require("bcrypt");
const passport = require("passport");

// here we are importing the middleware
require("../middlware/authentication");

router.get("/", function (req, res) {
  res.redirect("/register");
});

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: hashSync(req.body.password, 10),
    email: req.body.email,
  });

  user
    .save()
    .then(() => {
      console.log("User saved");
      res.redirect("/login");
    })
    .catch((err) => {
      console.error("Error saving user:", err);
      res.status(500).send("Error saving user");
    });
  //   res.send({ success: true });
});

router.get("/login", function (req, res) {
  res.render("login");
});

// here use the middleware
// first paramerter is strategy and second is callback
router.post(
  "/login",
  passport.authenticate("local", { successRedirect: "logged" })
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/login");
    console.log(req.session);
    console.log(req.user);
  });
});

router.get("/logged", function (req, res) {
  // also we can declare it as like is the boolean value of isAuthenticated() is true the send logged
  if (req.isAuthenticated()) return res.send("logged");
  else res.status(401).send({ message: "unauthorized" });
  // console.log(req.session);
  // console.log(req.user);
  // res.send("logged");
});

module.exports = router;
