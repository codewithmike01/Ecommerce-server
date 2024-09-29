const User = require('../model/userModel');

const isUserExist = (id) => {
  const user = User.findById(id);

  const isAuthentic = user ? true : false;

  return isAuthentic;
};

module.exports = { isUserExist };
