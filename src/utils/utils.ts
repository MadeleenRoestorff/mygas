import fs from "fs";
import path from "path";

export const createLogsDirIf = () => {
  if (!fs.existsSync(path.resolve(process.cwd(), "logs"))) {
    fs.mkdirSync("logs", { recursive: true });
  }
};
