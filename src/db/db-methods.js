const sqlite3 = require("sqlite3").verbose();
const dotenv = require("dotenv");

// get config vars
dotenv.config();

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

const execDbQuery = (sqlQuery) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(process.env.DATABASE);
    db.all(sqlQuery, [], (error, row) => {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
    db.close();
  });
};

exports.dbSetup = async () => {
  const setupUsers = await execDbQuery(sqlQueriesCreate[0]);
  const setupGas = await execDbQuery(sqlQueriesCreate[1]);
  return [setupUsers, setupGas];
};

exports.dbClear = async () => {
  const setupUsers = await execDbQuery("DROP TABLE IF EXISTS users");
  const setupGas = await execDbQuery("DROP TABLE IF EXISTS gas");
  return [setupUsers, setupGas];
};
