"use strict";
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Gas = require("./gas-model");

// Middleware
router.use(bodyParser.json());

router.get("/:id(\\d+)", (req, res) => {
  Gas.getInstance(req.params.id).then((gasInstance) => {
    res.json(gasInstance.fields);
    console.log(Object.keys(res.req));
  });
});

router.get("/", (req, res) => {
  Gas.getList().then((gasData) => {
    const fieldsList = gasData.map((gas) => gas.fields);
    res.json(fieldsList);
  });
});

router.post("/", (req, res) => {
  const addNewGas = new Gas(req.body);
  addNewGas.save().then(() => {
    res.json(addNewGas.fields);
  });
});

router.put("/:id(\\d+)", (req, res) => {
  const reqBody = { ...req.body };
  reqBody.GasLogID = Number(req.params.id);
  const updateGas = new Gas(reqBody);
  console.log("put updateGas", updateGas.fields);

  //   updateGas.updateGasRow().then((gas) => {
  //     console.log("put updateGas.updateGasRow", gas);
  //     res.json(gas.fields);
  //   });

  updateGas.save().then(() => {
    res.json(updateGas.fields);
  });
});

module.exports = router;
