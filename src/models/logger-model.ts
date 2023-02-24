import axios from "axios";
import fs from "fs";
import path from "path";
import "dotenv/config";

type LogWriter = {
  info(_txt: string): void;
  debug(_txt: string): void;
  error(_txt: string): void;
};

// Write to console (terminal) -- for tests
// const ConsoleLogWriter: LogWriter = {
//   info(txt: string): void {
//     console.log(txt);
//   },
//   debug(txt: string): void {
//     console.warn(txt);
//   },
//   error(txt: string): void {
//     console.error(txt);
//   }
// };

// Write to txt files -- for development
const FileLogWriter: LogWriter = {
  info(txt: string): void {
    fs.appendFileSync(
      path.resolve(process.cwd(), "logs/info.txt"),
      `${txt} \n`
    );
  },
  debug(txt: string): void {
    fs.appendFileSync(
      path.resolve(process.cwd(), "logs/debug.txt"),
      `${txt} \n`
    );
  },
  error(txt: string): void {
    fs.appendFileSync(
      path.resolve(process.cwd(), "logs/error.txt"),
      `${txt} \n`
    );
  }
};

const url = process.env.SLACKURL || "";

// Write to slack -- for production
const SlackLogWriter: LogWriter = {
  info(txt: string): void {
    axios.post(url, JSON.stringify({ text: txt }));
  },
  debug(_txt: string): void {
    // do nothing
  },
  error(txt: string): void {
    axios.post(url, txt);
  }
};

class Logger {
  // Assume production
  #logWriter = SlackLogWriter;

  constructor() {
    if (process.env.NODE_ENV === "dev") {
      this.#logWriter = FileLogWriter;
    } else if (process.env.NODE_ENV === "test") {
      //   this.#logWriter = ConsoleLogWriter;
      this.#logWriter = FileLogWriter;
    }
  }

  info(message: string): void {
    this.#logMessage("INFO", message);
  }
  debug(message: string): void {
    this.#logMessage("DEBUG", message);
  }
  error(message: string): void {
    this.#logMessage("ERROR", message);
  }

  #logMessage(level: string, message: string): void {
    const timestamp = new Date().toISOString();
    this.#logWriter.info(`${level} [${timestamp}]: ${message}`);
    if (level === "DEBUG") {
      this.#logWriter.debug(`[${timestamp}]: ${message}`);
    }
    if (level === "ERROR") {
      this.#logWriter.error(`[${timestamp}]: ${message}`);
    }
  }
}

export default Logger;
