const dbMethods = require("../src/db/db-methods");
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
      expect(token).toContain("ey");
    });
  });
});
