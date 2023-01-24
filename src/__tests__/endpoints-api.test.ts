/* eslint-disable max-statements */
import { dbSetup, dbClear } from "../db/db-methods";
import { insertSaltedHashedUserInDB, authenticateUser } from "../auth/auth";
import app from "../app";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";

describe("Tests for endpoint api", () => {
  let token: string | null = null;
  let gasID = 0;
  beforeAll(async () => {
    await dbSetup();
    await insertSaltedHashedUserInDB("studio", "ghibli");
    await authenticateUser("studio", "ghibli", (error, authtoken) => {
      token = authtoken;
    });
  });

  afterAll(async () => {
    await dbClear();
  });

  it("Test save new Gas", async () => {
    const UNITS = 123;
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .send({ units: UNITS })
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.units).toBe(UNITS);
        expect(response.body.GasLogID).toBe(1);
        gasID = response.body.GasLogID;
      });
  });

  it("Test gas list", async () => {
    await request(app)
      .get("/gas")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.length).toBe(1);
      });
  });

  it("Test save new Gas with no body request", async () => {
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("Test save new Gas with incorrect UNITS type", async () => {
    const UNITS = "a";
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .send({ units: UNITS })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("Test save new Gas with incorrect body request", async () => {
    const UNITS = 123;
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .send({ unit: UNITS })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("Test Update Gas", async () => {
    const UNITS = 777;
    await request(app)
      .put(`/gas/${gasID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ units: UNITS })
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.units).toBe(UNITS);
      });
  });

  it("Test Update Gas with incorrect ID", async () => {
    const UNITS = 999;
    await request(app)
      .put("/gas/999")
      .set("Authorization", `Bearer ${token}`)
      .send({ units: UNITS })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("Test Update Gas with incorrect body request", async () => {
    const UNITS = 777;
    await request(app)
      .put(`/gas/${gasID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ unit: UNITS })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("Test Update Gas with no body request", async () => {
    await request(app)
      .put(`/gas/${gasID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("Test gas list", async () => {
    await request(app)
      .get("/gas")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.length).toBe(1);
      });
  });

  it("Test gas Instance correct ID", async () => {
    await request(app)
      .get("/gas/1")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.GasLogID).toBe(1);
      });
  });

  it("Test gas Instance wrong ID", async () => {
    await request(app)
      .get("/gas/10")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });
});
