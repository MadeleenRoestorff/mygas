import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { StatusCodes } from "http-status-codes";
import Logger from "./models/logger-model";
import Gas from "./models/gas-model";

// Middleware
const router = Router();
router.use(bodyParser.json());
const logger = new Logger();

// Logging API request
router.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`REQ: ${JSON.stringify(req.body)}, Type: ${req.method}, URL: ${req.originalUrl}`);

  // Intercept response log it and then send it
  const response = res.send;
  res.send = (sendResponse) => {
    logger.info(`RES: ${sendResponse} ${res.statusCode}`);
    res.send = response;
    return res.send(sendResponse);
  };
  next();
});

// Check that request body is present and if units is a number
const bodyCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || Object.keys(req.body).length === 0 || !req.body.units) {
    logger.error("No Request Body Sent");
    res.status(StatusCodes.NOT_ACCEPTABLE);
    res.json("No Request Body Sent");
  } else if (typeof req.body.units === "number") {
    next();
  } else {
    logger.error("Incorrect gas Units");
    res.status(StatusCodes.NOT_ACCEPTABLE);
    res.json("Incorrect gas Units");
  }
};

// gasMethodRunner runs the selected method on the gas model class
// then sends the response
// also catches errors and logs the errors
const gasMethodRunner = (res: Response, gasMethod: () => Promise<Gas[] | Gas>): void => {
  gasMethod()
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      logger.error(error.message);
      res.status(StatusCodes.NOT_ACCEPTABLE);
      res.json(error.message);
    });
};

router.get("/:id(\\d+)", (req: Request, res: Response) => {
  gasMethodRunner(res, () => Gas.getGasInstance(Number(req.params.id)));
});

router.get("/", (req: Request, res: Response) => {
  gasMethodRunner(res, () => Gas.findAll());
});

router.post("/", bodyCheck, (req: Request, res: Response) => {
  gasMethodRunner(res, () => Gas.create({ units: req.body.units }));
});

router.put("/:id(\\d+)", bodyCheck, async (req: Request, res: Response) => {
  try {
    const updateResult = await Gas.update(
      { units: req.body.units },
      {
        where: {
          GasLogID: Number(req.params.id)
        }
      }
    );
    // update returns 0 if update method did not make any changes
    // Assume it is because it cannot find the ID
    if (updateResult[0] === 0) throw Error("Cannot find ID");

    // If update succeeded try to get the gas instance
    gasMethodRunner(res, () => Gas.getGasInstance(Number(req.params.id)));
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Incorrect Body";
    logger.error(errMessage);
    res.status(StatusCodes.NOT_ACCEPTABLE);
    res.json(errMessage);
  }
});

export default router;
