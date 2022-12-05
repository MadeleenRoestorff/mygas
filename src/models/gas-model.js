/* eslint-disable max-statements */
/* eslint-disable no-invalid-this */
"use strict";
const sqlite3 = require("sqlite3").verbose();
const dotenv = require("dotenv");

// get config vars
dotenv.config();

class Gas {
  #fields = {};

  constructor(fields = {}) {
    this.#fields = fields || {};
  }

  set fields(fields) {
    this.#fields = fields;
  }

  get fields() {
    return this.#fields;
  }
  #insertIntoDB(query) {
    return new Promise((resolve, reject) => {
      try {
        const db = new sqlite3.Database(process.env.DATABASE);
        db.run(query, function () {
          try {
            if (this.lastID) {
              // Contain the value of the last inserted row ID
              resolve(this.lastID);
            } else if (this.changes === 1) {
              // The number of rows affected by this query
              resolve(this.changes);
            } else {
              reject(new Error("Incorrect ID"));
            }
          } catch (error) {
            reject(error);
          }
        });
        db.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      let query = null;
      try {
        if (this.fields.GasLogID) {
          this.fields.updateon = new Date().toISOString();
          query = `UPDATE gas SET units = ${this.fields.units}, updateon = '${this.fields.updateon}'  WHERE GasLogID = ${this.fields.GasLogID}`;
        } else {
          this.fields.createon = new Date().toISOString();
          this.fields.updateon = this.fields.createon;
          query = `INSERT INTO gas (units, createon, updateon ) VALUES ('${this.fields.units}', '${this.fields.createon}','${this.fields.updateon}')`;
        }
        resolve(
          this.#insertIntoDB(query).catch((error) => {
            throw error;
          })
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  static getGasInstance(gasId) {
    return new Promise((resolve, reject) => {
      const gasEntry = {};
      try {
        const db = new sqlite3.Database(process.env.DATABASE);
        db.get(`SELECT * FROM gas WHERE GasLogID = '${gasId}'`, (error, row) => {
          if (error) {
            reject(error);
          } else {
            try {
              gasEntry.GasLogID = row?.GasLogID;
              gasEntry.units = row?.units ? row?.units : "";
              gasEntry.createon = row?.createon ? row?.createon : "";
              gasEntry.updateon = row?.updateon ? row?.updateon : "";
              if (!row?.GasLogID) {
                reject(gasEntry);
              }
              resolve(new Gas(gasEntry));
            } catch (errorDBCallback) {
              reject(errorDBCallback);
            }
          }
        });
        db.close();
      } catch (errorDB) {
        console.log("Error::", errorDB);
        reject(gasEntry);
      }
    });
  }

  static getGasList() {
    return new Promise((resolve, reject) => {
      const getGassArray = [];
      try {
        const db = new sqlite3.Database(process.env.DATABASE);
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
            resolve(getGassArray.map((fields) => new Gas(fields)));
          }
        );
        db.close();
      } catch (error) {
        console.log("Error::", error);
        reject(getGassArray);
      }
    });
  }
}

module.exports = Gas;
