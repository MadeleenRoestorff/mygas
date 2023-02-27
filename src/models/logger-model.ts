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

/* A type definition for the LogWriter interface - Write to .log files -- for development */
const FileLogWriter: LogWriter = {
  info(txt: string): void {
    fs.appendFileSync(
      path.resolve(process.cwd(), "logs/info.log"),
      `${txt} \n`
    );
  },
  debug(txt: string): void {
    fs.appendFileSync(
      path.resolve(process.cwd(), "logs/debug.log"),
      `${txt} \n`
    );
  },
  error(txt: string): void {
    fs.appendFileSync(
      path.resolve(process.cwd(), "logs/error.log"),
      `${txt} \n`
    );
  }
};

const url = process.env.SLACKURL || "";

/* A type definition for the LogWriter interface - Write to slack -- for production */
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

// "The Logger class writes log messages to a log writer, which is either a SlackLogWriter, a
// FileLogWriter, or a ConsoleLogWriter, depending on the value of the NODE_ENV environment variable."
// The Logger class has three public methods: info, debug, and error. Each of these methods calls the
// private method logMessage, which in turn calls the info, debug, or error method of the log writer
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
