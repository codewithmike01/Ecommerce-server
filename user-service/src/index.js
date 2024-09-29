const express = require('express');
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
});
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const swaggerSpecs = require('../swagger');
const swaggerUi = require('swagger-ui-express');
const app = express();

// swagger doc
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const mongoose = require('mongoose');
const { consumeUser } = require('./services/broker');

// Mongo DB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('User DB connect successfully '))
  .catch((err) => console.log('Error connect User Db ', err));

// middleware
app.use(bodyParser.json());
app.use(cors());

// Routes use
app.use('/api/users', userRoutes);

async function rabbitMqConnect() {
  await consumeUser();
}

rabbitMqConnect();

const userSP = process.env.PORT || 4002;

app.listen(userSP, () => {
  console.log('User service port ', userSP);
});
