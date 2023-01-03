import fs from "fs";
import path from "path";

export const createLogsDirIf = () => {
  if (fs.existsSync(path.resolve(process.cwd(), "logs"))) {
    console.log("Log path exists.");
  } else {
    fs.mkdirSync("logs", { recursive: true });
  }
};
