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

  it("SUCCESS: Test save new Gas, with UNITS", async () => {
    const UNITS = 123;
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .send({ units: UNITS })
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.units).toBe(UNITS);
        expect(response.body.GasLogID).toBe(1);
        expect(response.body.topup).toBe(0);
        gasID = response.body.GasLogID;
      });
  });

  it("SUCCESS: Test gas list", async () => {
    await request(app)
      .get("/gas")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.length).toBe(1);
      });
  });

  it("FAILURE: Test save new Gas with no body request", async () => {
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("FAILURE: Test save new Gas with incorrect UNITS type", async () => {
    const UNITS = "a";
    const TOPUP = 0;
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .send({ units: UNITS, topup: TOPUP })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });
  it("FAILURE: Test save new Gas with incorrect TOPUP type", async () => {
    const TOPUP = "a";
    const UNITS = 123;
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .send({ units: UNITS, topup: TOPUP })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("FAILURE: Test save new Gas with incorrect body request", async () => {
    const UNITS = 123;
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .send({ unit: UNITS })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("SUCCESS: Test Update Gas with only UNITS", async () => {
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

  it("SUCCESS: Test Update Gas with only TOPUP", async () => {
    const TOPUP = 50;
    await request(app)
      .put(`/gas/${gasID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ topup: TOPUP })
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.topup).toBe(TOPUP);
      });
  });

  it("FAILURE: Test Update Gas with incorrect ID", async () => {
    const UNITS = 999;
    await request(app)
      .put("/gas/999")
      .set("Authorization", `Bearer ${token}`)
      .send({ units: UNITS })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("FAILURE: Test Update Gas with incorrect body request", async () => {
    const UNITS = 777;
    await request(app)
      .put(`/gas/${gasID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ unit: UNITS })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("FAILURE: Test Update Gas with no body request", async () => {
    await request(app)
      .put(`/gas/${gasID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("SUCCESS: Test gas list", async () => {
    await request(app)
      .get("/gas")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.length).toBe(1);
      });
  });

  it("SUCCESS: Test gas Instance correct ID", async () => {
    await request(app)
      .get(`/gas/${gasID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.GasLogID).toBe(1);
      });
  });

  it("FAILURE: Test gas Instance wrong ID", async () => {
    await request(app)
      .get("/gas/10")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("Test save new Gas, with TOPUP", async () => {
    const TOPUP = 50;
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .send({ topup: TOPUP })
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.topup).toBe(TOPUP);
        expect(response.body.units).toBe(0);
      });
  });
  it("Test save new Gas, with TOPUP and UNITS", async () => {
    const TOPUP = 50;
    const UNITS = 777;
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .send({ topup: TOPUP, units: UNITS })
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.topup).toBe(TOPUP);
        expect(response.body.units).toBe(UNITS);
      });
  });
});
