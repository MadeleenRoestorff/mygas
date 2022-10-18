const axios = require("axios").default;

// axios
//   .post('http://localhost:3000/controller', {
//     units: 3,
//   })
//   .then(function (response) {
//     console.log(Object.keys(response));
//   })
//   .catch(function (error) {
//     console.log('failed');
//   });

// axios
//   .put('http://localhost:3000/controller', {
//     units: 33,
//     GasLogID: 20,
//   })
//   .then(function (response) {
//     console.log(Object.keys(response));
//   })
//   .catch(function (error) {
//     console.log('failed');
//   });

axios
  .get("http://localhost:3000/controller", {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRqIiwiaWF0IjoxNjY2MTAwOTk5LCJleHAiOjE2NjYxODczOTl9.1QsGwcuTVmudso0Ff3OksrwiEgyqX7VFIdrm9jTNRa8"
    }
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.log("failed", error);
  });

// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('gas.db');

// db.serialize(() => {
//   //   db.run(`INSERT INTO gas (units, createon) VALUES (1, null)`);
//   db.each('SELECT GasLogID AS id, units, createon FROM gas', (err, row) => {
//     console.log(`${row.id}: ${row.units} on ${row.createon}`);
//   });
// });

// db.close();
