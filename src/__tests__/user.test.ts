import { dbSetup, dbClear } from "../db/db-methods";
import { insertSaltedHashedUserInDB, authenticateUser } from "../auth/auth";
import app from "../app";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { describe, beforeEach, afterEach, it, expect } from "@jest/globals";

describe("Tests for user authentication", () => {
  let token: string | null = null;
  beforeEach(async () => {
    await dbSetup();
    await insertSaltedHashedUserInDB("studio", "ghibli");
  });

  afterEach(async () => {
    await dbClear();
  });

  it("Test user Add Wrong Username", async () => {
    await authenticateUser("studi", "ghibli", (error, tkn) => {
      expect(tkn).toBe(null);
      expect(Boolean(error)).toBe(true);
    });
  });

  it("Test user Add Wrong Password", async () => {
    await authenticateUser("studio", "ghibl", (error, tkn) => {
      expect(tkn).toBe(null);
      expect(Boolean(error)).toBe(true);
    });
  });

  it("Test user Add", async () => {
    await authenticateUser("studio", "ghibli", (error, tkn) => {
      expect(Boolean(tkn)).toBe(true);
      expect(error).toBe(null);
      expect(tkn).toContain("ey");
      token = tkn;
    });
  });

  it("Test gas list with correct token", async () => {
    await request(app)
      .get("/gas")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.length).toBe(0);
      });
  });

  it("Test gas list with incorrect token", async () => {
    await request(app).get("/gas").set("Authorization", "Bearer ").expect(StatusCodes.UNAUTHORIZED);
  });

  it("Test gas list with no Authorization Header", async () => {
    await request(app).get("/gas").expect(StatusCodes.UNAUTHORIZED);
  });
});
