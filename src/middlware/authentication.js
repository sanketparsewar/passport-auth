const passport = require("passport");
LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const { compareSync } = require("bcrypt");


// this function will look for user with particular username
passport.use(
  new LocalStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      // if we get error then this first case is true
      if (err) {
        return done(err);
      }
    //   here the the first parameter of done is null means no error occur and second parameter is for user and false means no user 
      if (!user) {
        return done(null, false,{message: "User not found"});
      }
    //   the first paramerter is actual password and the second paramerter is encrypted password store in database
    // here we are using the compareSync function from the bcrypt that helps us to decrypt and compare both the passwords
    // this inbuild function does some decryptions at its end  
      if (!compareSync(password,user.password)) {
        return done(null, false,{message:'Incorrect password'});
      }
    //   here the first parameter of done null means no error occur and second parameter is for user
      return done(null, user);
    });
  })
);
