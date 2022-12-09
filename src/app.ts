/* eslint-disable no-magic-numbers */
import express, { Application, Request, Response } from "express";
import "dotenv/config";

const app: Application = express();

app.get("/", (req: Request, res: Response) => {
  res.send("hello");

  console.log(process.env.MYNAME);
  console.log(process.env.DATABASE);
});

const PORT = 3000;
app.listen(PORT, () => console.log("Server running"));
