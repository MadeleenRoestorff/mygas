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
const sequelize_1 = require("sequelize");
const logger_model_1 = __importDefault(require("./logger-model"));
require("dotenv/config");
const dataBase = process.env.DATABASE || "no-db";
const logger = new logger_model_1.default();
const sequelize = new sequelize_1.Sequelize({
    dialect: "sqlite",
    storage: dataBase,
    logging: (msg) => logger.error(msg)
});
class Electricity extends sequelize_1.Model {
    static getElecInstance(elecId) {
        return __awaiter(this, void 0, void 0, function* () {
            const elecInstance = yield Electricity.findOne({
                where: {
                    ElecLogID: elecId
                }
            });
            if (elecInstance === null)
                throw Error("Cannot find ID");
            return elecInstance;
        });
    }
}
Electricity.init({
    ElecLogID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    electricity: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            isNumeric: true,
            min: 0
        }
    },
    uuid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    measuredAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true
        }
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, {
    sequelize,
    modelName: "Electricity"
});
exports.default = Electricity;
