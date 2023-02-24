/* eslint-disable generator-star-spacing */
/* eslint-disable no-magic-numbers */

import Gas from "../src/models/gas-model";

/**
 * It takes an array of objects, and for each object, it returns an async generator
 * that creates and yields a Gas model instance for each GasInterface object in the array
 */
interface GasInterface {
  units: number;
  topup: number;
  date: string;
}

const gasData: GasInterface[] = [
  { units: 66, topup: 0, date: "2022-07-17T12:00" },
  { units: 65, topup: 0, date: "2022-07-24T12:00" },
  { units: 64, topup: 0, date: "2022-07-31T12:00" },
  { units: 63, topup: 0, date: "2022-08-07T12:00" },
  { units: 63, topup: 0, date: "2022-08-14T12:00" },
  { units: 62, topup: 0, date: "2022-08-21T12:00" },
  { units: 60, topup: 0, date: "2022-08-28T12:00" },
  { units: 59, topup: 0, date: "2022-09-04T12:00" },
  { units: 57, topup: 0, date: "2022-09-11T12:00" },
  { units: 96, topup: 49, date: "2022-09-19T12:00" },
  { units: 92, topup: 0, date: "2022-10-16T12:00" },
  { units: 89, topup: 0, date: "2022-10-23T12:00" },
  { units: 88, topup: 0, date: "2022-10-30T12:00" }
];

/**
 * It takes an array of objects, and for each object in the array, it yields a new object
 */
async function* gasGenerator(gasArray: GasInterface[]) {
  for (const { units, topup, date } of gasArray) {
    yield Gas.create({
      units,
      topup,
      measuredAt: new Date(date)
    });
  }
}

/**
 * "The async function generate() awaits the async generator function
 * gasGenerator() to yield the values of the gasData array."
 */
async function generate() {
  for await (const val of gasGenerator(gasData)) {
    console.log(val);
  }
}

generate();

// Gas.sync();
// Gas.drop();
