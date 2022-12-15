/* eslint-disable prefer-arrow-callback */
import sqlite3 from "sqlite3";
import "dotenv/config";

// get config vars
sqlite3.verbose();

const usersDbColumns = [
  "PersonID INTEGER PRIMARY KEY",
  "username varchar(255) UNIQUE",
  "salt varchar(255)",
  "hash varchar(255)"
];

const gasDbColumns = [
  "GasLogID INTEGER PRIMARY KEY",
  "units NUMERIC",
  "createon DATETIME",
  "updateon DATETIME"
];

const sqlQueriesCreate = [
  `CREATE TABLE IF NOT EXISTS users (${usersDbColumns.join()})`,
  `CREATE TABLE IF NOT EXISTS gas (${gasDbColumns.join()})`
];

const execDbQuery = (sqlQuery: string) => {
  return new Promise<string>((resolve, reject) => {
    const db = new sqlite3.Database(process.env.DATABASE || "no-db");
    db.exec(sqlQuery, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve("success");
      }
    });
    db.close();
  });
};

export const dbSetup = async () => {
  const setupUsers = await execDbQuery(sqlQueriesCreate[0]);
  const setupGas = await execDbQuery(sqlQueriesCreate[1]);
  return [setupUsers, setupGas];
};

export const dbClear = async () => {
  const dropUsers = await execDbQuery("DROP TABLE IF EXISTS users");
  const dropGas = await execDbQuery("DROP TABLE IF EXISTS gas");
  return [dropUsers, dropGas];
};
