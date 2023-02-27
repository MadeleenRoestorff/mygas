import fs from "fs";
import path from "path";

/**
 * If the logs directory doesn't exist, create it
 */
export const createLogsDirIf = () => {
  if (!fs.existsSync(path.resolve(process.cwd(), "logs"))) {
    fs.mkdirSync("logs", { recursive: true });
  }
};
