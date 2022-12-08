/**
 * User mangement functions:
 *  - insertSaltedHashedUserInDB
 *  - authenticateUser
 *  - restrict
 *
 */

const crypto = require("crypto");
const sqlite3 = require("sqlite3").verbose();
const dotenv = require("dotenv");
const statusCodes = require("http-status-codes").StatusCodes;
const jwt = require("jsonwebtoken");

const digest = "sha256";
const iterations = 99999;
const keyLength = 64;
const bufferSalt = crypto.randomBytes(keyLength).toString("base64");

// get config vars
dotenv.config();

exports.insertSaltedHashedUserInDB = (password, username) => {
  /**
   * Inserts a user into the DB.
   * Passwords are hashed and salted
   *
   * @param {string} password: user password
   * @param {string} username: user username
   */

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, bufferSalt, iterations, keyLength, digest, (error, hash) => {
      if (error) reject(error);
      try {
        const db = new sqlite3.Database(process.env.DATABASE);
        db.all(
          `INSERT INTO users (username, salt, hash) VALUES ('${username}', '${bufferSalt}', '${hash.toString(
            "base64"
          )}')`,
          [],
          (errordb, row) => {
            if (errordb) {
              reject(errordb);
            } else {
              resolve(row);
            }
          }
        );
        db.close();
      } catch (errorTry) {
        console.log("Could Not Create User");
        reject(errorTry);
      }
    });
  });
};

exports.authenticateUser = (name, password, errToken) => {
  // query the db for the given username
  const getUserSaltHash = new Promise((resolve, reject) => {
    const db = new sqlite3.Database(process.env.DATABASE);
    db.get(`SELECT * FROM users WHERE username = '${name}'`, (errordb, row) => {
      if (errordb) {
        reject(errordb);
      } else {
        try {
          resolve([row.salt, row.hash, row.username]);
        } catch (errorCaught) {
          reject(errorCaught);
        }
      }
    });
    db.close();
  });

  return new Promise((resolve) => {
    getUserSaltHash
      .then((saltedhash) => {
        crypto.pbkdf2(password, saltedhash[0], iterations, keyLength, digest, (error, hash) => {
          if (error) resolve(errToken(error, null));

          //   match pw hash with db hash
          if (hash.toString("base64") === saltedhash[1]) {
            // generate token
            const token = jwt.sign({ username: saltedhash[2] }, process.env.GEHUIMPIE, {
              expiresIn: "24h"
            });
            console.log(process.env.GEHUIMPIE);
            resolve(errToken(null, token));
          } else {
            resolve(errToken("Wrong Password", null));
          }
        });
      })
      .catch(() => {
        resolve(errToken(`Cannot find Username: ${name}`, null));
      });
  });
};

exports.restrict = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    req.error = "Access denied!";
    res.status(statusCodes.UNAUTHORIZED);
    res.json(null);
  } else {
    jwt.verify(token, process.env.GEHUIMPIE, (error, user) => {
      if (error) {
        req.error = error;
        res.status(statusCodes.UNAUTHORIZED);
        res.json(null);
      } else {
        req.user = user;
        next();
      }
    });
  }
};
