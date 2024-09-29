// import user model

const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { hashString } = require('../services/crypt');

const register = async (req, res) => {
  const { email, password, username } = req.body;

  const user = await User.findOne({ email });

  if (user) return res.json({ message: 'User already exist' });

  const hashedPassword = await hashString(password);

  const newUser = new User({
    email,
    password: hashedPassword,
    username,
  });

  try {
    await newUser.save();

    // Create jwt auth
    const jwtPayload = {
      email,
      username,
      id: newUser._id,
    };

    jwt.sign(jwtPayload, process.env.JWT_SECRET, (err, token) => {
      if (err) {
        return res.json({ messaage: err?.message || 'Jwt error' });
      }

      return res.status(200).json({
        user: newUser,
        token,
      });
    });
  } catch (err) {
    res
      .status(404)
      .json({ message: err?.message || 'Unexpected error creating user' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exist
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User does not exist' });

  // Check if passowrd is valid
  const isPassowrdMatch = bcrypt.compare(password, user?.password);

  if (!isPassowrdMatch)
    return res.status(405).json({ messaage: 'Invalid credentials' });

  // Create jwt auth
  const jwtPayload = {
    email,
    username: user?.username,
    id: user._id,
  };

  jwt.sign(jwtPayload, process.env.JWT_SECRET, (err, token) => {
    if (err) {
      return res.json({ messaage: err?.message || 'Jwt error' });
    }

    return res.status(200).json({ user, token });
  });
};

module.exports = { register, login };
