/**
 * User mangement functions:
 *  - insertSaltedHashedUserInDB
 *  - authenticateUser
 *  - restrict
 *
 */

import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt, { verify } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import "dotenv/config";
import User from "../models/user-model";
import Logger from "../models/logger-model";

const logger = new Logger();
// everything should just break if we can't import env vars
const secret = process.env.SECRETJT;

const iterations = 99999;
const keyLen = 64;
const digest = "sha256";

/**
 * It takes a username and password, creates a random salt, hashes the password with the salt, and then
 * inserts the username, salt, and hashed password into the database
 * @param {string} name - the username of the user
 * @param {string} password - the password that the user entered
 * @returns A new user object
 */
export const insertSaltedHashedUserInDB = async (
  name: string,
  password: string
) => {
  const psLen = 6;
  if (password.length < psLen) throw Error("Password require 6 characters");

  const salted = crypto.randomBytes(keyLen).toString("base64");
  const hashBuffer = crypto.pbkdf2Sync(
    password,
    salted,
    iterations,
    keyLen,
    digest
  );
  const newUser = await User.create({
    username: name,
    salt: salted,
    hash: hashBuffer.toString("base64")
  });

  return newUser;
};

type ErrorTokenCallback = (_error: Error | null, _token: string | null) => void;

/**
 * It takes a username and password, queries the database for the user's salt and hash.
 * Calcultates  anew hash from password and salt using NODE crypto, then compares
 * the nw calculated hash with the hash in the database. If they match, it generates a
 * token and returns it
 * @param {string} name - the username of the user
 * @param {string} password - the password the user entered
 * @param {ErrorTokenCallback} errToken - callback with error or token
 * @returns A function that takes in a name, password, and errToken.
 */

export const authenticateUser = async (
  name: string,
  password: string,
  errToken: ErrorTokenCallback
): Promise<void> => {
  // query the db for the given username
  const userSaltHash = await User.findOne({
    where: {
      username: name
    }
  });

  if (userSaltHash?.salt && userSaltHash?.hash) {
    const hashBuffer = crypto.pbkdf2Sync(
      password,
      userSaltHash?.salt,
      iterations,
      keyLen,
      digest
    );

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

/**
 * Restrict content
 * Restrict is a type of middleware that requires
 * verification before content can be accessed
 * Token in request header is extracted
 * and verified with jwt verify function.
 * If the token is valid, then call the next
 * function in the middleware chain. Otherwise,
 * return a 401 Unauthorized response
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - the response object
 * @param {NextFunction} next - This is a function that you call when you want to pass control to the
 * next middleware function in the stack.
 */
export const restrict = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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
      logger.error(
        error instanceof Error ? error.message : "Verification failed"
      );
      res.status(StatusCodes.UNAUTHORIZED);
      res.json(null);
    }
  }
};
