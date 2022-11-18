const auth = require("../src/auth/auth");

auth.insertSaltedHashedUserInDB("foobar", "tj");
auth.insertSaltedHashedUserInDB("madeleen", "madeleen");
auth.insertSaltedHashedUserInDB("martin", "martin");
