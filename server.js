const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const nunjucks = require("nunjucks");
const sha256 = require("sha256");

const queries = require("./queries.js");
const users = require("./user.js");
const uuidv4 = require('uuid/v4');
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

const port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log(`Server listening on port ${port}`);
});

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
      name: request.user.name,
      email: request.user.email
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
    console.log("redirect to /dashboard");
    result.redirect("/dashboard");
  }
);

app.get(
  "/dashboard",
  require("connect-ensure-login").ensureLoggedIn("/"),
  function(request, result) {
    result.render("dashboard", {
      id: request.user.id,
      name: request.user.name,
      email: request.user.email
    });
  }
);

app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn("/"),
  function(request, result) {
    console.log("toto", request.user)
    result.render("profile", {
      id: request.user.id,
      name: request.user.name,
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
    result.redirect("/");
  }
);

app.get("/create_activity",
  require("connect-ensure-login").ensureLoggedIn("/"),
  function(request, result){
    result.render("create_activity",{
      name:request.user.name,
      id:request.user.id
    });
  }
);

app.post(
  "/create_activity",
  require("connect-ensure-login").ensureLoggedIn("/"),
  function(request, result) {
    queries.insertActivity(uuidv4(),request.body.startdate, request.body.description, request.body.titre, request.user.id)
    .then(activity => {
      return queries.insertIntoUsersActivities(activity.rows[0].id, request.user.id)
      })
    .then(final => {
        result.redirect("/create_activity");
      })
    .catch(error => console.warn(error))
  }
);

app.get("/create_expense",
  require("connect-ensure-login").ensureLoggedIn("/"),
  function(request, result) {
  const idActivity='0e1a513c-891b-4d02-9082-f723e41177f1';
  queries.getCurrentActivityName(idActivity,result)
    .then(response => result.render("create_expense",{currentActivity:response}))
    .catch(error => console.warn(error))
});

app.post(
  "/save_expense",
  function(request, result) {
    const idActivity = '0e1a513c-891b-4d02-9082-f723e41177f1';
    queries.insertIntoExpenses(request.body.name, request.body.description, request.body.amount, uuidv4(), idActivity)
    .then ( listUsersExpense => {
      return queries.insertIntoUsersExpenses(listUsersExpense.rows[0].id)
    })
    .then(
      final => {
        result.redirect("/save_expense");
      }
    )
    .catch(error => console.warn(error))
  }
);

app.get(
  "/save_expense",
  function(request, result) {
    result.render("save_expense");
});
