"use strict";
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Gas = require("./models/gas-model");
const statusCodes = require("http-status-codes").StatusCodes;

// Middleware
router.use(bodyParser.json());

router.get("/:id(\\d+)", (req, res) => {
  Gas.getGasInstance(req.params.id).then((gasInstance) => {
    res.json(gasInstance.fields);
    console.log(Object.keys(res.req));
  });
});

router.get("/", (req, res) => {
  Gas.getGasList().then((gasData) => {
    const fieldsList = gasData.map((gas) => gas.fields);
    res.json(fieldsList);
  });
});

router.post("/", (req, res) => {
  // analyse for GasLogID ignore or throw error
  // analyse body reject empty body post
  if (req.body && Object.keys(req.body).length !== 0) {
    const addNewGas = new Gas(req.body);
    addNewGas.save().then((response) => {
      addNewGas.fields.GasLogID = response;
      res.json(addNewGas.fields);
    });
  } else {
    res.status(statusCodes.BAD_REQUEST);
    throw new Error("BROKEN");
  }
});

router.put("/:id(\\d+)", (req, res) => {
  const reqBody = { ...req.body };
  reqBody.GasLogID = Number(req.params.id);
  const updateGas = new Gas(reqBody);
  updateGas.save().then((response) => {
    console.log(response);
    res.json(updateGas.fields);
  });
});

module.exports = router;
