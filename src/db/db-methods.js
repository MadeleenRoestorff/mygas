const sqlite3 = require("sqlite3").verbose();

const usersColumns = [
  "PersonID INTEGER PRIMARY KEY",
  "username varchar(255) UNIQUE",
  "salt varchar(255)",
  "hash varchar(255)"
];

const gasColumns = [
  "GasLogID INTEGER PRIMARY KEY",
  "units NUMERIC",
  "createon DATETIME",
  "updateon DATETIME"
];

const sqlQueriesCreate = [
  `CREATE TABLE IF NOT EXISTS users (${usersColumns.join()})`,
  `CREATE TABLE IF NOT EXISTS gas (${gasColumns.join()})`
];

const setUpFunction = (sqlQuery, dbName) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbName);
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

exports.dbSetup = async (dbName = "gas.db") => {
  const setupUsers = await setUpFunction(sqlQueriesCreate[0], dbName);
  const setupGas = await setUpFunction(sqlQueriesCreate[1], dbName);
  return [setupUsers, setupGas];
};

exports.dbClear = async (dbName = "gas.db") => {
  const setupUsers = await setUpFunction("DROP TABLE users", dbName);
  const setupGas = await setUpFunction("DROP TABLE gas", dbName);
  return [setupUsers, setupGas];
};
