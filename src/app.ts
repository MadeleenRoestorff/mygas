/* eslint-disable no-magic-numbers */
import express, { Application, Request, Response } from "express";
import path from "path";
import { restrict } from "../src/auth/auth";
// import login from "";
import gasEndpoint from "./endpoints";
import { StatusCodes } from "http-status-codes";

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware

// app.use("/login", login);
app.use("/gas", restrict, gasEndpoint);

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
  res.status(StatusCodes.OK);
});

export default app;
