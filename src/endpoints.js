"use strict";
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const Gas = require("./models/gas-model");
const statusCodes = require("http-status-codes").StatusCodes;

// Middleware
router.use(bodyParser.json());

router.get("/:id(\\d+)", (req, res) => {
  Gas.getGasInstance(req.params.id)
    .then((gasInstance) => {
      res.json(gasInstance.fields);
      //   console.log(Object.keys(res.req));
    })
    .catch(() => {
      res.status(statusCodes.BAD_REQUEST);
      res.json(null);
    });
});

router.get("/", (req, res) => {
  Gas.getGasList()
    .then((gasData) => {
      const fieldsList = gasData.map((gas) => gas.fields);
      res.json(fieldsList);
    })
    .catch(() => {
      res.status(statusCodes.BAD_REQUEST);
      res.json(null);
    });
});

const parseBody = (req, res, saveGas) => {
  if (req.body && Object.keys(req.body).length !== 0) {
    if (typeof req.body?.units === "number" && req.body?.units >= 0) {
      // I am in CONTROL of the payload
      saveGas({ units: req.body.units });
    } else {
      res.status(statusCodes.NOT_ACCEPTABLE);
      throw new Error("Wrong Resquest Body Sent");
    }
  } else {
    res.status(statusCodes.BAD_REQUEST);
    throw new Error("No Request Body Sent");
  }
};

router.post("/", (req, res) => {
  parseBody(req, res, (body) => {
    const addNewGas = new Gas(body);
    addNewGas
      .save()
      .then((response) => {
        addNewGas.fields.GasLogID = response;
        res.json(addNewGas.fields);
      })
      .catch(() => {
        res.status(statusCodes.NOT_ACCEPTABLE);
        res.json(null);
      });
  });
});

router.put("/:id(\\d+)", (req, res) => {
  parseBody(req, res, (body) => {
    try {
      const gasLodID = Number(req.params.id);
      if (gasLodID > 0) {
        body.GasLogID = gasLodID;
        const updateGas = new Gas(body);
        updateGas
          .save()
          .then(() => {
            res.json(updateGas.fields);
          })
          .catch(() => {
            res.status(statusCodes.NOT_ACCEPTABLE);
            res.json(null);
          });
      } else {
        res.status(statusCodes.NOT_ACCEPTABLE);
        res.json(null);
      }
    } catch (error) {
      res.status(statusCodes.NOT_ACCEPTABLE);
      res.json(null);
    }
  });
});

module.exports = router;
