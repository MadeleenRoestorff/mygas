"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Logger_instances, _Logger_logWriter, _Logger_logMessage;
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const ConsoleLogWriter = {
    info(txt) {
        fs_1.default.appendFileSync(path_1.default.resolve(process.cwd(), "logs/infotest.log"), `${txt} \n`);
    },
    debug(txt) {
        console.warn(txt);
    },
    error(txt) {
        fs_1.default.appendFileSync(path_1.default.resolve(process.cwd(), "logs/errortest.log"), `${txt} \n`);
    }
};
const FileLogWriter = {
    info(txt) {
        fs_1.default.appendFileSync(path_1.default.resolve(process.cwd(), "logs/info.log"), `${txt} \n`);
    },
    debug(txt) {
        fs_1.default.appendFileSync(path_1.default.resolve(process.cwd(), "logs/debug.log"), `${txt} \n`);
    },
    error(txt) {
        fs_1.default.appendFileSync(path_1.default.resolve(process.cwd(), "logs/error.log"), `${txt} \n`);
    }
};
const url = process.env.SLACKURL || "";
const SlackLogWriter = {
    info(txt) {
        axios_1.default.post(url, JSON.stringify({ text: txt }));
    },
    debug(_txt) {
    },
    error(txt) {
        axios_1.default.post(url, JSON.stringify({ text: txt }));
    }
};
class Logger {
    constructor() {
        _Logger_instances.add(this);
        _Logger_logWriter.set(this, SlackLogWriter);
        if (process.env.NODE_ENV === "dev") {
            __classPrivateFieldSet(this, _Logger_logWriter, FileLogWriter, "f");
        }
        else if (process.env.NODE_ENV === "test") {
            __classPrivateFieldSet(this, _Logger_logWriter, ConsoleLogWriter, "f");
        }
        else {
            __classPrivateFieldSet(this, _Logger_logWriter, SlackLogWriter, "f");
        }
    }
    info(message) {
        __classPrivateFieldGet(this, _Logger_instances, "m", _Logger_logMessage).call(this, "INFO", message);
    }
    debug(message) {
        __classPrivateFieldGet(this, _Logger_instances, "m", _Logger_logMessage).call(this, "DEBUG", message);
    }
    error(message) {
        __classPrivateFieldGet(this, _Logger_instances, "m", _Logger_logMessage).call(this, "ERROR", message);
    }
}
_Logger_logWriter = new WeakMap(), _Logger_instances = new WeakSet(), _Logger_logMessage = function _Logger_logMessage(level, message) {
    const timestamp = new Date().toUTCString();
    try {
        __classPrivateFieldGet(this, _Logger_logWriter, "f").info(`${level} [${timestamp}]: ${message}`);
        if (level === "DEBUG") {
            __classPrivateFieldGet(this, _Logger_logWriter, "f").debug(`[${timestamp}]: ${message}`);
        }
        if (level === "ERROR") {
            __classPrivateFieldGet(this, _Logger_logWriter, "f").error(`[${timestamp}]: ${message}`);
        }
    }
    catch (error) {
        console.error(error);
    }
};
exports.default = Logger;
