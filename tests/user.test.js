const dbMethods = require("../src/db/db-methods");
const auth = require("../src/auth/auth");
const app = require("../src/app");
const request = require("supertest");
const statusCodes = require("http-status-codes").StatusCodes;

describe("Tests for user authentication", () => {
  let token = null;
  beforeEach(async () => {
    await dbMethods.dbSetup();
    await auth.insertSaltedHashedUserInDB("studio", "ghibli");
  });

  afterEach(async () => {
    await dbMethods.dbClear();
  });

  it("Test user Add Wrong Password", async () => {
    await auth.authenticateUser("ghibli", "studi", (error, tkn) => {
      expect(tkn).toBe(null);
      expect(Boolean(error)).toBe(true);
    });
  });

  it("Test user Add Wrong Username", async () => {
    await auth.authenticateUser("ghibl", "studio", (error, tkn) => {
      expect(tkn).toBe(null);
      expect(Boolean(error)).toBe(true);
    });
  });

  it("Test user Add", async () => {
    await auth.authenticateUser("ghibli", "studio", (error, tkn) => {
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
      .expect(statusCodes.OK)
      .then((response) => {
        expect(response.body.length).toBe(0);
      });
  });

  it("Test gas list with incorrect token", async () => {
    await request(app).get("/gas").set("Authorization", "Bearer ").expect(statusCodes.UNAUTHORIZED);
  });

  it("Test gas list with no Authorization Header", async () => {
    await request(app).get("/gas").expect(statusCodes.UNAUTHORIZED);
  });
});
