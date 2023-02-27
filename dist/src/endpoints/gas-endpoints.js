"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const body_parser_1 = __importDefault(require("body-parser"));
const gas_model_1 = __importDefault(require("../models/gas-model"));
const endpoints_help_1 = require("./endpoints-help");
const router = (0, express_1.Router)();
router.use(body_parser_1.default.json());
router.use(endpoints_help_1.logEndpointsApiRequest);
const bodyCheck = (req, res, next) => {
    if (typeof req.body.units === "number" ||
        typeof req.body.topup === "number" ||
        Date.parse(req.body.measuredAt) >= 0) {
        next();
    }
    else {
        (0, endpoints_help_1.handleError)(res, "Incorrect gas request Body");
    }
};
router.get("/:id(\\d+)", (req, res) => {
    (0, endpoints_help_1.methodRunner)(res, () => gas_model_1.default.getGasInstance(Number(req.params.id)));
});
router.get("/", (req, res) => {
    (0, endpoints_help_1.methodRunner)(res, () => gas_model_1.default.findAll());
});
router.post("/", bodyCheck, (req, res) => {
    if (!req.body.measuredAt)
        req.body.measuredAt = new Date();
    if (!req.body.topup && req.body.units)
        req.body.topup = 0;
    if (!req.body.units && req.body.topup)
        req.body.units = 0;
    (0, endpoints_help_1.methodRunner)(res, () => gas_model_1.default.create(req.body));
});
router.put("/:id(\\d+)", bodyCheck, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updateResult = yield gas_model_1.default.update(req.body, {
            where: {
                GasLogID: Number(req.params.id)
            }
        });
        if (updateResult[0] === 0)
            throw Error("Cannot find ID");
        (0, endpoints_help_1.methodRunner)(res, () => gas_model_1.default.getGasInstance(Number(req.params.id)));
    }
    catch (error) {
        (0, endpoints_help_1.handleError)(res, error instanceof Error ? error.message : "Incorrect Body");
    }
}));
exports.default = router;
