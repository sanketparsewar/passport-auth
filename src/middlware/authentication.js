const passport = require("passport");
LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const { compareSync } = require("bcrypt");

// this function will look for user with particular username
passport.use(
  new LocalStrategy(async function (username, password, done) {
    try {
      const user = await User.findOne({ username: username });
      //   here the the first parameter of done is null means no error occur and second parameter is for user and false means no user
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      // if we get error then this first case is true
      // if (err) {
      //   console.log("bac");
      //   return done(err);
      // }

      //   the first paramerter is actual password and the second paramerter is encrypted password store in database
      // here we are using the compareSync function from the bcrypt that helps us to decrypt and compare both the passwords
      // this inbuild function does some decryptions at its end
      if (!compareSync(password, user.password)) {
        return done(null, false, { message: "Incorrect password" });
      }
      //   here the first parameter of done null means no error occur and second parameter is for user
      return done(null, user);
    } catch (err) {
      console.log("err");
      return done(err);
    }
  })
);

// session configuration. we have to write this two functions whenever we are using the session
// this will persist the data inside session
// this will add our userid to session body
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// this will fetch the session object/details based on the session id that is stored inside session object
passport.deserializeUser(function (id, done) {
  const user=User.findById(id)
  if(!user) return done(err)
  return done(null, user)
});
