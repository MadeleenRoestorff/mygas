const dbMethods = require("../src/db/db-methods");
const Gas = require("../src/models/gas-model");

describe("Tests for gas model", () => {
  beforeEach(async () => {
    await dbMethods.dbSetup();
  });

  afterEach(async () => {
    await dbMethods.dbClear();
  });

  it("addNewGasRow", async () => {
    const allGasRowsInitial = await Gas.getGasList();
    expect(allGasRowsInitial.length).toBe(0);
    const UNITS = 123;
    const testGas = new Gas({
      units: UNITS
    });
    await testGas.save();
    const allGasRowsEnd = await Gas.getGasList();
    expect(allGasRowsEnd.length).toBe(1);
    const firstRow = allGasRowsEnd[0];
    expect(firstRow.fields.units).toBe(UNITS);
  });
});
