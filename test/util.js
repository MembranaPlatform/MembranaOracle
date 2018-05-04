
const Amqp = require('./fakeAmqp');

function initAmqp({ cb}) {
  let amqp = new Amqp(cb);
  amqp = {...amqp, getChannel: amqp.getChannel};
  return amqp;
}

function buildMsgForAmqpRouter({exchange, routingKey, arg}) {
  return {
    fields: {
      routingKey,
      exchange
    },
    content: JSON.stringify(arg)
  };
}

function lastCall(spy, offset = 0) {
  const calls = spy.getCalls();
  return calls[calls.length - offset - 1];
}

module.exports = {
  initAmqp,
  buildMsgForAmqpRouter,
  lastCall
};
