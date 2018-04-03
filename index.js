const config = require('config');
const errors = require('./lib/errors');
// const Config = require('./Schemas/Config');
const Blockchain = require('./lib/blockchain');
const Amqp = require('./lib/connection');
const validate  = require('validate-fields')();
const dealsAbi =  require('./abi/MembranaDeals.js');
const amqpRouter = require('./lib/amqpRouter');
const amqpHost = config.get('amqp.host');
const amqpPort = config.get('amqp.port');
const amqpVhost = config.get('amqp.vhost');
const exchange = config.get('oracle.exchange');
const blockchainSettings =  config.get('oracle.blockchain');
const queue = config.get('oracle.queue');
const newContractExchange = config.get('oracle.newContractExchange');

(async () => {
  // if(!validate(Config, config.valueOf())) {
  //   throw new Error(errors.VALIDATION_CONFIG_ERROR.data);
  // }
  const amqp  = new Amqp({
    url: `amqp://${amqpHost}:${amqpPort}/${amqpVhost}`
  });
  const blockchain = new Blockchain({dealsAbi, ...blockchainSettings,
    newDealCallback: async (data) => {
      try {
        const chan = await amqp.getChannel();
        chan.publish(this.newContractExchange, 'new', Buffer.from(JSON.stringify(data)));
      } catch (e) {
        throw new Error(errors.AMQP_ERROR.data);
      }
    }});
  amqp.onChannelCreated = async () => {
    console.log('channelCreated..');
    try {
      (await amqp.getChannel()).assertExchange(exchange, 'topic', {durable: true});
      (await amqp.getChannel()).assertExchange(newContractExchange, 'topic', {durable: true});
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
    console.error(e);
    throw errors.AMQP_CONNECTION_ERROR.data;
  }
  try {
    await blockchain.init();
  } catch (e) {
    console.error(e);
    throw errors.BLOCKCHAIN_INITIALIZATION_ERROR.data;
  }
  blockchain.eventProcessingLoop();
})();
