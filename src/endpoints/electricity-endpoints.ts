import { Router, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import Electricity from "../models/electricity-model";
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
 * If the request body contains a number for electricity and a valid date for measuredAt, then call the
 * next function
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - this is the response object that will be sent back to the client.
 * @param {NextFunction} next - A function to call when the middleware is complete.
 */
const bodyCheck = (req: Request, res: Response, next: NextFunction) => {
  if (
    typeof req.body.electricity === "number" ||
    Date.parse(req.body.measuredAt) >= 0
  ) {
    next();
  } else {
    handleError(res, "Incorrect electricity request Body");
  }
};

// This is a route that will be called when the client makes a GET request to the server with a URL
// that matches the pattern "/electricity:id(\d+)". The ":id" part of the URL is a parameter that will be
// passed to the function as req.params.id. The "\d+" part of the URL is a regular expression that will be
// used to validate the parameter. The function will call the methodRunner function with the response
// object and a function that will return the Electricity instance with the ID that matches the
// parameter.
router.get("/:id(\\d+)", (req: Request, res: Response) => {
  methodRunner(res, () => Electricity.getElecInstance(Number(req.params.id)));
});

// This is a route that will be called when the client makes a GET request to the server with a URL
// that matches the pattern "/electricity". The function will call the methodRunner function with the
// response object and a function that will return all the Electricity instances.
router.get("/", (req: Request, res: Response) => {
  methodRunner(res, () => {
    return Electricity.findAll({ order: [["measuredAt", "DESC"]] });
  });
});

// A route that will be called when the client makes a POST request to the server with a URL
// that matches the pattern "/electricity". The function will call the methodRunner function
// with the response object and a function that will create a new Electricity instance with
// the data in the request body.
router.post("/", bodyCheck, (req: Request, res: Response) => {
  if (!req.body.measuredAt) req.body.measuredAt = new Date();
  methodRunner(res, () => Electricity.create(req.body));
});

// This is a route that will be called when the client makes a PATCH request to the server with a URL
// that matches the pattern "/electricity:id(\d+)". The ":id" part of the URL is a parameter that will
// be passed to the function as req.params.id. The "\d+" part of the URL is a regular expression that will
// be used to validate the parameter. The function will call the methodRunner function with the response
// object and a function that will return the Electricity instance with the ID that matches the
// parameter.
router.patch("/:id(\\d+)", bodyCheck, async (req: Request, res: Response) => {
  try {
    const updateResult = await Electricity.update(req.body, {
      where: {
        ElecLogID: Number(req.params.id)
      }
    });
    // update returns 0 if update method did not make any changes
    // Assume it is because it cannot find the ID
    if (updateResult[0] === 0) throw Error("Cannot find ID");

    // If update succeeded try to get the Electricity instance
    methodRunner(res, () => Electricity.getElecInstance(Number(req.params.id)));
  } catch (error) {
    handleError(res, error instanceof Error ? error.message : "Incorrect Body");
  }
});

export default router;
