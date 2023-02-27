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
const http_status_codes_1 = require("http-status-codes");
const logger_model_1 = __importDefault(require("../models/logger-model"));
const auth_1 = require("./auth");
const router = (0, express_1.Router)();
router.use(body_parser_1.default.json());
const logger = new logger_model_1.default();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, auth_1.authenticateUser)(req.body.username, req.body.password, (error, token) => {
        logger.info(`REQ: ${JSON.stringify(req.body.username)}, Type: ${req.method}, URL: ${req.originalUrl}`);
        if (error) {
            logger.error(error.message);
        }
        if (token) {
            logger.info(`${req.body.username} successfully Logged in`);
            res.json(token);
        }
        else {
            logger.error(`${req.body.username} could not login`);
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED);
            res.json(null);
        }
    }).catch((error) => {
        logger.error(error.message);
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        res.json(null);
    });
}));
exports.default = router;
