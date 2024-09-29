const amqp = require('amqplib');
const { isUserExist } = require('../utils/dbUtils');

const amqpServer = process.env.RABBITMQ_URL;

async function createBrokerChannel() {
  try {
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();

    // Assert Queues
    await channel.assertQueue('ORDER');

    await channel.assertQueue('PRODUCT');

    await channel.assertQueue('USER');

    return { channel, connection };
  } catch (err) {
    console.log(err?.message || 'Error from user broker connection');
    throw err;
  }
}

async function consumeUser() {
  const { channel } = await createBrokerChannel();

  channel.consume('USER-isAuthenticate', async (message) => {
    const { type, query, ...payload } = JSON.parse(message.content);

    // Check if user is in db
    const isAuthentic = isUserExist(payload.userId);

    // Ack message
    channel.ack(message);

    console.log(' User message ', isAuthentic, ' Query --- ', query);

    // return data to calling point
    channel.sendToQueue(
      query,
      Buffer.from(JSON.stringify({ isAuthentic, type }))
    );
  });
}

module.exports = { createBrokerChannel, consumeUser };
