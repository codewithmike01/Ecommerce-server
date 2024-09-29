const express = require('express');
const { register, login } = require('../controller/userController');

const router = express.Router();

// Define user service routes

router.post('/register', register);

router.post('/login', login);

module.exports = router;
