const router = require('express').Router();
const {
  createProduct,
  getProduct,
  createCategory,
  getCategory,
  purchaseProduct,
} = require('../controller/productController');
const { isUserAuthenticated } = require('../service/broker');

router.post('/category', isUserAuthenticated, createCategory);

router.get('/category', getCategory);

router.get('/:id?', getProduct);

router.post('/', isUserAuthenticated, createProduct);

router.post('/purchase', isUserAuthenticated, purchaseProduct);

module.exports = router;
