import { insertSaltedHashedUserInDB, authenticateUser } from "../src/auth/auth";
import User from "../src/models/user-model";

// User.drop();

User.sync().then(async () => {
  await insertSaltedHashedUserInDB("studio", "ghibli");
  await authenticateUser("studio", "ghibli", (error, tkn) => {
    console.log(tkn);
  });
});
