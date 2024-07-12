const bcrypt = require("bcrypt");

function hashPassword(password) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return hashedPassword;
}

function comparePasswords(inputPassword, hashedPassword) {
  return bcrypt.compareSync(inputPassword, hashedPassword);
}

module.exports = { hashPassword, comparePasswords };
