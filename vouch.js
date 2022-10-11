/**
 * User mangement functions:
 *  - insertSaltedHashedUserInDB
 *  - authenticateUser
 *  - restrict
 *
 */

 const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

const digest = 'sha256';
const iterations = 99999;
const keyLength = 64;
const bufferSalt = crypto.randomBytes(keyLength).toString('base64');
// get config vars
dotenv.config();

exports.insertSaltedHashedUserInDB = (password, username) => {
  /**
   * Inserts a user into the DB.
   * Passwords are hashed and salted
   *
   * @param {string} password: user password
   * @param {string} username: user username
   */

  crypto.pbkdf2(
    password,
    bufferSalt,
    iterations,
    keyLength,
    digest,
    (err, hash) => {
      if (err) throw err;
      // store the salt & hash in the "db"
      let db = new sqlite3.Database('gas.db');
      db.run(
        `INSERT INTO users (username, salt, hash) VALUES ('${username}', '${bufferSalt}', '${hash.toString(
          'base64'
        )}')`
      );
      db.close();
    }
  );
};

exports.authenticateUser = async (name, password, errToken) => {
  console.log('authenticating %s:%s', name, password);
  // query the db for the given username
  const getUserSaltHash = new Promise((resolve, reject) => {
    let db = new sqlite3.Database('gas.db');
    db.get(`SELECT * FROM users WHERE username = '${name}'`, (err, row) => {
      if (err) {
        reject(errToken(err));
      } else {
        resolve([row.salt, row.hash, row.username]);
      }
    });
    db.close();
  });

  let saltedhash = await getUserSaltHash;

  crypto.pbkdf2(
    password,
    saltedhash[0],
    iterations,
    keyLength,
    digest,
    (err, hash) => {
      if (err) return errToken(err);
      //   match pw hash with db hash
      if (hash.toString('base64') === saltedhash[1]) {
        // generate token
        const token = jwt.sign(
          { username: saltedhash[2] },
          process.env.GEHUIMPIE,
          {
            expiresIn: '24h',
          }
        );
        console.log(token);
        return errToken(null, token);
      }
      errToken(null, null);
    }
  );
};

exports.restrict = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    req.error = 'Access denied!';
    res.redirect('/login');
  } else {
    jwt.verify(token, process.env.GEHUIMPIE, (err, user) => {
      if (err) {
        req.error = err;
        res.redirect('/login');
      } else {
        req.user = user;
        next();
      }
    });
  }
};
