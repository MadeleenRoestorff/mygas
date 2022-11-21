const dbMethods = require("../src/db/db-methods");
const app = require("../src/app");
const request = require("supertest");
const statusCodes = require("http-status-codes").StatusCodes;
const auth = require("../src/auth/auth");

describe("Tests for gas model", () => {
  beforeEach(async () => {
    await dbMethods.dbSetup();
    await auth.insertSaltedHashedUserInDB("studio", "ghibli");
  });

  afterEach(async () => {
    await dbMethods.dbClear();
  });

  it("Test user Add Wrong Password", async () => {
    await auth.authenticateUser("ghibli", "studi", (error, token) => {
      expect(token).toBe(null);
      expect(Boolean(error)).toBe(true);
    });
  });
  it("Test user Add Wrong Username", async () => {
    await auth.authenticateUser("ghibl", "studio", (error, token) => {
      expect(token).toBe(null);
      expect(Boolean(error)).toBe(true);
    });
  });
  it("Test user Add", async () => {
    await auth.authenticateUser("ghibli", "studio", (error, token) => {
      expect(Boolean(token)).toBe(true);
      expect(error).toBe(null);
    });
  });
  it("Test save new Gas", async () => {
    const UNITS = 123;
    await request(app)
      .post("/gas")
      .send({ units: UNITS })
      .expect(statusCodes.OK)
      .then((response) => {
        expect(response.body.units).toBe(UNITS);
        expect(response.body.GasLogID).toBe(1);
      });
  });
});
