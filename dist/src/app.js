"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const auth_1 = require("../src/auth/auth");
const endpoints_1 = __importDefault(require("./endpoints"));
const http_status_codes_1 = require("http-status-codes");
const app = (0, express_1.default)();
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "views"));
app.use("/gas", auth_1.restrict, endpoints_1.default);
app.get("/", (req, res) => {
    res.send("hello");
    res.status(http_status_codes_1.StatusCodes.OK);
});
exports.default = app;
