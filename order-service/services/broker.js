const amqp = require('amqplib');
const { createOrder } = require('../src/controller/orderController');
const jwt = require('jsonwebtoken');

const amqpServer = process.env.RABBITMQ_URL;

async function createBrokerChannel() {
  const connection = await amqp.connect(amqpServer);

  const channel = await connection.createChannel();

  // Assert Queues
  await channel.assertQueue('ORDER-create_order');

  await channel.assertQueue('PRODUCT-get_order');

  await channel.assertQueue('ORDER-isAuthenticate');

  await channel.assertQueue('PRODUCT-isAuthenticate');

  await channel.assertQueue('USER-isAuthenticate');

  return { channel, connection };
}

async function consumeOrder() {
  const { channel } = await createBrokerChannel();

  try {
    channel.consume('ORDER-create_order', async (message) => {
      if (!message)
        throw { message: 'Error: Message is empty in Order consume' };

      const { query, products, userId } = JSON.parse(message.content);

      // Perform payment transactions

      // Save order
      const newOrder = await createOrder(products, userId);

      channel.ack(message);

      // Sending back to queue product
      channel.sendToQueue(query, Buffer.from(JSON.stringify({ newOrder })));
    });
  } catch (err) {
    console.error('RabbitMQ connection/channel creation failed:', err);
    throw err;
  }
}

async function isUserAuthenticated(req, res, next) {
  const { channel, connection } = await createBrokerChannel();

  // Get token
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(405)
      .json({ message: 'Unauthorized user - Missing token' });
  }

  let tokenVal = token;
  if (token.startsWith('Bearer ')) {
    tokenVal = token.slice(7, token.length).trimLeft();
  }

  const decodedToken = jwt.verify(tokenVal, process.env.JWT_SECRET);

  // Checck if user exist
  channel.sendToQueue(
    'USER-isAuthenticate',
    Buffer.from(
      JSON.stringify({
        query: 'ORDER-isAuthenticate',
        userId: decodedToken.id,
      })
    )
  );

  channel.consume('ORDER-isAuthenticate', async (message) => {
    if (message) {
      const parsedData = JSON.parse(message.content);

      channel.ack(message);

      if (parsedData.isAuthentic) {
        req.user = decodedToken;

        next(); // User is authenticated, proceed to the next middleware
      } else {
        return res.status(401).json({ error: 'Unauthorized - Invalid user' });
      }
    } else {
      console.log(' No response consume ');
      return res.status(500).json({ error: 'No response from user service' });
    }

    await channel.close(); // Close the channel
    await connection.close(); // Close the connection
  });
}

module.exports = { createBrokerChannel, consumeOrder, isUserAuthenticated };
