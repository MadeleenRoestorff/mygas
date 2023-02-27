import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import "dotenv/config";
import Logger from "./logger-model";

const logger = new Logger();
const dataBase = process.env.DATABASE || "no-db";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dataBase,
  logging: (msg: string) => logger.info(msg)
});

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare PersonID: CreationOptional<number>;
  declare username: string;
  declare salt: CreationOptional<string>;
  declare hash: string;
  declare uuid: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    PersonID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    salt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: "User"
  }
);

export default User;
