/* eslint-disable max-statements */
import { dbSetup, dbClear } from "../db/db-methods";
import Electricity from "../models/electricity-model";
import { describe, beforeEach, afterEach, it, expect } from "@jest/globals";

describe("Tests for Electricity model", () => {
  beforeEach(async () => {
    await dbSetup();
  });

  afterEach(async () => {
    await dbClear();
  });

  it("Test create new Electricity", async () => {
    const ELEC = 123;
    const MEASUREDAT = new Date();
    const newElec = await Electricity.create({
      electricity: ELEC,
      measuredAt: MEASUREDAT
    });
    expect(newElec.ElecLogID).toBe(1);
  });

  it("Test findAll and create", async () => {
    const allElectRowsInitial = await Electricity.findAll();
    expect(allElectRowsInitial.length).toBe(0);
    const ELEC = 123;
    const MEASUREDAT = new Date();
    await Electricity.create({
      electricity: ELEC,
      measuredAt: MEASUREDAT
    });
    const allElectRowsEnd = await Electricity.findAll();
    expect(allElectRowsEnd.length).toBe(1);
    const firstRow = allElectRowsEnd[0];
    expect(firstRow.electricity).toBe(ELEC);
    expect(firstRow.measuredAt.toISOString).toBe(MEASUREDAT.toISOString);
  });

  it("Test getElecInstance and create", async () => {
    const ELEC = 123;
    const MEASUREDAT = new Date();
    const newElec = await Electricity.create({
      electricity: ELEC,
      measuredAt: MEASUREDAT
    });
    const newElecID = newElec.ElecLogID;
    const elecInstance = await Electricity.getElecInstance(newElecID);
    expect(elecInstance.electricity).toBe(ELEC);
    expect(elecInstance.measuredAt.toISOString).toBe(MEASUREDAT.toISOString);
  });

  it("Test update electricity", async () => {
    const ELEC = 123;
    const MEASUREDAT = new Date();
    const newElec = await Electricity.create({
      electricity: ELEC,
      measuredAt: MEASUREDAT
    });
    const newElecID = newElec.ElecLogID;
    expect(newElec.electricity).toBe(ELEC);
    expect(newElec.measuredAt.toISOString).toBe(MEASUREDAT.toISOString);
    const ELECUPADATE = 321;
    await Electricity.update(
      { electricity: ELECUPADATE },
      {
        where: {
          ElecLogID: newElecID
        }
      }
    );
    const elecInstance = await Electricity.getElecInstance(newElecID);
    expect(elecInstance.electricity).toBe(ELECUPADATE);
    expect(elecInstance.measuredAt.toISOString).toStrictEqual(
      MEASUREDAT.toISOString
    );
  });

  it("Test if create at date = update date for create electricity", async () => {
    const ELEC = 123;
    const MEASUREDAT = new Date();
    const newElec = await Electricity.create({
      electricity: ELEC,
      measuredAt: MEASUREDAT
    });
    expect(newElec.createdAt).toBe(newElec.updatedAt);
  });

  it("Test if create at date > update date for update electricity", async () => {
    const ELEC = 123;
    const MEASUREDAT = new Date();
    const newElec = await Electricity.create({
      electricity: ELEC,
      measuredAt: MEASUREDAT
    });
    const ELECUPADATE = 321;
    await Electricity.update(
      { electricity: ELECUPADATE },
      {
        where: {
          ElecLogID: newElec.ElecLogID
        }
      }
    );
    const elecInstance = await Electricity.getElecInstance(newElec.ElecLogID);
    expect(elecInstance.updatedAt.getTime()).toBeGreaterThan(
      elecInstance.createdAt.getTime()
    );
  });
});
