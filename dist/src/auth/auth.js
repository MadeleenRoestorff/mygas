"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.restrict = exports.authenticateUser = exports.insertSaltedHashedUserInDB = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
require("dotenv/config");
const user_model_1 = __importDefault(require("../models/user-model"));
const logger_model_1 = __importDefault(require("../models/logger-model"));
const logger = new logger_model_1.default();
const secret = process.env.SECRETJT;
const iterations = 99999;
const keyLen = 64;
const digest = "sha256";
const insertSaltedHashedUserInDB = (name, password) => __awaiter(void 0, void 0, void 0, function* () {
    const psLen = 6;
    if (password.length < psLen)
        throw Error("Password require 6 characters");
    const salted = crypto_1.default.randomBytes(keyLen).toString("base64");
    const hashBuffer = crypto_1.default.pbkdf2Sync(password, salted, iterations, keyLen, digest);
    const newUser = yield user_model_1.default.create({
        username: name,
        salt: salted,
        hash: hashBuffer.toString("base64")
    });
    return newUser;
});
exports.insertSaltedHashedUserInDB = insertSaltedHashedUserInDB;
const authenticateUser = (name, password, errToken) => __awaiter(void 0, void 0, void 0, function* () {
    const userSaltHash = yield user_model_1.default.findOne({
        where: {
            username: name
        }
    });
    if ((userSaltHash === null || userSaltHash === void 0 ? void 0 : userSaltHash.salt) && (userSaltHash === null || userSaltHash === void 0 ? void 0 : userSaltHash.hash)) {
        const hashBuffer = crypto_1.default.pbkdf2Sync(password, userSaltHash === null || userSaltHash === void 0 ? void 0 : userSaltHash.salt, iterations, keyLen, digest);
        if (hashBuffer.toString("base64") === (userSaltHash === null || userSaltHash === void 0 ? void 0 : userSaltHash.hash) && secret) {
            const token = jsonwebtoken_1.default.sign({ username: name }, secret, {
                expiresIn: "24h"
            });
            return errToken(null, token);
        }
        logger.error("Wrong Password");
        return errToken(new Error("Wrong Password"), null);
    }
    logger.error(`Cannot find Username: ${name}`);
    return errToken(new Error(`Cannot find Username: ${name}`), null);
});
exports.authenticateUser = authenticateUser;
const restrict = (req, res, next) => {
    var _a, _b;
    const authHeader = req.headers.authorization;
    const token = ((_b = (_a = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split) === null || _a === void 0 ? void 0 : _a.call(authHeader, " ")) === null || _b === void 0 ? void 0 : _b[1]) || null;
    if (!token || !secret) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED);
        res.json(null);
    }
    else {
        try {
            const isVerified = (0, jsonwebtoken_1.verify)(token, secret);
            if (isVerified) {
                next();
            }
            else {
                throw new Error("Verification failed");
            }
        }
        catch (error) {
            logger.error(error instanceof Error ? error.message : "Verification failed");
            res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED);
            res.json(null);
        }
    }
};
exports.restrict = restrict;
