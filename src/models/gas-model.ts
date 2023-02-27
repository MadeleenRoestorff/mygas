import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";
import Logger from "./logger-model";
import "dotenv/config";

// everything should just break if we can't import env vars
const dataBase = process.env.DATABASE || "no-db";
const logger = new Logger();

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dataBase,
  logging: (msg: string) => logger.info(msg)
});

class Gas extends Model<InferAttributes<Gas>, InferCreationAttributes<Gas>> {
  declare GasLogID: CreationOptional<number>;
  declare units: number;
  declare topup: number;
  declare uuid: CreationOptional<string>;
  declare measuredAt: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static async getGasInstance(gasId: number) {
    const gasInstance = await Gas.findOne({
      where: {
        GasLogID: gasId
      }
    });
    if (gasInstance === null) throw Error("Cannot find ID");
    return gasInstance;
  }
}

Gas.init(
  {
    GasLogID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    units: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isNumeric: true,
        min: 0
      }
    },
    topup: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isNumeric: true,
        min: 0
      }
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    measuredAt: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    modelName: "Gas"
  }
);

export default Gas;
