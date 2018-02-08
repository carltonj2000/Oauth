const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
//const firebaseAdmin = require("firebase-admin");

const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-routes");
const passportsetup = require("./config/passport-setup");
const keys = require("./config/keys");

const app = express();
// firebaseAdmin.initializeApp({
//   credential: firebaseAdmin.credential.cert(
//     keys.google.firestore1.serviceAccountKeys
//   ),
//   databaseURL: "https://firestore1-ec7ec.firebaseio.com"
// });
// const firestore = firebaseAdmin.firestore();
mongoose.connect(keys.mlab.oauth.uri, () => {
  console.log("connected to mongodb");
});
app.set("view engine", "ejs");

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});
app.listen(3000, () => {
  console.log("app now listening for requests on port 3000");
});
