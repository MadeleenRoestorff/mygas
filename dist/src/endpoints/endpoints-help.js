"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodRunner = exports.handleError = exports.logEndpointsApiRequest = void 0;
const logger_model_1 = __importDefault(require("../models/logger-model"));
const http_status_codes_1 = require("http-status-codes");
const logger = new logger_model_1.default();
const logEndpointsApiRequest = (req, res, next) => {
    logger.info(`REQ: ${JSON.stringify(req.body)}, Type: ${req.method}, URL: ${req.originalUrl}`);
    const response = res.send;
    res.send = (sendResponse) => {
        const regexPattern = /"uuid"+[^"]+"+[^"]+",*|"createdAt"\s*:\s*"[^"]+",*|"updatedAt"\s*:\s*"[^"]+",*|.\d\d\dZ/g;
        logger.info(`RES: ${sendResponse.replace(regexPattern, "")} ${res.statusCode}`);
        res.send = response;
        return res.send(sendResponse);
    };
    next();
};
exports.logEndpointsApiRequest = logEndpointsApiRequest;
const handleError = (res, message = "server error", statusCodes = http_status_codes_1.StatusCodes.NOT_ACCEPTABLE) => {
    logger.error(message);
    res.status(statusCodes);
    res.json(message);
};
exports.handleError = handleError;
const methodRunner = (res, method) => {
    method()
        .then((response) => {
        res.json(response);
    })
        .catch((error) => {
        (0, exports.handleError)(res, error.message);
    });
};
exports.methodRunner = methodRunner;
