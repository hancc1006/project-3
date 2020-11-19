var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");

var db = require("../models");
const { response } = require("express");

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(new LocalStrategy(
  // Our user will sign in using an email, rather than a "username"
  {
    usernameField: "username"
   
  },
  function(username, password, done) {
      console.log("authenticating...");
 
    db.User.findOne({username}).then(function(dbUser) {
      if (!dbUser) {
        console.log('no User')
        return done(null, false, {
          message: "Incorrect email."
        });
      }
 
      else if (password != null){
        bcrypt.compare(password, dbUser.password).then(function(result) {
        console.log(result);
          if (result === false) {
            response.status(401);
            return done(null, false, {
              message: "Incorrect password"
            })
          } 
        }
      )}
      else {
        return done(null, dbUser);
    
      }
      
    });
  }
));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


module.exports = passport;