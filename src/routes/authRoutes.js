const express = require("express");
const router = express.Router();
const User = require("../models/user"); // Correct import of the User model
const { hashSync } = require("bcrypt");
const passport = require("passport");

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

router.post(
  "/login",
  passport.authenticate("local", { successRedirect: "/logged" })
);

router.get("/logged", function (req, res) {
  res.send("logged");
});

module.exports = router;
