"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogsDirIf = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const createLogsDirIf = () => {
    if (!fs_1.default.existsSync(path_1.default.resolve(process.cwd(), "logs"))) {
        fs_1.default.mkdirSync("logs", { recursive: true });
    }
};
exports.createLogsDirIf = createLogsDirIf;
