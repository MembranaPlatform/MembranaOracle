
const errors = require('./errors');
module.exports = ({msg, providers}) => {
  // const routingKey = msg.fields.routingKey.split('.');
  // const data  = routingKey[0];
  // const action  = routingKey[1];
  // try {
  //   let arg;
  //   try {
  //     arg  = JSON.parse(msg.content);
  //   } catch (e) {
  //     throw new Error(errors.VALIDATION_PARSING_ERROR.data + msg.content.toString());
  //   }
  //   if(action !== 'subscribe' &&  action !== 'unsubscribe' ){
  //     throw new Error(errors.AMQP_INCORRECT_MESSAGE.data);
  //   }
  //   if(!arg.exchange || !providers[arg.exchange]){
  //     throw new Error(errors.AMQP_INCORRECT_MESSAGE.data);
  //   }
  //   console.log(`fetching "${data}" for "${arg.exchange}" with symbol "${arg.symbol}"`);
  //   if(!arg.symbol) {
  //     throw new Error(errors.AMQP_INCORRECT_MESSAGE.data);
  //   }
  //   switch (data) {
  //   case 'balances':
  //     providers[arg.exchange].subscribe({
  //       key: `${arg.key}@${data}`,
  //       subscribe: action === 'subscribe',
  //       data: arg.secret
  //     });
  //     break;
  //   case 'candles':
  //     providers[arg.exchange].subscribe({
  //       key: `${arg.symbol}.${arg.interval}@${data}`,
  //       subscribe: action === 'subscribe',
  //     });
  //     break;
  //   case 'ticker':
  //   case 'trades':
  //   case 'orders':
  //     providers[arg.exchange].subscribe({
  //       key: `${arg.symbol}@${data}`,
  //       subscribe: action === 'subscribe',
  //     });
  //     break;
  //
  //   default:
  //     throw new Error(errors.AMQP_INCORRECT_MESSAGE.data);
  //   }
  //   console.log(msg);
  // } catch (e) {
  //   console.error(e);
  // }
};
