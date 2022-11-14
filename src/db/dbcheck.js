#!/usr/bin/env node
const dbMethods = require("./db-methods");

const testsetup = () => {
  return new Promise((resolve) => {
    const dbsCreated = dbMethods.dbSetup("test.db");
    resolve(dbsCreated);
  });
};

const testClear = () => {
  return new Promise((resolve) => {
    const dbsCleared = dbMethods.dbClear("test.db");
    resolve(dbsCleared);
  });
};

testsetup().then((response) => {
  console.log(response);
  testClear().then((response1) => console.log(response1));
});
