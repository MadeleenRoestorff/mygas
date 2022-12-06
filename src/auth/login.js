"use strict";

const express = require("express");
const router = express.Router();
const auth = require("./auth");
const statusCodes = require("http-status-codes").StatusCodes;

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
      res.status(statusCodes.UNAUTHORIZED);
    }
  });
});

module.exports = router;
