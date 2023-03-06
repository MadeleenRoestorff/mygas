/* eslint-disable generator-star-spacing */
/* eslint-disable no-magic-numbers */

import Electricity from "../src/models/electricity-model";

/**
 * It takes an array of objects, each of which has an elec and date property, and returns an async
 * generator that yields an Electricity model instance for each object in the array
 */
const elecData: ElectricityInterface[] = [
  { elec: 77738, date: "2022-09-07" },
  { elec: 77831, date: "2022-09-12" },
  { elec: 78015, date: "2022-10-04" },
  { elec: 78706, date: "2022-12-03" },
  { elec: 78855, date: "2022-12-14" },
  { elec: 79127, date: "2023-01-04" },
  { elec: 79510, date: "2023-02-04" }
];

interface ElectricityInterface {
  elec: number;
  date: string;
}

// Creating a generator function that returns an async generator that yields an Electricity model
// instance for each ElectricityInterface object in the array
async function* electricGenerator(elect: ElectricityInterface[]) {
  for (const { elec, date } of elect) {
    yield Electricity.create({
      electricity: elec,
      measuredAt: new Date(date)
    });
  }
}

async function generate() {
  for await (const val of electricGenerator(elecData)) {
    console.log(val);
  }
}

generate();

// Electricity.sync();
// Electricity.drop();
