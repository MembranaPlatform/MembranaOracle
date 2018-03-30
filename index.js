const config = require('config');
const errors = require('./lib/errors');
const Config = require('./Schemas/Config');
const Blockchain = require('./lib/blockchain');
const Amqp = require('./lib/connection');
const validate  = require('validate-fields')();
const dealsAbi =  require('./abi/MembranaDeals.js');
const amqpRouter = require('./lib/amqpRouter');
const amqpHost = config.get('amqp.host');
const amqpPort = config.get('amqp.port');
const amqpVhost = config.get('amqp.vhost');
const exchange = config.get('oracle.exchange');
const dealsAddress =  config.get('oracle.blockchain.dealsAddress');
const oracleAddress =  config.get('oracle.blockchain.oracleAddress');
const oraclePrivateKey =  config.get('oracle.blockchain.oraclePrivateKey');
const newContractExchange = config.get('oracle.newContractExchange');
const queue = config.get('oracle.queue');

(async () => {
  // if(!validate(Config, config.valueOf())) {
  //   throw new Error(errors.VALIDATION_CONFIG_ERROR.data);
  // }
  const amqp  = new Amqp({
    url: `amqp://${amqpHost}:${amqpPort}/${amqpVhost}`
  });
  // const blockchain = new Blockchain({dealsAddress, oracleAddress, oraclePrivateKey, amqp});
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
    // amqp.channel.consume(queue, msg => amqpRouter({msg, blockchain}), {noAck: true});
  };
  try {
    await amqp.init();
    // await blockchain.init();
    // blockchain.eventProcessing();
  } catch (e) {
    throw errors.AMQP_CONNECTION_ERROR.data;
  }
})();
