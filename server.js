const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const nunjucks = require("nunjucks");
const sha256 = require("sha256");
const queries = require("./queries.js");
const users = require("./user.js");
const FacebookStrategy = require("passport-facebook").Strategy;
const FB = require("fb");

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app
});
app.set("views", __dirname + "/views");
app.set("view engine", "njk");

app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("cookie-parser")());
app.use(
  require("express-session")({
    secret: "sdfhqsmfhsqdmlfhgamrigl:nvc",
    resave: false,
    saveUninitialized: false
  })
);


// Initialize Passport and restore authentication state,
// if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, callback) {
  return callback(null, user.id);
});

passport.deserializeUser(function(user, callback) {
  return callback(null, user)
});

passport.use(
  new LocalStrategy(function(email, password, callback) {
    users
      .findUser(email, sha256(password))
      .then(user => {
        callback(null, user);
      })
      .catch(error => {
        callback(error);
      });
  }));

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI
    },
    function(accessToken, refreshToken, profile, callback) {
      return queries.findOrCreateUser(profile, callback)
    }
  )
);

// Attention checker les routes qui font doublon
app.get("/", function(request, result) {
  result.render("login", {
    user: request.user
  });
});

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    authType: "rerequest" // rerequest is here to ask again if login was denied once
  })
);

app.get(
  "/auth/facebook/return",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(request, result) {
    console.log("je suis dans passport.authenticate /login/facebook/return")
    result.redirect("/profile");
  }
);

app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn(),
  function(request, result) {
    result.render("profile", {
      user: request.user
    });
  }
);

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});

app.get("/create_activity", function(request, result) {
    result.render("create_activity");
});
