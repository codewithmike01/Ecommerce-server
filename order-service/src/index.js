const express = require('express');
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});
const cors = require('cors');
const bodyParser = require('body-parser');
const orderRouter = require('./routes/orderRoutes');

const swaggerSpecs = require('../swagger');
const swaggerUi = require('swagger-ui-express');
const mongoose = require('mongoose');
const { consumeOrder } = require('../services/broker');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to Order Service db!!'))
  .catch((err) => console.log('Error in Order service db ', err));

async function rabbitMQConnect() {
  // Consume message
  await consumeOrder();
}

// Call connector
rabbitMQConnect();

app.use('/api/orders', orderRouter);

// swagger doc
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// User server port
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(` Order Service, ${4000}`);
});
