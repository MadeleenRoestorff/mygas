import { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import { StatusCodes } from "http-status-codes";
import Logger from "../models/logger-model";
import { authenticateUser } from "./auth";

// Middleware
const router = Router();
router.use(bodyParser.json());
const logger = new Logger();

router.post("/", async (req: Request, res: Response) => {
  await authenticateUser(
    req.body.username,
    req.body.password,
    (error, token) => {
      logger.info(
        `REQ: ${JSON.stringify(req.body.username)}, Type: ${req.method}, URL: ${
          req.originalUrl
        }`
      );
      if (error) {
        logger.error(error.message);
      }
      if (token) {
        logger.info(`${req.body.username} successfully Logged in`);
        res.json(token);
      } else {
        logger.error(`${req.body.username} could not login`);
        res.status(StatusCodes.UNAUTHORIZED);
        res.json(null);
      }
    }
  ).catch((error) => {
    logger.error(error.message);
    res.status(StatusCodes.UNAUTHORIZED);
    res.json(null);
  });
});

export default router;
