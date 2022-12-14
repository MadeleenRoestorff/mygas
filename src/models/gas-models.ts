/* eslint-disable max-statements */
/* eslint-disable no-invalid-this */
import sqlite3 from "sqlite3";
import "dotenv/config";

// get config vars
sqlite3.verbose();

type Fields = {
  GasLogID?: number;
  units?: number;
  createon?: string;
  updateon?: string;
};
const dataBase = process.env.DATABASE || "no-db";

class Gas {
  #fields: Fields = {};

  constructor(fields: Fields = {}) {
    this.#fields = fields || {};
  }

  //   setFields(fields: Fields) {
  //     this.#fields = fields;
  //   }

  getFields(): Fields {
    return this.#fields;
  }
  #insertIntoDB(query: string) {
    return new Promise<number>((resolve, reject) => {
      const db = new sqlite3.Database(dataBase);
      db.run(query, [], function (errorRun) {
        try {
          if (this.lastID) {
            // Contain the value of the last inserted row ID
            resolve(this.lastID);
          } else if (this.changes === 1) {
            // The number of rows affected by this query
            resolve(this.changes);
          } else if (errorRun) {
            reject(new Error("Could not add to DB"));
          } else {
            reject(new Error("Incorrect ID"));
          }
        } catch (error) {
          reject(error);
        }
      });
      db.close();
    });
  }

  save() {
    return new Promise<number>((resolve, reject) => {
      let query = null;
      try {
        if (this.#fields.GasLogID) {
          this.#fields.updateon = new Date().toISOString();
          query = `UPDATE gas SET units = ${this.#fields.units}, updateon = '${
            this.#fields.updateon
          }'  WHERE GasLogID = ${this.#fields.GasLogID}`;
        } else {
          this.#fields.createon = new Date().toISOString();
          this.#fields.updateon = this.#fields.createon;
          query = `INSERT INTO gas (units, createon, updateon ) VALUES ('${this.#fields.units}', '${
            this.#fields.createon
          }','${this.#fields.updateon}')`;
        }
        this.#insertIntoDB(query)
          .then((change) => {
            resolve(change);
          })
          .catch((error) => {
            reject(error);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getGasInstance(gasId: number) {
    return new Promise<Gas>((resolve, reject) => {
      const gasEntry = {} as Fields;
      const db = new sqlite3.Database(dataBase);
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
              reject(new Error("Cant find row GasLogID"));
            }
            resolve(new Gas(gasEntry));
          } catch (errorDBCallback) {
            reject(errorDBCallback);
          }
        }
      });
      db.close();
    });
  }

  static getGasList() {
    return new Promise<Gas[]>((resolve, reject) => {
      const getGassArray: Fields[] = [];
      const db = new sqlite3.Database(dataBase);
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
    });
  }
}

export default Gas;
