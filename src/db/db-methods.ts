import Gas from "../models/gas-model";
import User from "../models/user-model";

// creates tables if it doesn't exist
export const dbSetup = async () => {
  await Gas.sync();
  await User.sync();
};

// Drop tables
export const dbClear = async () => {
  await Gas.drop();
  await User.drop();
};
