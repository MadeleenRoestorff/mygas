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
import User from "../models/user-model";
import "dotenv/config";

const logger = new Logger();
// everything should just break if we can't import env vars
const secret = process.env.SECRETJT;
const iterations = Number(process.env.ITERATIONS) || 0;
const keyLen = Number(process.env.KEYLENGTH) || 0;
const digest = process.env.DIGEST || "";

export const insertSaltedHashedUserInDB = async (name: string, password: string) => {
  /**
   * Inserts a user into the DB.
   * Passwords are hashed and salted
   *
   * @param {string} name: user name
   * @param {string} password: user password
   */

  const salted = crypto.randomBytes(keyLen).toString("base64");
  const hashBuffer = crypto.pbkdf2Sync(password, salted, iterations, keyLen, digest);
  const newUser = await User.create({
    username: name,
    salt: salted,
    hash: hashBuffer.toString("base64")
  });
  return newUser;
};

type ErrorTokenCallback = (_error: Error | null, _token: string | null) => void;

export const authenticateUser = async (
  name: string,
  password: string,
  errToken: ErrorTokenCallback
) => {
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

  const userSaltHash = await User.findOne({
    where: {
      username: name
    }
  });

  if (userSaltHash?.salt && userSaltHash?.hash) {
    const hashBuffer = crypto.pbkdf2Sync(password, userSaltHash?.salt, iterations, keyLen, digest);

    if (hashBuffer.toString("base64") === userSaltHash?.hash && secret) {
      // generate token
      const token = jwt.sign({ username: name }, secret, {
        expiresIn: "24h"
      });
      return errToken(null, token);
    }

    logger.error("Wrong Password");
    return errToken(new Error("Wrong Password"), null);
  }
  logger.error(`Cannot find Username: ${name}`);
  return errToken(new Error(`Cannot find Username: ${name}`), null);
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
