
const errors = require('./errors');
module.exports = async ({msg, blockchain}) => {
  const routingKey = msg.fields.routingKey.split('.');
  const route  = routingKey[0];
  try {
    let arg;
    try {
      arg  = JSON.parse(msg.content);
    } catch (e) {
      throw new Error(errors.VALIDATION_PARSING_ERROR.data + msg.content.toString());
    }
    if(route !== 'toState'){
      throw new Error(errors.AMQP_INCORRECT_MESSAGE.data);
    }
    if(arg.state !== 'verified' &&  arg.state !== 'finished'  &&  arg.state !== 'halted' ){
      throw new Error(errors.AMQP_INCORRECT_MESSAGE.data);
    }
    if(!arg.dealId){
      throw new Error(errors.AMQP_INCORRECT_MESSAGE.data);
    }
    console.log(`"Setting contract's  #${arg.dealId} state to ${arg.state}"`);
    const stateChangeStatus =  await blockchain.dealStateUpdate({
      dealId: arg.dealId,
      state: arg.state,
      finishAmount: arg.finishAmount
    });
    console.log(stateChangeStatus);
  } catch (e) {
    console.error(e);
  }
};
