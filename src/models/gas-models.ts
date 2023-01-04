/* eslint-disable max-statements */
/* eslint-disable no-invalid-this */
import sqlite3 from "sqlite3";
import "dotenv/config";
import Logger from "./logger-model";

// get config vars
sqlite3.verbose();

type Fields = {
  GasLogID?: number;
  units?: number;
  createon?: string;
  updateon?: string;
};
const dataBase = process.env.DATABASE || "no-db";
const logger = new Logger();

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
      db.run(query, [], function (error) {
        if (this.lastID) {
          // Contain the value of the last inserted row ID
          resolve(this.lastID);
        } else if (this.changes === 1) {
          // The number of rows affected by this query
          resolve(this.changes);
        } else if (error) {
          logger.debug(JSON.stringify(error, Object.getOwnPropertyNames(error)));
          reject(error);
        } else {
          reject(new Error("Incorrect ID"));
        }
      });
      db.close();
    });
  }

  save() {
    return new Promise<number>((resolve, reject) => {
      let query = null;
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
        .then((newID) => {
          resolve(newID);
        })
        .catch((error) => {
          logger.debug(`${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
          reject(error);
        });
    });
  }

  static getGasInstance(gasId: number) {
    return new Promise<Gas>((resolve, reject) => {
      const gasEntry = {} as Fields;
      const db = new sqlite3.Database(dataBase);
      db.get(`SELECT * FROM gas WHERE GasLogID = '${gasId}'`, (error, row) => {
        if (error) {
          logger.debug(JSON.stringify(error, Object.getOwnPropertyNames(error)));
          reject(error);
        } else {
          if (row?.GasLogID) {
            gasEntry.GasLogID = row?.GasLogID;
            gasEntry.units = row?.units ? row?.units : "";
            gasEntry.createon = row?.createon ? row?.createon : "";
            gasEntry.updateon = row?.updateon ? row?.updateon : "";
            resolve(new Gas(gasEntry));
          } else {
            reject(new Error("Cannot find row GasLogID in DB"));
          }
          resolve(new Gas(gasEntry));
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
            logger.debug(JSON.stringify(error, Object.getOwnPropertyNames(error)));
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
