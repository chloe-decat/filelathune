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

passport.deserializeUser(function(id, callback) {
  return users.findUserById(id).then(user => {
    callback(null, user)
  });
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

  new FacebookStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.REDIRECT_URI
    },
    function(accessToken, refreshToken, profile, callback) {
      FB.api(
          "me",
          { fields: "id,name,email", access_token: accessToken },
          function(user) {
            findOrCreateUser(user)
              .then(user => {
                callback(null, user);
              })
              .catch(error => {
                callback(error);
              })
          }
        );
    }
  );


// Attention checker les routes qui font doublon
app.get("/", function(request, result) {
  result.render("login", {
    user: request.user
  });
});

app.get(
  "/login",
  passport.authenticate("facebook", {
    authType: "rerequest" // rerequest is here to ask again if login was denied once
  })
);

app.get(
  "/login/facebook/return",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(request, result) {
    result.redirect("/");
  }
);

app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn(),
  function(request, result) {
    result.render("profile", {
      id: request.user.id,
      name: request.user.displayName,
      emails: request.user.emails
    });
});
// Attention checker les routes qui font doublon - jusque la.

app.get("/", function(request, result) {
  result.render("login");
});

app.get("/register", function(request, result) {
  result.render("register");
});

app.post(
  "/register",
//ajouter du code ici pour connecter le user
);

app.post(
  "/",
  passport.authenticate("local", { failureRedirect: "/" }),
  function(request, result) {
    console.log("redirect to /profile");
    result.redirect("/profile");
  }
);

app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn("/"),
  function(request, result) {
    console.log("toto", request.user)
    result.render("profile", {
      id: request.user.id,
      name: request.user.displayName,
      email: request.user.email
    });
  }
);

app.get("/logout", function(request, result) {
  request.logout();
  result.redirect("/");
});

app.get("/account", function(request, result) {
  result.render("account");
});

app.post(
  "/account",
  function(request, result) {
    queries.insertUser(request.body.name, request.body.username, sha256(request.body.password));
    result.redirect("/register");
  }
);

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});

app.get("/create_activity", function(request, result) {
    result.render("create_activity");
});
