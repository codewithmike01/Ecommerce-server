const amqp = require('amqplib');
const jwt = require('jsonwebtoken');
const amqpServer = process.env.RABBITMQ_URL;

async function createBrokerChannel() {
  try {
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();

    // Assert Queues
    await channel.assertQueue('ORDER-create_order');

    await channel.assertQueue('PRODUCT-get_order');

    await channel.assertQueue('PRODUCT-isAuthenticate');

    await channel.assertQueue('USER-isAuthenticate');

    return { connection, channel };
  } catch (err) {
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
        query: 'PRODUCT-isAuthenticate',
        userId: decodedToken.id,
      })
    )
  );

  channel.consume('PRODUCT-isAuthenticate', async (message) => {
    if (message) {
      const parsedData = JSON.parse(message.content);
      channel.ack(message); // Acknowledge the message

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

module.exports = { createBrokerChannel, isUserAuthenticated };
