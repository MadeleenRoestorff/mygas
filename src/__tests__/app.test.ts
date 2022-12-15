import app from "../app";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { describe, it } from "@jest/globals";

describe("Basic App/Server Test", () => {
  it("Test app /", async () => {
    await request(app).get("/").expect(StatusCodes.OK);
  });
});
