const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

const keys = require("./keys");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.google.firestore1.oauth.clientID,
      clientSecret: keys.google.firestore1.oauth.clientSecret,
      callbackURL: "/auth/google/redirect"
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ googleId: profile.id }).then(currentUser => {
        if (currentUser) {
          //console.log("User is: ", currentUser);
          done(null, currentUser);
        } else {
          new User({
            username: profile.displayName,
            googleId: profile.id,
            thumbnail: profile._json.image.url
          })
            .save()
            .then(newUser => {
              //console.log("new user created: ", newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);
