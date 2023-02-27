"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./auth/auth");
const login_1 = __importDefault(require("./auth/login"));
const gas_endpoints_1 = __importDefault(require("./endpoints/gas-endpoints"));
const electricity_endpoints_1 = __importDefault(require("./endpoints/electricity-endpoints"));
const http_status_codes_1 = require("http-status-codes");
require("dotenv/config");
const utils_1 = require("./utils/utils");
(0, utils_1.createLogsDirIf)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use("/login", login_1.default);
app.use("/gas", auth_1.restrict, gas_endpoints_1.default);
app.use("/electricity", auth_1.restrict, electricity_endpoints_1.default);
app.get("/", (req, res) => {
    res.send("hello");
    res.status(http_status_codes_1.StatusCodes.OK);
});
if (process.env.NODE_ENV !== "test") {
    app.listen(process.env.PORT, () => {
        console.log(`Express started on port ${process.env.PORT}`);
    });
}
exports.default = app;
