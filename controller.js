"use strict";
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

// Middleware
router.use(bodyParser.json());

const getGasRow = (gasId) => {
  return new Promise((resolve, reject) => {
    const gasEntry = {};
    try {
      const db = new sqlite3.Database("gas.db");
      db.get(`SELECT * FROM gas WHERE GasLogID = '${gasId}'`, (error, row) => {
        if (error) {
          reject(error);
        } else {
          gasEntry.GasLogID = row?.GasLogID ? row?.GasLogID : "";
          gasEntry.units = row?.units ? row?.units : "";
          gasEntry.createon = row?.createon ? row?.createon : "";
          gasEntry.updateon = row?.updateon ? row?.updateon : "";
          resolve(gasEntry);
        }
      });
      db.close();
    } catch (error) {
      console.log("Error::", error);
      reject(gasEntry);
    }
  });
};

/**
 * Sets the internal fields paramater
 * @param fields Gas log details.
 */
const getGasListOfRows = () => {
  return new Promise((resolve, reject) => {
    const getGassArray = [];
    try {
      const db = new sqlite3.Database("gas.db");
      db.each(
        "SELECT * FROM gas",
        (error, row) => {
          if (error) {
            reject(error);
          } else {
            getGassArray.push({
              GasLogID: row?.GasLogID ? row?.GasLogID : "",
              units: row?.units ? row?.units : "",
              createon: row?.createon ? row?.createon : "",
              updateon: row?.updateon ? row?.updateon : ""
            });
          }
        },
        (_err, _count) => {
          resolve(getGassArray);
        }
      );
      db.close();
    } catch (error) {
      console.log("Error::", error);
      reject(getGassArray);
    }
  });
};

const createGas = (gas) => {
  return new Promise((resolve, reject) => {
    try {
      const db = new sqlite3.Database("gas.db");
      gas.createon = new Date().toISOString();
      db.run(
        `INSERT INTO gas (units, createon) VALUES ('${gas.units}', '${gas.createon}')`,
        function () {
          try {
            // eslint-disable-next-line no-invalid-this
            resolve(this.lastID);
          } catch (error) {
            reject(error);
          }
        }
      );
      db.close();
    } catch (error) {
      console.log("Error::", error);
      reject(error);
    }
  });
};

const updateGas = (gas) => {
  return new Promise((resolve, reject) => {
    try {
      const db = new sqlite3.Database("gas.db");
      gas.updateon = new Date().toISOString();
      db.run(`UPDATE gas SET units = ${gas.units} WHERE GasLogID = ${gas.GasLogID}`, function () {
        try {
          // eslint-disable-next-line no-invalid-this
          resolve(this.changes);
        } catch (error) {
          console.log("Update Failed");
          reject(error);
        }
      });
      db.close();
    } catch (error) {
      console.log("Error::", error);
      reject(error);
    }
  });
};

router.get("/:id(\\d+)", (req, res) => {
  getGasRow(req.params.id).then((gasData) => {
    res.json(gasData);
    console.log(Object.keys(res.req));
  });
});
router
  .route("/")
  .get((req, res) => {
    getGasListOfRows().then((gasData) => {
      res.json(gasData);
    });
  })
  .post((req, res) => {
    createGas(req.body).then((gasData) => {
      res.json(gasData);
      console.log(Object.keys(res.req.body));
    });
  })
  .put((req, res) => {
    updateGas(req.body).then((gasData) => {
      res.json(gasData);
      console.log(Object.keys(res.req.body));
    });
  });

module.exports = router;
