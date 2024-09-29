const mongoose = require('mongoose');
const { getPrice } = require('../utils/orderGetter');

const orderSchema = new mongoose.Schema(
  {
    products: [{ productId: String }],
    userId: String,
    total_price: {
      type: mongoose.Decimal128,
      get: getPrice,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      getter: true,
      transform: function (doc, ret, options) {
        const { _id: id } = ret;
        delete ret._id;
        delete ret.__v;

        if (ret.products) {
          ret.products = ret.products.map((product) => ({
            productId: product.productId,
          }));
        }

        ret.total_price = getPrice(ret.total_price);

        return { id, ...ret };
      },
    },
  }
);

const Order = mongoose.model('order', orderSchema);

module.exports = Order;
