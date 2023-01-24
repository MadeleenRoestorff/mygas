import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import Gas from "./models/gas-models-old";
import { StatusCodes } from "http-status-codes";
import Logger from "./models/logger-model";

// Middleware
const router = Router();
router.use(bodyParser.json());
const logger = new Logger();

router.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`REQ: ${JSON.stringify(req.body)}, Type: ${req.method}, URL: ${req.originalUrl}`);

  //   Intercept response log it and then send it
  const response = res.send;
  res.send = (sendResponse) => {
    logger.info(`RES: ${sendResponse} ${res.statusCode}`);
    res.send = response;
    return res.send(sendResponse);
  };
  next();
});

router.get("/:id(\\d+)", (req: Request, res: Response) => {
  Gas.getGasInstance(Number(req.params.id))
    .then((gasInstance) => {
      res.json(gasInstance?.getFields());
    })
    .catch((error) => {
      logger.error(error.message);
      res.status(StatusCodes.BAD_REQUEST);
      res.json(null);
    });
});

router.get("/", (req: Request, res: Response) => {
  Gas.getGasList()
    .then((gasData) => {
      const fieldsList = gasData.map((gas) => gas.getFields());
      res.json(fieldsList);
    })
    .catch((error) => {
      logger.error(error.message);
      res.status(StatusCodes.BAD_REQUEST);
      res.json(null);
    });
});

type Units = {
  units: number;
  GasLogID?: number;
};
type SaveGasCallBack = (_units: Units) => void;

const parseBody = (req: Request, res: Response, saveGas: SaveGasCallBack): void | Error => {
  if (req.body && Object.keys(req.body).length !== 0) {
    if (typeof req.body?.units === "number" && req.body?.units >= 0) {
      // I am in CONTROL of the payload
      saveGas({ units: req.body.units });
    } else {
      res.status(StatusCodes.NOT_ACCEPTABLE);
      throw new Error("Wrong Resquest Body Sent");
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("No Request Body Sent");
  }
};

router.post("/", (req: Request, res: Response) => {
  try {
    parseBody(req, res, (body) => {
      console.log(body);
      const addNewGas = new Gas(body);
      addNewGas
        .save()
        .then((response) => {
          const tempGasCopy = { ...addNewGas.getFields() };
          tempGasCopy.GasLogID = Number(response);
          res.json(tempGasCopy);
        })
        .catch((error) => {
          logger.error(error.message);
          res.status(StatusCodes.NOT_ACCEPTABLE);
          res.json(null);
        });
    });
  } catch (error) {
    logger.error(error instanceof Error ? error.message : "Incorrect Body");
    res.json(null);
  }
});

router.put("/:id(\\d+)", (req, res) => {
  parseBody(req, res, (body) => {
    const gasLodID = Number(req.params.id);
    if (gasLodID > 0) {
      const tempGasBodyCopy = { ...body };
      tempGasBodyCopy.GasLogID = gasLodID;
      const updateGas = new Gas(tempGasBodyCopy);
      updateGas
        .save()
        .then(() => {
          res.json(updateGas.getFields());
        })
        .catch((error) => {
          logger.error(error.message);
          res.status(StatusCodes.NOT_ACCEPTABLE);
          res.json(null);
        });
    } else {
      logger.error("ID is smaller than 0");
      res.status(StatusCodes.NOT_ACCEPTABLE);
      res.json(null);
    }
  });
});

export default router;
