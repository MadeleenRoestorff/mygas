"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
require("dotenv/config");
const logger_model_1 = __importDefault(require("./logger-model"));
const logger = new logger_model_1.default();
const dataBase = process.env.DATABASE || "no-db";
const sequelize = new sequelize_1.Sequelize({
    dialect: "sqlite",
    storage: dataBase,
    logging: (msg) => logger.error(msg)
});
class User extends sequelize_1.Model {
}
User.init({
    PersonID: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    hash: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    uuid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, {
    sequelize,
    modelName: "User"
});
exports.default = User;
