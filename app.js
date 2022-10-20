"use strict";

/**
 * Module dependencies.
 */

const express = require("express");
const path = require("path");
const vouch = require("./vouch");
module.exports = express();
const app = module.exports;

const login = require("./login");

// const gasController = require("./controller");
const gasEndpoint = require("./endpoints");

const PORT = 3000;

// config

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware

app.use("/login", login);
app.use("/controller", vouch.restrict, gasEndpoint);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/logout", (req, res) => {
  req.user = null;
  res.redirect("/");
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(PORT);
  console.log(`Express started on port ${PORT}`);
}
