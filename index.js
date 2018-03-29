const config = require('config');
const errors = require('./lib/errors');
const Blockchain = require('./lib/blockchain');
const Amqp = require('./lib/connection');
const amqpRouter = require('./lib/amqpRouter');
const amqpHost = config.get('amqp.host');
const amqpPort = config.get('amqp.port');
const amqpVhost = config.get('amqp.vhost');
const exchange = config.get('oracle.exchange');
const queue = config.get('oracle.queue');

(async () => {
  const amqp  = new Amqp({
    url: `amqp://${amqpHost}:${amqpPort}/${amqpVhost}`
  });
  const blockchain = new Blockchain({});
  amqp.onChannelCreated = async () => {
    console.log('channelCreated..');
    try {
      (await amqp.getChannel()).assertExchange(exchange, 'topic', {durable: true});
      (await amqp.getChannel()).assertQueue(queue, {exclusive: true});
    } catch (e) {
      console.error(e);
      throw new Error(errors.AMQP_ERROR.data);
    }
    try {
      (await amqp.getChannel()).bindQueue(queue, exchange, '#' );
    } catch (e) {
      console.error(e);
      throw new Error(errors.AMQP_BINDING_ERROR.data);
    }
    amqp.channel.consume(queue, msg => amqpRouter({msg, blockchain}), {noAck: true});
  };
  try {
    await amqp.init();
  } catch (e) {
    throw errors.AMQP_CONNECTION_ERROR.data;
  }
})();
