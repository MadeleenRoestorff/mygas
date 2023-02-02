// import { insertSaltedHashedUserInDB } from "../src/auth/auth";
// import { authenticateUser } from "../src/auth/auth";
import { dbSetup } from "../src/db/db-methods";
import { insertSaltedHashedUserInDB, authenticateUser } from "../src/auth/auth";

dbSetup().then(async () => {
  await insertSaltedHashedUserInDB("studio", "ghibli");
  await authenticateUser("studio", "ghibli", (error, tkn) => {
    console.log(tkn);
  });
});
