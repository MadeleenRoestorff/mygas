import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import Gas from "../models/gas-model";
import {
  logEndpointsApiRequest,
  handleError,
  methodRunner
} from "./endpoints-help";

// Middleware
const router = Router();
router.use(bodyParser.json());
router.use(logEndpointsApiRequest);

/**
 * If the request body contains a number for units, topup, and a valid date, then continue to the next
 * function
 * @param {Request} req - Request - the request object
 * @param {Response} res - Response - the response object
 * @param {NextFunction} next - A function to be called to invoke the next middleware function in the
 * stack.
 */
const bodyCheck = (req: Request, res: Response, next: NextFunction) => {
  if (
    typeof req.body.units === "number" ||
    typeof req.body.topup === "number" ||
    Date.parse(req.body.measuredAt) >= 0
  ) {
    next();
  } else {
    handleError(res, "Incorrect gas request Body");
  }
};

/* This is a route that is used to get a single gas instance. */
router.get("/:id(\\d+)", (req: Request, res: Response) => {
  methodRunner(res, () => Gas.getGasInstance(Number(req.params.id)));
});

/* This is a route that is used to get all gas instances. */
router.get("/", (req: Request, res: Response) => {
  methodRunner(res, () => Gas.findAll());
});

/* A post request that is used to create a new gas instance. */
router.post("/", bodyCheck, (req: Request, res: Response) => {
  if (!req.body.measuredAt) req.body.measuredAt = new Date();
  if (!req.body.topup && req.body.units) req.body.topup = 0;
  if (!req.body.units && req.body.topup) req.body.units = 0;
  methodRunner(res, () => Gas.create(req.body));
});

/* A route that is used to update a gas instance. */
router.patch("/:id(\\d+)", bodyCheck, async (req: Request, res: Response) => {
  try {
    const updateResult = await Gas.update(req.body, {
      where: {
        GasLogID: Number(req.params.id)
      }
    });
    // update returns 0 if update method did not make any changes
    // Assume it is because it cannot find the ID
    if (updateResult[0] === 0) throw Error("Cannot find ID");

    // If update succeeded try to get the gas instance
    methodRunner(res, () => Gas.getGasInstance(Number(req.params.id)));
  } catch (error) {
    handleError(res, error instanceof Error ? error.message : "Incorrect Body");
  }
});

export default router;
