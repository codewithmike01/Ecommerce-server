const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const saltRounds = 10;

const hashString = async (password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  return hashedPassword;
};

module.exports = { hashString };
