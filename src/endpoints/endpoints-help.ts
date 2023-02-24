import { Request, Response, NextFunction } from "express";
import Logger from "../models/logger-model";
import { StatusCodes } from "http-status-codes";
import Electricity from "../models/electricity-model";
import Gas from "../models/gas-model";

const logger = new Logger();

/**
 * It intercepts the request and response, logs the request and response, and then sends the response
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - The response object
 * @param {NextFunction} next - This is a function that you call when you want to move to the next
 * middleware.
 */
export const logEndpointsApiRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(
    `REQ: ${JSON.stringify(req.body)}, Type: ${req.method}, URL: ${
      req.originalUrl
    }`
  );
  // Intercept response log it and then send it
  const response = res.send;
  res.send = (sendResponse) => {
    logger.info(`RES: ${sendResponse} ${res.statusCode}`);
    res.send = response;
    return res.send(sendResponse);
  };
  next();
};

/**
 * It takes a response object, a error message, and a status code, and then logs the error, sets the status
 * code, and sends the eroor message back to the client
 * @param {Response} res - Response - this is the response object that we get from the express server.
 * @param [message=server error] - The message to be sent to the client.
 * @param statusCodes - The HTTP status code to return.
 */
export const handleError = (
  res: Response,
  message = "server error",
  statusCodes = StatusCodes.NOT_ACCEPTABLE
) => {
  logger.error(message);
  res.status(statusCodes);
  res.json(message);
};

/**
 * It takes a response object and a method (function) that returns a promise,
 * and then runs the method on the Electricity or Gas model class and sends
 * the response to the client.
 * Also catches errors and logs the errors
 * @param {Response} res - Response - this is the response object that we're going to send back to the
 * client.
 * @param method - () => Promise<Electricity[] | Electricity | Gas[] | Gas>
 */
export const methodRunner = (
  res: Response,
  method: () => Promise<Electricity[] | Electricity | Gas[] | Gas>
): void => {
  method()
    .then((response) => {
      res.json(response);
    })
    .catch((error: Error) => {
      handleError(res, error.message);
    });
};
