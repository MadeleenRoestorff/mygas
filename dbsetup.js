const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('gas.db');

const usersColumns = [
  'PersonID INTEGER PRIMARY KEY',
  'username varchar(255) UNIQUE',
  'salt varchar(255)',
  'hash varchar(255)',
];

const gasColumns = [
  'GasLogID INTEGER PRIMARY KEY',
  'units NUMERIC',
  'createon DATETIME',
  'updateon DATETIME',
];

db.serialize(() => {
  db.run(`DROP TABLE users`); //TODO commentout
  db.run(`CREATE TABLE IF NOT EXISTS users (${usersColumns.join()})`);
  db.run(`DROP TABLE gas`); //TODO commentout
  db.run(`CREATE TABLE IF NOT EXISTS gas (${gasColumns.join()})`);
});

db.close();
