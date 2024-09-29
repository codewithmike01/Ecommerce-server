const { Product, ProductCategory } = require('../model/productModel');
const { createBrokerChannel } = require('../service/broker');
const { getPrice } = require('../utils/productGetter');

const createProduct = async (req, res) => {
  const productItem = req.body;

  // Create product object
  const productObj = new Product(productItem);

  try {
    const product = await productObj.save();

    return res.status(200).json({ product });
  } catch (err) {
    return res.json({ message: err?.message || 'Unable too save product' });
  }
};

const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      const product = await Product.findOne({ _id: id }).populate('categories');

      if (!product)
        return res.status(404).json({ message: 'Product not found' });

      return res.status(200).json(product);
    } else {
      const product = await Product.find().populate('categories');

      return res.status(200).json({ product });
    }
  } catch (err) {
    return res.status(500).json({ message: err?.message || 'Server error' });
  }
};

const createCategory = async (req, res) => {
  const categoryItem = req.body;

  // Create product object
  const productCategoryObj = new ProductCategory({
    name: categoryItem?.name.toLowerCase(),
    ...categoryItem,
  });

  try {
    const category = await productCategoryObj.save();

    return res.status(200).json({ category });
  } catch (err) {
    return res.json({ message: err?.message || 'Unable too save category' });
  }
};

const getCategory = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      const category = await ProductCategory.findOne({ _id: id });

      if (!category)
        return res.status(404).json({ message: 'Product not found' });

      return res.status(200).json(category);
    } else {
      const category = await ProductCategory.find();

      return res.status(200).json({ category });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const purchaseProduct = async (req, res) => {
  const user = req.user;
  const { ids } = req.body;

  // Start connection
  const { channel, connection } = await createBrokerChannel();

  try {
    const products = await Product.find({ _id: { $in: ids } });

    channel.sendToQueue(
      'ORDER-create_order',
      Buffer.from(
        JSON.stringify({
          query: 'PRODUCT-get_order',
          products,
          userId: user?.id,
        })
      )
    );

    // listen too consume item in queue
    const order = await new Promise((resolve, reject) => {
      channel.consume('PRODUCT-get_order', (data) => {
        if (data !== null) {
          const parsedData = JSON.parse(data.content);

          const { total_price, ...others } = parsedData.newOrder;

          channel.ack(data);

          return resolve({
            ...others,
            total_price: getPrice(total_price['$numberDecimal']),
          });
        } else {
          return res
            .status(500)
            .json({ message: 'No data recieved from the queue' });
        }
      });
    });

    return res.status(200).json({
      order: order,
    });
  } catch (err) {
    return res.json({ message: err?.message || 'Unexpected error occured' });
  } finally {
    // Clean up resources
    await channel.close(); // Close the channel
    await connection.close(); // Close the connection
  }
};

module.exports = {
  createProduct,
  getProduct,
  getCategory,
  createCategory,
  purchaseProduct,
};
