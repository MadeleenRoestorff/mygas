import { dbSetup, dbClear } from "../db/db-methods";
import Gas from "../models/gas-models";
import { describe, beforeEach, afterEach, it, expect } from "@jest/globals";

describe("Tests for gas model", () => {
  beforeEach(async () => {
    await dbSetup();
  });

  afterEach(async () => {
    await dbClear();
  });

  it("Test save new Gas", async () => {
    const UNITS = 123;
    const testGas = new Gas({
      units: UNITS
    });
    const newGasID = await testGas.save();
    expect(newGasID).toBe(1);
  });

  it("Test getGasList and save", async () => {
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
    expect(firstRow.getFields().units).toBe(UNITS);
  });

  it("Test getGasInstance and save", async () => {
    const UNITS = 123;
    const testGas = new Gas({
      units: UNITS
    });
    const newGasID = await testGas.save();
    const gasInstance = await Gas.getGasInstance(newGasID);
    expect(gasInstance.getFields().units).toBe(UNITS);
  });

  it("Test save add new, update gas and get gas instance", async () => {
    const UNITS = 123;
    const testNewGas = new Gas({
      units: UNITS
    });
    const newGasID = await testNewGas.save();
    const gasInstanceInitial = await Gas.getGasInstance(newGasID);
    expect(gasInstanceInitial.getFields().units).toBe(UNITS);
    const UNITSUPADATE = 321;
    const testUpdateGas = new Gas({
      GasLogID: newGasID,
      units: UNITSUPADATE
    });
    await testUpdateGas.save();
    const gasInstance = await Gas.getGasInstance(newGasID);
    expect(gasInstance.getFields().units).toBe(UNITSUPADATE);
  });
});
