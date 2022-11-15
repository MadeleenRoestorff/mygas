const dbMethods = require("../src/db/db-methods");
const Gas = require("../src/models/gas-model");

beforeEach(async () => {
  await dbMethods.dbSetup();
});

afterEach(async () => {
  await dbMethods.dbClear();
});

describe("Tests for gas model", () => {
  it("addNewGasRow", async () => {
    const allGasRowsIntial = await Gas.getGasList();
    expect(allGasRowsIntial.length).toBe(0);
    const UNITS = 123;
    const testGas = new Gas({
      units: UNITS
    });
    await testGas.save();
    const allGasRows = await Gas.getGasList();
    expect(allGasRows.length).toBe(1);
    const firstRow = allGasRows[0];
    expect(firstRow.fields.units).toBe(UNITS);
  });
});
