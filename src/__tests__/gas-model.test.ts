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
    const TOPUP = 0;
    const newGas = await Gas.create({
      units: UNITS,
      topup: TOPUP
    });
    expect(newGas.GasLogID).toBe(1);
  });

  it("Test findAll and create", async () => {
    const allGasRowsInitial = await Gas.findAll();
    expect(allGasRowsInitial.length).toBe(0);
    const UNITS = 123;
    const TOPUP = 50;
    await Gas.create({
      units: UNITS,
      topup: TOPUP
    });
    const allGasRowsEnd = await Gas.findAll();
    expect(allGasRowsEnd.length).toBe(1);
    const firstRow = allGasRowsEnd[0];
    expect(firstRow.units).toBe(UNITS);
    expect(firstRow.topup).toBe(TOPUP);
  });

  it("Test getGasInstance and create", async () => {
    const UNITS = 123;
    const TOPUP = 0;
    const newGas = await Gas.create({
      units: UNITS,
      topup: TOPUP
    });
    const newGasID = newGas.GasLogID;
    const gasInstance = await Gas.getGasInstance(newGasID);
    expect(gasInstance.units).toBe(UNITS);
    expect(gasInstance.topup).toBe(TOPUP);
  });

  it("Test update gas", async () => {
    const UNITS = 123;
    const TOPUP = 50;
    const newGas = await Gas.create({
      units: UNITS,
      topup: TOPUP
    });
    const newGasID = newGas.GasLogID;
    expect(newGas.units).toBe(UNITS);
    expect(newGas.topup).toBe(TOPUP);
    const UNITSUPADATE = 321;
    const TOPUPUPADATE = 60;
    await Gas.update(
      { units: UNITSUPADATE, topup: TOPUPUPADATE },
      {
        where: {
          GasLogID: newGasID
        }
      }
    );
    const gasInstance = await Gas.getGasInstance(newGasID);
    expect(gasInstance.units).toBe(UNITSUPADATE);
    expect(gasInstance.topup).toBe(TOPUPUPADATE);
  });

  it("Test if create at date = update date for create gas", async () => {
    const UNITS = 123;
    const TOPUP = 0;
    const newGas = await Gas.create({
      units: UNITS,
      topup: TOPUP
    });
    expect(newGas.createdAt).toBe(newGas.updatedAt);
  });

  it("Test if create at date > update date for update gas", async () => {
    const UNITS = 123;
    const TOPUP = 0;
    const newGas = await Gas.create({
      units: UNITS,
      topup: TOPUP
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
