const dbMethods = require("../src/db/db-methods");
// const Gas = require("../src/models/gas-model");]

beforeAll(async () => {
  const dbsCreated = await dbMethods.dbSetup("test.db");
  console.log(dbsCreated);
});

afterAll(async () => {
  const dbsCleared = await dbMethods.dbClear("test.db");
  console.log(dbsCleared);
});

describe("Tests for gas model", () => {
  it("addNewGasRow", () => {
    const nonsense = "hello";
    expect(nonsense).toBe("hello");
    // const testGas = new Gas({
    //   units: 123
    // });
    // testGas.save();
    // pseudocode
    // allRows = runDb("select * from gas;");
    // expect(allRows.length).toBe(1);
    // const firstRow = allRows[0];
    // expect(firstRow.units).toBe(123);
  });
});
