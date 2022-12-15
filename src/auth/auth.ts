/* eslint-disable prefer-arrow-callback */
/* eslint-disable max-statements */
/**
 * User mangement functions:
 *  - insertSaltedHashedUserInDB
 *  - authenticateUser
 *  - restrict
 *
 */
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import sqlite3 from "sqlite3";
import "dotenv/config";
import { StatusCodes } from "http-status-codes";
import jwt, { verify } from "jsonwebtoken";
const digest = "sha256";
const iterations = 99999;
const keyLength = 64;
const bufferSalt = crypto.randomBytes(keyLength).toString("base64");
sqlite3.verbose();

// everything should just break if we can't import env vars
const dataBase = process.env.DATABASE || "no-db";
const gehuim = process.env.GEHUIMPIE;

// unique username check

export const insertSaltedHashedUserInDB = (username: string, password: string) => {
  /**
   * Inserts a user into the DB.
   * Passwords are hashed and salted
   *
   * @param {string} password: user password
   * @param {string} username: user username
   */

  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(password, bufferSalt, iterations, keyLength, digest, (error, hash) => {
      if (error) reject(error);
      const db = new sqlite3.Database(dataBase);
      db.run(
        `INSERT INTO users (username, salt, hash) VALUES ('${username}', '${bufferSalt}', '${hash.toString(
          "base64"
        )}')`,
        [],
        function (errorRun) {
          if (errorRun) {
            reject(errorRun);
          } else {
            resolve("User Added");
          }
        }
      );
      db.close();
    });
  });
};

type ErrorTokenCallback = (_error: Error | null, _token: string | null) => void;

export const authenticateUser = (name: string, password: string, errToken: ErrorTokenCallback) => {
  // query the db for the given username
  const getUserSaltHash = new Promise<string[]>((resolve, reject) => {
    const db = new sqlite3.Database(dataBase);
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

  return new Promise<void>((resolve, reject) => {
    getUserSaltHash
      .then((saltedhash) => {
        crypto.pbkdf2(password, saltedhash[0], iterations, keyLength, digest, (error, hash) => {
          if (error) resolve(errToken(error, null));
          if (!gehuim) {
            reject(new Error("Error: Invalid secret"));
          }
          //   match pw hash with db hash
          if (hash.toString("base64") === saltedhash[1] && gehuim) {
            // generate token
            const token = jwt.sign({ username: saltedhash[2] }, gehuim, {
              expiresIn: "24h"
            });
            resolve(errToken(null, token));
          } else {
            resolve(errToken(new Error("Wrong Password"), null));
          }
        });
      })
      .catch(() => {
        resolve(errToken(new Error(`Cannot find Username: ${name}`), null));
      });
  });
};

export const restrict = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token: string | null = authHeader?.split?.(" ")?.[1] || null;
  if (!token || !gehuim) {
    res.status(StatusCodes.UNAUTHORIZED);
    res.json(null);
  } else {
    try {
      const isVerified = verify(token, gehuim);
      if (isVerified) {
        next();
      } else {
        throw new Error("Verification failed");
      }
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED);
      res.json(null);
    }
  }
};
