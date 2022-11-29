const dbMethods = require("../src/db/db-methods");
const app = require("../src/app");
const request = require("supertest");
const statusCodes = require("http-status-codes").StatusCodes;
const auth = require("../src/auth/auth");

describe("Tests for gas model", () => {
  let token = null;
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
      });
  });
});
