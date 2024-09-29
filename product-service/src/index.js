const express = require('express');
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});
require('./service/broker');
const bodyParser = require('body-parser');
const cors = require('cors');
const productRoutes = require('./routes/productRoute');
const mongoose = require('mongoose');
const swaggerSpecs = require('../swagger');
const swaggerUi = require('swagger-ui-express');

const app = express();

// swagger doc
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to Product db!!'))
  .catch((err) => console.log('Error in Product db ', err));

// middleware
app.use(bodyParser.json());
app.use(cors());

app.use('/api/products', productRoutes);

const productSP = process.env.PORT || 4001;

app.listen(productSP, () => {
  console.log('Product service port ', productSP);
});
