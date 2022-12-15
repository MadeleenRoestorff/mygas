"use strict";
import { Router, Request, Response } from "express";
import bodyParser from "body-parser";
import Gas from "./models/gas-models";
import { StatusCodes } from "http-status-codes";

// Middleware
const router = Router();
router.use(bodyParser.json());

router.get("/:id(\\d+)", (req: Request, res: Response) => {
  Gas.getGasInstance(Number(req.params.id))
    .then((gasInstance) => {
      res.json(gasInstance?.getFields());
    })
    .catch(() => {
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
    .catch(() => {
      res.status(StatusCodes.BAD_REQUEST);
      res.json(null);
    });
});

type Units = {
  units: number;
  GasLogID?: number;
};
type SaveGasCallBack = (_units: Units) => void;

const parseBody = (req: Request, res: Response, saveGas: SaveGasCallBack) => {
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
  parseBody(req, res, (body) => {
    const addNewGas = new Gas(body);
    addNewGas
      .save()
      .then((response) => {
        if (response) {
          const tempGasCopy = { ...addNewGas.getFields() };
          tempGasCopy.GasLogID = Number(response);
          res.json(tempGasCopy);
        } else {
          res.status(StatusCodes.NOT_ACCEPTABLE);
          res.json(null);
        }
      })
      .catch(() => {
        res.status(StatusCodes.NOT_ACCEPTABLE);
        res.json(null);
      });
  });
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
        .catch(() => {
          res.status(StatusCodes.NOT_ACCEPTABLE);
          res.json(null);
        });
    } else {
      res.status(StatusCodes.NOT_ACCEPTABLE);
      res.json(null);
    }
  });
});

export default router;
