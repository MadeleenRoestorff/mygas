/* eslint-disable max-statements */
import { dbSetup, dbClear } from "../db/db-methods";
import { insertSaltedHashedUserInDB, authenticateUser } from "../auth/auth";
import app from "../app";
import request from "supertest";
import { StatusCodes } from "http-status-codes";
import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";

describe("Tests for endpoint api", () => {
  let token: string | null = null;
  let elecID = 0;
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

  it("SUCCESS: Test save new Electricity, with ELEC", async () => {
    const ELEC = 123;
    await request(app)
      .post("/electricity")
      .set("Authorization", `Bearer ${token}`)
      .send({ electricity: ELEC })
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.electricity).toBe(ELEC);
        expect(response.body.measuredAt).toBeTruthy();
        elecID = response.body.ElecLogID;
        expect(elecID).toBe(1);
      });
  });

  it("SUCCESS: Test Electricity list", async () => {
    await request(app)
      .get("/electricity")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.length).toBe(1);
      });
  });

  it("FAILURE: Test save new Electricity with no body request", async () => {
    await request(app)
      .post("/electricity")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("FAILURE: Test save new Electricity with incorrect ELEC type", async () => {
    const ELEC = "a";
    await request(app)
      .post("/electricity")
      .set("Authorization", `Bearer ${token}`)
      .send({ electricity: ELEC })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });
  it("FAILURE: Test save new Electricity with incorrect MEASUREDAT type", async () => {
    const ELEC = 123;
    const MEASUREDAT = "a";
    await request(app)
      .post("/electricity")
      .set("Authorization", `Bearer ${token}`)
      .send({ electricity: ELEC, measuredAt: MEASUREDAT })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("FAILURE: Test save new Electricity with incorrect body request", async () => {
    const ELEC = 123;
    await request(app)
      .post("/electricity")
      .set("Authorization", `Bearer ${token}`)
      .send({ electric: ELEC })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("SUCCESS: Test Update Electricity with only ELEC", async () => {
    const ELEC = 777;
    await request(app)
      .put(`/electricity/${elecID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ electricity: ELEC })
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.electricity).toBe(ELEC);
      });
  });

  it("SUCCESS: Test Update Electricity with only MEASUREDAT", async () => {
    const MEASUREDAT = new Date().toISOString();
    await request(app)
      .put(`/electricity/${elecID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ measuredAt: MEASUREDAT })
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.measuredAt).toBe(MEASUREDAT);
      });
  });

  it("FAILURE: Test Update Electricity with incorrect ID", async () => {
    const ELEC = 777;
    await request(app)
      .put("/electricity/999")
      .set("Authorization", `Bearer ${token}`)
      .send({ electricity: ELEC })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("FAILURE: Test Update Electricity with incorrect body request", async () => {
    const ELEC = 777;
    await request(app)
      .put(`/electricity/${elecID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ electric: ELEC })
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("FAILURE: Test Update Electricity with no body request", async () => {
    await request(app)
      .put(`/electricity/${elecID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("SUCCESS: Test Electricity list", async () => {
    await request(app)
      .get("/electricity")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.length).toBe(1);
      });
  });

  it("SUCCESS: Test Electricity Instance correct ID", async () => {
    await request(app)
      .get(`/electricity/${elecID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.ElecLogID).toBe(1);
      });
  });

  it("FAILURE: Test Electricity Instance wrong ID", async () => {
    await request(app)
      .get("/electricity/10")
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.NOT_ACCEPTABLE);
  });

  it("FAILURE: Test save new Electricity, with MEASUREDAT", async () => {
    const MEASUREDAT = new Date().toISOString();
    await request(app)
      .post("/electricity")
      .set("Authorization", `Bearer ${token}`)
      .send({ measuredAt: MEASUREDAT });
    expect(StatusCodes.NOT_ACCEPTABLE);
  });
  it("SUCCESS: Test save new Electricity, with ELEC and MEASUREDAT", async () => {
    const ELEC = 321;
    const MEASUREDAT = new Date().toISOString();
    await request(app)
      .post("/electricity")
      .set("Authorization", `Bearer ${token}`)
      .send({ electricity: ELEC, measuredAt: MEASUREDAT })
      .expect(StatusCodes.OK)
      .then((response) => {
        expect(response.body.electricity).toBe(ELEC);
        expect(response.body.measuredAt).toBe(MEASUREDAT);
      });
  });
});
