import { dbSetup, dbClear } from "../db/db-methods";
import Gas from "../models/gas-model";
import { describe, beforeEach, afterEach, it, expect } from "@jest/globals";

describe("Tests for gas model", () => {
  beforeEach(async () => {
    await dbSetup();
  });

  afterEach(async () => {
    await dbClear();
  });

  it("Test create new Gas", async () => {
    const UNITS = 123;
    const newGas = await Gas.create({
      units: UNITS
    });
    expect(newGas.GasLogID).toBe(1);
  });

  it("Test findAll and create", async () => {
    const allGasRowsInitial = await Gas.findAll();
    expect(allGasRowsInitial.length).toBe(0);
    const UNITS = 123;
    const testGas = new Gas({
      units: UNITS
    });
    await testGas.save();
    const allGasRowsEnd = await Gas.findAll();
    expect(allGasRowsEnd.length).toBe(1);
    const firstRow = allGasRowsEnd[0];
    expect(firstRow.units).toBe(UNITS);
  });

  it("Test getGasInstance and create", async () => {
    const UNITS = 123;
    const newGas = await Gas.create({
      units: UNITS
    });
    const newGasID = newGas.GasLogID;
    const gasInstance = await Gas.getGasInstance(newGasID);
    expect(gasInstance.units).toBe(UNITS);
  });

  it("Test update gas", async () => {
    const UNITS = 123;
    const newGas = await Gas.create({
      units: UNITS
    });
    const newGasID = newGas.GasLogID;
    expect(newGas.units).toBe(UNITS);
    const UNITSUPADATE = 321;
    await Gas.update(
      { units: UNITSUPADATE },
      {
        where: {
          GasLogID: newGasID
        }
      }
    );
    const gasInstance = await Gas.getGasInstance(newGasID);
    expect(gasInstance.units).toBe(UNITSUPADATE);
  });

  it("Test if create at date = update date for create gas", async () => {
    const UNITS = 123;
    const newGas = await Gas.create({
      units: UNITS
    });
    expect(newGas.createdAt).toBe(newGas.updatedAt);
  });

  it("Test if create at date > update date for update gas", async () => {
    const UNITS = 123;
    const newGas = await Gas.create({
      units: UNITS
    });
    const UNITSUPADATE = 321;
    await Gas.update(
      { units: UNITSUPADATE },
      {
        where: {
          GasLogID: newGas.GasLogID
        }
      }
    );
    const gasInstance = await Gas.getGasInstance(newGas.GasLogID);
    expect(gasInstance.updatedAt.getTime()).toBeGreaterThan(gasInstance.createdAt.getTime());
  });
});
