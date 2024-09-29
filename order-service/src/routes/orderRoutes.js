const { getOrder } = require('../controller/orderController');
const { isUserAuthenticated } = require('../../services/broker');

const router = require('express').Router();

router.get('/', isUserAuthenticated, getOrder);

module.exports = router;
