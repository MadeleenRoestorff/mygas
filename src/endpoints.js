"use strict";
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Gas = require("./models/gas-model");

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
  const addNewGas = new Gas(req.body);
  addNewGas.save().then((response) => {
    console.log(response);
    res.json(addNewGas.fields);
  });
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
