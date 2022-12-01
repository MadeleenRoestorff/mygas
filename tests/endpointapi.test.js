/* eslint-disable max-statements */
const dbMethods = require("../src/db/db-methods");
const app = require("../src/app");
const request = require("supertest");
const statusCodes = require("http-status-codes").StatusCodes;
const auth = require("../src/auth/auth");

describe("Tests for gas model", () => {
  let token = null;
  let gasID = 0;
  beforeAll(async () => {
    await dbMethods.dbSetup();
    await auth.insertSaltedHashedUserInDB("studio", "ghibli");
    token = await auth.authenticateUser("ghibli", "studio", (error, authtoken) => {
      return authtoken;
    });
  });

  afterAll(async () => {
    await dbMethods.dbClear();
  });
  //   view gas list and instance

  it("Test save new Gas", async () => {
    const UNITS = 123;
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .send({ units: UNITS })
      .expect(statusCodes.OK)
      .then((response) => {
        expect(response.body.units).toBe(UNITS);
        expect(response.body.GasLogID).toBe(1);
        gasID = response.body.GasLogID;
      });
  });
  it("Test save new Gas with no body request", async () => {
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .expect(statusCodes.BAD_REQUEST);
  });
  it("Test save new Gas with incorrect body request", async () => {
    const UNITS = 123;
    await request(app)
      .post("/gas")
      .set("Authorization", `Bearer ${token}`)
      .send({ unit: UNITS })
      .expect(statusCodes.NOT_ACCEPTABLE);
  });
  it("Test Update Gas", async () => {
    const UNITS = 777;
    await request(app)
      .put(`/gas/${gasID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ units: UNITS })
      .expect(statusCodes.OK)
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
      .expect(statusCodes.OK)
      .then((response) => {
        expect(response.body.units).toBe(UNITS);
      });
  });
  it("Test Update Gas with incorrect body request", async () => {
    const UNITS = 777;
    await request(app)
      .put(`/gas/${gasID}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ unit: UNITS })
      .expect(statusCodes.NOT_ACCEPTABLE);
  });
  it("Test Update Gas with no body request", async () => {
    await request(app)
      .put(`/gas/${gasID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(statusCodes.BAD_REQUEST);
  });
});
