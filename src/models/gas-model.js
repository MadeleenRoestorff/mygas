"use strict";
const sqlite3 = require("sqlite3").verbose();

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

  async save() {
    if (this.fields.GasLogID) {
      await this.updateGasRow();
    } else {
      await this.addNewGasRow();
    }
  }

  addNewGasRow() {
    return new Promise((resolve, reject) => {
      try {
        const db = new sqlite3.Database("gas.db");
        this.fields.createon = new Date().toISOString();
        this.fields.updateon = this.fields.createon;
        db.run(
          `INSERT INTO gas (units, createon, updateon ) VALUES ('${this.fields.units}', '${this.fields.createon}','${this.fields.updateon}')`,
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
  }

  updateGasRow() {
    return new Promise((resolve, reject) => {
      try {
        const db = new sqlite3.Database("gas.db");
        this.fields.updateon = new Date().toISOString();
        console.log("this.fields.updateon", this.fields.updateon);
        console.log("this.fields.createon", this.fields.createon);
        db.run(
          `UPDATE gas SET units = ${this.fields.units}, updateon = '${this.fields.updateon}'  WHERE GasLogID = ${this.fields.GasLogID}`,

          function () {
            try {
              // eslint-disable-next-line no-invalid-this
              console.log(this.changes);
              // eslint-disable-next-line no-invalid-this
              resolve(this.changes);
            } catch (error) {
              console.log("Update Failed", error);
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
  }

  static getGasInstance(gasId) {
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
            resolve(new Gas(gasEntry));
          }
        });
        db.close();
      } catch (error) {
        console.log("Error::", error);
        reject(gasEntry);
      }
    });
  }

  static getGasList() {
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
