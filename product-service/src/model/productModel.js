const mongoose = require('mongoose');
const { getPrice } = require('../utils/productGetter');

const productCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Category name
    description: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret, options) {
        const { _id: id } = ret;
        delete ret._id;
        delete ret.__v;
        return { id, ...ret };
      },
    },
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: mongoose.Decimal128, get: getPrice, required: true, min: 0 },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory', // Reference to the ProductCategory model
        required: true,
      },
    ],
    stock: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      getters: true,
      transform: function (doc, ret, options) {
        const { _id: id } = ret;
        delete ret._id;
        delete ret.__v;

        let price = ret.price.$numberDecimal;

        return { id, price, ...ret };
      },
    },
  }
);

const Product = mongoose.model('product', productSchema);

//  the product Category MOdel
const ProductCategory = mongoose.model(
  'ProductCategory',
  productCategorySchema
);

module.exports = { Product, ProductCategory };
