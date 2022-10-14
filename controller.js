"use strict";
const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
// Middleware
router.use(bodyParser.json());

class Gas {
  db = {};
  constructor() {
    this.db = new sqlite3.Database("gas.db");
  }

  closeDB = () => {
    this.db.close();
  };

  getGas = (gasId) => {
    return new Promise((resolve, reject) => {
      const gasEntry = {};
      try {
        this.db.get(`SELECT * FROM gas WHERE GasLogID = '${gasId}'`, (error, row) => {
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
        // this.closeDB();
      } catch (error) {
        console.log("Error::", error);
        // this.closeDB();
        reject(gasEntry);
      }
    });
  };
  getGasList = () => {
    return new Promise((resolve, reject) => {
      const getGassArray = [];
      try {
        this.db.each(
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
            //   this.closeDB();
          }
        );
        // this.closeDB();
      } catch (error) {
        console.log("Error::", error);
        // this.closeDB();
        reject(getGassArray);
      }
    });
  };

  createGas = (gas) => {
    console.log(gas);
    return new Promise((resolve, reject) => {
      console.log("hello");
      try {
        gas.createon = new Date().toISOString();
        this.db.run(
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
        // this.closeDB();
      } catch (error) {
        console.log("Error::", error);
        // this.closeDB();
        reject(error);
      }
    });
  };

  updateGas = (gas) => {
    return new Promise((resolve, reject) => {
      try {
        gas.updateon = new Date().toISOString();
        this.db.run(
          `UPDATE gas SET units = ${gas.units} WHERE GasLogID = ${gas.GasLogID}`,
          function () {
            try {
              // eslint-disable-next-line no-invalid-this
              resolve(this.changes);
            } catch (error) {
              console.log("Update Failed");
              reject(error);
            }
          }
        );
        // this.closeDB();
      } catch (error) {
        console.log("Error::", error);
        // this.closeDB();
        reject(error);
      }
    });
  };
}

const gasInstance = new Gas();

router.get("/:id(\\d+)", (req, res) => {
  gasInstance.getGas(req.params.id).then((gasData) => {
    res.json(gasData);
    console.log(Object.keys(res.req));
  });
});
router
  .route("/")
  .get((req, res) => {
    gasInstance.getGasList().then((gasData) => {
      res.json(gasData);
    });
  })
  .post((req, res) => {
    gasInstance.createGas(req.body).then((gasData) => {
      res.json(gasData);
      console.log(Object.keys(res.req.body));
    });
  })
  .put((req, res) => {
    gasInstance.updateGas(req.body).then((gasData) => {
      res.json(gasData);
      console.log(Object.keys(res.req.body));
    });
  });

module.exports = router;
