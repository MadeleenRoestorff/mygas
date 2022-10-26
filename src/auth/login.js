"use strict";

const express = require("express");
const router = express.Router();
const auth = require("./auth");

// middleware
router.use(express.urlencoded({ extended: false }));

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res, next) => {
  await auth.authenticateUser(req.body.username, req.body.password, (error, token) => {
    if (error) next(error);
    if (token) {
      console.log("token", token);
      res.redirect("back");
    } else {
      res.redirect("/login");
    }
  });
});

module.exports = router;
