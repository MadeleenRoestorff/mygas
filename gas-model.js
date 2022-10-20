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
      console.log("save fields", this.fields);
      await this.updateGasRow();
      console.log("save fields", this.fields);
    }

    // await this.addNewGasRow();
  }

  static async getInstance(id) {
    const dbFields = await Gas.#getGasRow(id);
    if (dbFields) {
      return new Gas(dbFields);
    }
    return null;
  }

  static async getList() {
    const fieldList = await Gas.#getListOfGasRows();
    return fieldList.map((fields) => new Gas(fields));
  }

  addNewGasRow() {
    return new Promise((resolve, reject) => {
      try {
        const db = new sqlite3.Database("gas.db");
        this.fields.createon = new Date().toISOString();
        db.run(
          `INSERT INTO gas (units, createon) VALUES ('${this.fields.units}', '${this.fields.createon}')`,
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
    console.log("updateGasRow fields", this.fields);
    return new Promise((resolve, reject) => {
      try {
        const db = new sqlite3.Database("gas.db");
        this.fields.updateon = new Date().toISOString();
        db.run(
          `UPDATE gas SET units = ${this.fields.units} WHERE GasLogID = ${this.fields.GasLogID}`,
          function () {
            try {
              // eslint-disable-next-line no-invalid-this
              resolve(this.changes);
              console.log("saved");
            } catch (error) {
              console.log("Update Failed");
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

  static #getGasRow(gasId) {
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
  }

  static #getListOfGasRows() {
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
  }
}

module.exports = Gas;
