import express, { Application, Request, Response } from "express";
import cors from "cors";
import { restrict } from "./auth/auth";
import login from "./auth/login";
import gasEndpoint from "./endpoints/gas-endpoints";
import elecEndpoint from "./endpoints/electricity-endpoints";
import { StatusCodes } from "http-status-codes";
import "dotenv/config";
import { createLogsDirIf } from "./utils/utils";

createLogsDirIf();

const app: Application = express();
app.use(cors());
// middleware

app.use("/login", login);
app.use("/gas", restrict, gasEndpoint);
app.use("/electricity", restrict, elecEndpoint);

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
  res.status(StatusCodes.OK);
});

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.PORT, () => {
    console.log(`Express started on port ${process.env.PORT}`);
  });
}

export default app;
