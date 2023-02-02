import { dbSetup, dbClear } from "../db/db-methods";
import { insertSaltedHashedUserInDB } from "../auth/auth";
import app from "../app";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";

describe("Tests for endpoint api", () => {
  const USERNAME = "studio";
  const PASSWORD = "ghibli";
  beforeAll(async () => {
    await dbSetup();
    await insertSaltedHashedUserInDB(USERNAME, PASSWORD);
  });

  afterAll(async () => {
    await dbClear();
  });

  it("SUCCESS: Test user login", async () => {
    await request(app)
      .post("/login")
      .send({ username: USERNAME, password: PASSWORD })
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body).toContain("ey");
      });
  });

  it("FAILURE: Test wrong user credentials login", async () => {
    await request(app)
      .post("/login")
      .send({ username: "wrong", password: "wrongwrong" })
      .expect(StatusCodes.UNAUTHORIZED)
      .then((response) => {
        expect(response.body).toBe(null);
      });
  });
});
