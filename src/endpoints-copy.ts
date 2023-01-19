import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { StatusCodes } from "http-status-codes";
import Logger from "./models/logger-model";
import Gas from "./models/gas-model";

// Middleware
const router = Router();
router.use(bodyParser.json());
const logger = new Logger();

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

const bodyCheck = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    logger.error("No Request Body Sent");
    res.status(StatusCodes.BAD_REQUEST);
    res.json("No Request Body Sent");
  } else {
    next();
  }
};

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
    if (updateResult[0] === 0) throw Error("Cannot find ID");
    gasMethodRunner(res, () => Gas.getGasInstance(Number(req.params.id)));
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Incorrect Body";
    logger.error(errMessage);
    res.status(StatusCodes.NOT_ACCEPTABLE);
    res.json(errMessage);
  }
});

export default router;
