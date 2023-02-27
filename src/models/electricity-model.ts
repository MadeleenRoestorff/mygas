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
  logging: (msg: string) => logger.error(msg)
});

class Electricity extends Model<
  InferAttributes<Electricity>,
  InferCreationAttributes<Electricity>
> {
  declare ElecLogID: CreationOptional<number>;
  declare electricity: number;
  declare uuid: CreationOptional<string>;
  declare measuredAt: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static async getElecInstance(elecId: number) {
    const elecInstance = await Electricity.findOne({
      where: {
        ElecLogID: elecId
      }
    });
    if (elecInstance === null) throw Error("Cannot find ID");
    return elecInstance;
  }
}

Electricity.init(
  {
    ElecLogID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    electricity: {
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
    modelName: "Electricity"
  }
);

export default Electricity;
