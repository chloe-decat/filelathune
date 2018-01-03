const express = require("express");
const nunjucks = require("nunjucks");

const port = process.env.PORT || 3000;

const app = express();

nunjucks.configure("views", {
  autoescape: true,
  express: app
});

app.set("views", __dirname + "/views");
app.set("view engine", "njk");

app.get("/", function(request, result) {
  result.render("login");
});
app.listen(3000)
