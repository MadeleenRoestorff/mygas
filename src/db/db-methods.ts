// import "dotenv/config";
// import Logger from "../models/logger-model";
import Gas from "../models/gas-model";
import User from "../models/user-model";
// import { Sequelize } from "sequelize";

// const dataBase = process.env.DATABASE || "no-db";
// const logger = new Logger();
// const sequelize = new Sequelize({
//   dialect: "sqlite",
//   storage: dataBase,
//   logging: (msg: string) => logger.debug(msg)
// });

// const usersDbColumns = [
//   "PersonID INTEGER PRIMARY KEY",
//   "username varchar(255) UNIQUE",
//   "salt varchar(255)",
//   "hash varchar(255)"
// ];

// const gasDbColumns = [
//   "GasLogID INTEGER PRIMARY KEY",
//   "units NUMERIC",
//   "createon DATETIME",
//   "updateon DATETIME"
// ];

// const sqlQueriesCreate = [
//   `CREATE TABLE IF NOT EXISTS users (${usersDbColumns.join()})`,
//   `CREATE TABLE IF NOT EXISTS gas (${gasDbColumns.join()})`
// ];

// const execDbQuery = (sqlQuery: string) => {
//   return new Promise<string>((resolve, reject) => {
//     const db = new sqlite3.Database(process.env.DATABASE || "no-db");
//     db.exec(sqlQuery, function (error) {
//       if (error) {
//         reject(error);
//       } else {
//         resolve("success");
//       }
//     });
//     db.close();
//   });
// };

export const dbSetup = async () => {
  //   const setupUsers = await execDbQuery(sqlQueriesCreate[0]);
  await Gas.sync();
  await User.sync();
  return [true];
  //   return [setupUsers, setupGas];
};

export const dbClear = async () => {
  //   const dropUsers = await execDbQuery("DROP TABLE IF EXISTS users");
  await Gas.drop();
  await User.drop();
  //   return [dropUsers, dropGas];
  return [true];
};
