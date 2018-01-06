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

app.use(express.static("./images"));

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

// passport.deserializeUser(function(user, callback) {
//   return callback(null, user)
// });

passport.deserializeUser(function(id, callback) {
  return users.findUserById(id).then(user=>{
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
    console.log("je suis dans passport.authenticate /login/facebook/return " + request.user.id);
    result.redirect("/dashboard");
  }
);

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
    queries.getActivitiesFromUSer(request.user.id)
      .then(activities => {
        result.render("dashboard", {
          id: request.user.id,
          name: request.user.name,
          email: request.user.email,
          activities: activities.rows
        })
      })
      ;
  }
);

app.get(
  "/profile",
  require("connect-ensure-login").ensureLoggedIn("/"),
  function(request, result) {
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
    queries.insertUser(request.body.name, request.body.username, sha256(request.body.password))
      .then(user => {
        request.logIn(user, function(error) {
          if (error) {
            console.log(error);
            return result.redirect("/account");
          }
          return result.redirect("/dashboard");
        });
      });
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
    return queries.exportActivity(uuidv4(),request.body.startdate, request.body.description, request.body.titre, request.body.hidden_value, request.user.id)
    .then(final => {
        result.redirect("/create_activity");
      })
    .catch(error => console.warn(error))
  }
);

app.get("/create_expense",
  require("connect-ensure-login").ensureLoggedIn("/"),
  function(request, result) {
  const idActivity='704615f3-f79b-4f90-8183-2a777ee09c57';
  queries.getCurrentActivityName(idActivity,result)
    .then(response => result.render("create_expense",
    {
      currentActivity:response,
      name:request.user.name,
      id:request.user.id
    }))
    .catch(error => console.warn(error))
});

app.post(
  "/create_expense",
  require("connect-ensure-login").ensureLoggedIn("/"),
  function(request, result) {
    const idActivity = '704615f3-f79b-4f90-8183-2a777ee09c57';
    return queries.insertIntoExpenses(request.body.titre, request.body.description, request.body.amount, uuidv4(), idActivity,request.body.hidden_value,request.user.id)
    .then(
      final => {
        result.redirect("/create_expense");
      }
    )
    .catch(error => console.warn(error))
  }
);

app.get("/activity_dashboard",
  require("connect-ensure-login").ensureLoggedIn("/"),
  function(request, result) {
    console.log(request.user.id)
    result.render("activity_dashboard",{
      name:request.user.name,
      id:request.user.id
    });
  }
);
app.get(
  "/activity_dashboard/:id",
  require("connect-ensure-login").ensureLoggedIn("/"),
  function(request, result) {
  const currentActivity = queries.getActivity(`${request.params.id}`);
  const currentExpense = queries.getExpense(`${request.params.id}`);
  const currentParticipant = queries.getParticipant(`${request.params.id}`);
  const currentBuyer = queries.getBuyer(`${request.params.id}`);
  const currentExpenseParticipant = queries.getExpenseParticipant(`${request.params.id}`);
Promise.all([currentActivity, currentExpense, currentParticipant, currentBuyer, currentExpenseParticipant])
  .then(results => {
    result.render("activity_dashboard",{
      activity:results[0].rows,
      expense:results[1].rows,
      participants:results[2].rows,
      buyer:results[3].rows,
      expenseParticipant:results[4].rows,
      name:request.user.name,
      id:request.user.id
    })
  })
});
