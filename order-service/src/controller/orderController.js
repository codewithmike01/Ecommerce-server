const Order = require('../model/orderModel');

const createOrder = async (products, userId) => {
  // Calculate the total price
  const totalPrice = products.reduce((total, product) => {
    return total + product.price;
  }, 0);

  const newProduct = products.map((product) => ({ productId: product.id }));

  const newOrder = new Order({
    products: newProduct,
    userId,
    total_price: totalPrice,
  });

  try {
    await newOrder.save();

    return newOrder;
  } catch (err) {
    throw new Error(err?.message || ' Error saving order ');
  }
};

const getOrder = async (req, res) => {
  const user = req.user;

  try {
    const userOrder = await Order.find({ userId: user?.id });

    res.status(200).json({ order: userOrder });
  } catch (err) {
    console.log(err, ' error ');
    res.json({ message: err?.message || 'Unexpected error occured' });
  }
};

module.exports = { createOrder, getOrder };
