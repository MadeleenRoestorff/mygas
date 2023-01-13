/* eslint-disable no-invalid-this */
import "dotenv/config";
import Logger from "./logger-model";
import sqlite3 from "sqlite3";
sqlite3.verbose();

// everything should just break if we can't import env vars
const dataBase = process.env.DATABASE || "no-db";
const logger = new Logger();

type Fields = {
  GasLogID?: number;
  units: number;
  createon?: string;
  updateon?: string;
};

class Gas {
  /**
   * Gas holds the private gas #fields see type Fields
   * Constructor initialise fields when a new instace is created
   * getFields is a function that returns the gas fields
   *
   * #insertIntoDB is a privte method that writes to the gas DB
   * and resolves inserted row ID or 1 (changes)
   *
   * The save method setup the sql queries and calls #insertIntoDB
   * and also resolves inserted row ID or 1 (changes)
   *
   * Static getGasInstance and getGasList functions
   * retrieves data from DB
   */

  #fields = {} as Fields;

  constructor(fields = {} as Fields) {
    this.#fields = fields || {};
  }

  //   setFields(fields: Fields) {
  //     this.#fields = fields;
  //   }

  getFields() {
    return this.#fields;
  }
  #insertIntoDB(query: string, param: (string | number)[]) {
    return new Promise<number>((resolve, reject) => {
      const db = new sqlite3.Database(dataBase);
      db.run(query, param, function (error) {
        if (this.lastID) {
          // Contain the value of the last inserted row ID
          resolve(this.lastID);
        } else if (this.changes === 1) {
          // The number of rows affected by this query
          resolve(this.changes);
        } else if (error) {
          logger.error(error.message);
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
      let param = null;
      if (this.#fields.GasLogID) {
        this.#fields.updateon = new Date().toISOString();
        // SQLite protects against SQL injections if you specify user-supplied data as part of the params
        query = "UPDATE gas SET units = ?, updateon = ?  WHERE GasLogID = ?";
        param = [this.#fields.units, this.#fields.updateon, this.#fields.GasLogID];
      } else {
        this.#fields.createon = new Date().toISOString();
        this.#fields.updateon = this.#fields.createon;
        query = "INSERT INTO gas (units, createon, updateon ) VALUES (?, ?, ?)";
        param = [this.#fields.units, this.#fields.createon, this.#fields.updateon];
      }
      this.#insertIntoDB(query, param)
        .then((newID) => {
          resolve(newID);
        })
        .catch((error) => {
          logger.error(error.message);
          reject(error);
        });
    });
  }

  static getGasInstance(gasId: number) {
    return new Promise<Gas>((resolve, reject) => {
      const db = new sqlite3.Database(dataBase);
      db.get(`SELECT * FROM gas WHERE GasLogID = '${gasId}'`, (error, row) => {
        if (error) {
          logger.error(error.message);
          reject(error);
        } else {
          if (row?.GasLogID !== gasId) {
            reject(new Error("Cannot find row GasLogID in DB"));
          }
          // Row is a database object
          resolve(new Gas(row));
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
            logger.error(error.message);
            reject(error);
          } else {
            // Row is a database object
            getGassArray.push(row);
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
