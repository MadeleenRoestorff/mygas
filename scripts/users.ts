// import { insertSaltedHashedUserInDB } from "../src/auth/auth";
import { authenticateUser } from "../src/auth/auth";
// import { dbSetup } from "../src/db/db-methods";

// dbSetup().then(() => {
//   insertSaltedHashedUserInDB("studio", "ghibli");
// });

authenticateUser("studio", "ghibli", (error, tkn) => {
  console.log(tkn);
});
