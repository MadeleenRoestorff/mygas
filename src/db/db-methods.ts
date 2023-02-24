import Gas from "../models/gas-model";
import Electricity from "../models/electricity-model";
import User from "../models/user-model";

// creates tables if it doesn't exist
export const dbSetup = async () => {
  await Gas.sync();
  await Electricity.sync();
  await User.sync();
};

// Drop tables
export const dbClear = async () => {
  await Gas.drop();
  await Electricity.drop();
  await User.drop();
};
