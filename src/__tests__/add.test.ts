import { describe, expect, it } from "@jest/globals";
import testadd from "../testfolder/testfile";
describe("Tests for gas model", () => {
  it("Test save new Gas", () => {
    const UNITS = 123;
    const TEST = 123;
    testadd(UNITS, TEST);
    expect(UNITS).toBe(TEST);
  });
});
