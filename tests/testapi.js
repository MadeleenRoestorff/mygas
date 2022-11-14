const axios = require("axios").default;

const AUTH =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRqIiwiaWF0IjoxNjY2NjMwMzkyLCJleHAiOjE2NjY3MTY3OTJ9.TS0H3IaQIk_wBZB5XUdkiuGpMK5bb7QF4PtXJ9rd5Cs";

axios
  .post(
    "http://localhost:3000/controller",
    { units: 115, GasLogID: 55 },
    {
      headers: {
        Authorization: AUTH
      }
    }
  )
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log("failed", error);
  });

// axios
//   .get("http://localhost:3000/controller", {
//     headers: {
//       Authorization: AUTH
//     }
//   })
//   .then((response) => {
//     console.log(response.data);
//   })
//   .catch((error) => {
//     console.log("failed", error);
//   });

// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('gas.db');

// db.serialize(() => {
//   //   db.run(`INSERT INTO gas (units, createon) VALUES (1, null)`);
//   db.each('SELECT GasLogID AS id, units, createon FROM gas', (err, row) => {
//     console.log(`${row.id}: ${row.units} on ${row.createon}`);
//   });
// });

// db.close();
