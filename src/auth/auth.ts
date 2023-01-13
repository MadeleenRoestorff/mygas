/* eslint-disable prefer-arrow-callback */

/**
 * User mangement functions:
 *  - insertSaltedHashedUserInDB
 *  - authenticateUser
 *  - restrict
 *
 */

import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import Logger from "../models/logger-model";
import { StatusCodes } from "http-status-codes";
import jwt, { verify } from "jsonwebtoken";
import "dotenv/config";
import sqlite3 from "sqlite3";
sqlite3.verbose();
const digest = "sha256";
const iterations = 99999;
const keyLength = 64;
const bufferSalt = crypto.randomBytes(keyLength).toString("base64");

// everything should just break if we can't import env vars
const dataBase = process.env.DATABASE || "no-db";
const secret = process.env.SECRETJT;
const logger = new Logger();

// TODO unique username check
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
      if (error) {
        logger.error(error.message);
        reject(error);
      }
      const db = new sqlite3.Database(dataBase);
      // SQLite protects against SQL injections if you specify user-supplied data as part of the params
      db.run(
        "INSERT INTO users (username, salt, hash) VALUES (?, ?, ?)",
        [username, bufferSalt, hash.toString("base64")],
        function (errorRun) {
          if (errorRun) {
            logger.error(errorRun.message);
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
  /**
   * Authenticate User with username and password.
   * Retrieve user salt and hash from user DB using username
   *
   * Calcultate new hash from password and salt using NODE crypto
   * Compare DB hash with calculated hash
   * if authenicated resolve token
   *
   * @param {string} name: user name
   * @param {string} password: user password
   * @param {ErrorTokenCallback} errToken: callback with error or token
   */

  // query the db for the given username
  const getUserSaltHash = new Promise<string[]>((resolve, reject) => {
    const db = new sqlite3.Database(dataBase);
    db.get(`SELECT * FROM users WHERE username = '${name}'`, (errdb, row) => {
      if (errdb) {
        logger.error(errdb.message);
        reject(errdb);
      } else {
        try {
          resolve([row.salt, row.hash, row.username]);
        } catch (errCaught) {
          logger.error(errCaught instanceof Error ? errCaught.message : "Verification failed");
          reject(errCaught);
        }
      }
    });
    db.close();
  });

  return new Promise<void>((resolve) => {
    getUserSaltHash
      .then((saltedhash) => {
        crypto.pbkdf2(password, saltedhash[0], iterations, keyLength, digest, (error, hash) => {
          if (error) {
            logger.error(error.message);
            resolve(errToken(error, null));
          }
          //   match pw hash with db hash
          if (hash.toString("base64") === saltedhash[1] && secret) {
            // generate token
            const token = jwt.sign({ username: saltedhash[2] }, secret, {
              expiresIn: "24h"
            });
            resolve(errToken(null, token));
          } else {
            logger.error("Wrong Password");
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
  /**
   * Restrict content
   * Restrict is a type of middleware that requires
   * verification before content can be accessed
   * Token in request header is extracted
   * and verified with jwt verify function
   *
   * @param {Request} req: request
   * @param {Response} res: response
   * @param {NextFunction} next: next
   */
  const authHeader = req.headers.authorization;
  const token: string | null = authHeader?.split?.(" ")?.[1] || null;
  if (!token || !secret) {
    res.status(StatusCodes.UNAUTHORIZED);
    res.json(null);
  } else {
    try {
      const isVerified = verify(token, secret);
      if (isVerified) {
        next();
      } else {
        throw new Error("Verification failed");
      }
    } catch (error) {
      logger.error(error instanceof Error ? error.message : "Verification failed");
      res.status(StatusCodes.UNAUTHORIZED);
      res.json(null);
    }
  }
};
