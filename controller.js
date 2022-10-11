'use strict';
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
// Middleware
router.use(bodyParser.json());

class Gas {
  db = {};
  constructor() {
    this.db = new sqlite3.Database('gas.db');
  }

  closeDB = () => {
    this.db.close();
  };

  async getGas(gasId) {
    return new Promise((resolve, reject) => {
      let gasEntry = {};
      try {
        this.db.get(
          `SELECT * FROM gas WHERE GasLogID = '${gasId}'`,
          (err, row) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              gasEntry.GasLogID = row?.GasLogID ? row?.GasLogID : '';
              gasEntry.units = row?.units ? row?.units : '';
              gasEntry.createon = row?.createon ? row?.createon : '';
              gasEntry.updateon = row?.updateon ? row?.updateon : '';
              resolve(gasEntry);
            }
          }
        );
        // this.closeDB();
      } catch (err) {
        console.log('Error::' + err);
        // this.closeDB();
        reject(gasEntry);
      }
    });
  }
  async getGasList() {
    return new Promise((resolve, reject) => {
      let getGassArray = [];
      try {
        this.db.each(
          'SELECT * FROM gas',
          (err, row) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              getGassArray.push({
                GasLogID: row?.GasLogID ? row?.GasLogID : '',
                units: row?.units ? row?.units : '',
                createon: row?.createon ? row?.createon : '',
                updateon: row?.updateon ? row?.updateon : '',
              });
            }
          },
          (err, count) => {
            resolve(getGassArray);
            //   this.closeDB();
          }
        );
        // this.closeDB();
      } catch (err) {
        console.log('Error::' + err);
        // this.closeDB();
        reject(getGassArray);
      }
    });
  }

  async createGas(gas) {
    return new Promise((resolve, reject) => {
      try {
        gas.createon = new Date().toISOString();
        this.db.run(
          `INSERT INTO gas (units, createon) VALUES ('${gas.units}', '${gas.createon}')`,
          function () {
            if (!this.lastID) {
              reject('Update failed');
            } else {
              resolve(this.lastID);
            }
          }
        );
        // this.closeDB();
      } catch (err) {
        console.log('Error::' + err);
        // this.closeDB();
        reject(err);
      }
    });
  }

  async updateGas(gas) {
    return new Promise((resolve, reject) => {
      try {
        gas.updateon = new Date().toISOString();
        this.db.run(
          `UPDATE gas SET units = ${gas.units} WHERE GasLogID = ${gas.GasLogID}`,
          function () {
            console.log(this.changes);
            if (!this.changes) {
              reject('Update failed');
            } else {
              resolve(this.changes);
            }
          }
        );
        // this.closeDB();
      } catch (err) {
        console.log('Error::' + err);
        // this.closeDB();
        reject(err);
      }
    });
  }
}

const gasInstance = new Gas();

router.get('/:id(\\d+)', (req, res) => {
  gasInstance.getGas(req.params['id']).then((data) => {
    res.json(data);
    console.log(Object.keys(res['req']));
    console.log(req.headers);
    console.log(data);
  });
});
router
  .route('/')
  .get((req, res) => {
    gasInstance.getGasList().then((data) => {
      res.json(data);
    });
  })
  .post((req, res) => {
    gasInstance.createGas(req.body).then((data) => {
      console.log(data);
      res.json(data);
      console.log(Object.keys(res['req']['body']));
    });
  })
  .put((req, res) => {
    gasInstance.updateGas(req.body).then((data) => {
      res.json(data);
      console.log(data);
      console.log(Object.keys(res['req']['body']));
    });
  });

module.exports = router;
