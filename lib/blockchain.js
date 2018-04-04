
const Web3 = require('web3');
const errors = require('./errors');
const util = require('./util');
const validate  = require('validate-fields')();
const Contract  = require('../Schemas/Contract.js');

module.exports = class {
  constructor({dealsAddress, dealsAbi, oracleAddress, oraclePrivateKey, provider, gasPrice, gasLimit, eventsLookupInterval,  newDealCallback}){
    this.dealsAddress = dealsAddress;
    this.dealsAbi = dealsAbi;
    this.oracleAddress = oracleAddress;
    this.oraclePrivateKey = oraclePrivateKey;
    this.provider = provider;
    this.gasPrice = gasPrice;
    this.gasLimit = gasLimit;
    this.eventsLookupInterval = eventsLookupInterval;
    this.newDealCallback = newDealCallback;
  }
  async deinit(){
    this.initialized = false;
  }
  async init(){
    if(!this.dealsAddress || ! this.dealsAbi || !this.oracleAddress
       || !this.oraclePrivateKey || !this.provider || !this.gasPrice
      || !this.gasLimit || !this.eventsLookupInterval|| !this.newDealCallback){
      throw new Error(errors.BLOCKCHAIN_UNINITIALIZED_ERROR.data);
    }
    if(typeof this.provider === 'string'){
      this.web3 = new Web3(new Web3.providers.HttpProvider(this.provider));
    } else {
      this.web3 = new Web3(this.provider);
    }
    this.web3.gasPrice = this.web3.utils.toHex(this.web3.utils.toWei(this.gasPrice, 'gwei'));
    this.web3.gasLimit = this.web3.utils.toHex(this.gasLimit);
    this.web3.eth.accounts.wallet.add(this.oraclePrivateKey);
    this.dealsContract = new this.web3.eth.Contract(this.dealsAbi, this.dealsAddress);
    this.initialized = true;
  }

  async eventProcessing({lastBlock}){
    try {
      console.log(`checking events from block "#${lastBlock}"`);
      let dealsEvents = await this.dealsContract.getPastEvents('spawnInstance', {fromBlock: lastBlock});
      for (let i of dealsEvents) {
        // const tx = i.transactionHash;
        let dealId = i.returnValues.dealId;
        let offerId = this.web3.utils.toHex(i.returnValues.offer);
        offerId = offerId.slice(2);
        let state = await this.web3.eth.call({
          to: this.dealsAddress,
          data: this.dealsContract.methods.getState(dealId).encodeABI()
        });
        state  = this.web3.utils.hexToNumber(state);
        const contractDetails = await this.dealsContract.methods.deals(dealId).call();

        console.log(`dealId #${dealId} found`);
        if (state === 0){
          console.log(`dealId #${dealId} has 0 state`);
          if(!validate(Contract,contractDetails)){
            console.log(contractDetails);
            console.error(errors.BLOCKCHAIN_INCORRECT_CONTRACT.data);
          }
          await this.newDealCallback({
            currentState: contractDetails.currentState,
            start: contractDetails.start,
            deadline: contractDetails.deadline,
            maxLoss: contractDetails.maxLoss,
            startBalance: contractDetails.startBalance,
            targetBalance: contractDetails.targetBalance,
            amount: contractDetails.amount,
            currency: contractDetails.currency,
            investor: contractDetails.investor,
            investorAddress: contractDetails.investorAddress,
            trader: contractDetails.trader,
            traderAddress: contractDetails.traderAddress,
          });
        }
      }
      return await this.web3.eth.getBlockNumber();
    } catch (e) {
      console.error(e);
      return lastBlock;
    }
  }
  async startEventProcessingLoop(){
    if(!this.initialized){
      throw new Error(errors.BLOCKCHAIN_UNINITIALIZED_ERROR.data);
    }
    this.eventProcessingLoopRunned = true;
    let lastBlock = 0;
    while(this.eventProcessingLoopRunned){
      try {
        lastBlock = await this.eventProcessing({lastBlock});
        await util.sleep(this.eventsLookupInterval);
      } catch (e) {
        console.error(e);
      }
    }
  }
  stopEventProcessingLoop(){
    this.eventProcessingLoopRunned = false;
  }
  async dealStateUpdate({dealId, state, finishAmount}){
    if(!this.initialized){
      throw new Error(errors.BLOCKCHAIN_UNINITIALIZED_ERROR.data);
    }
    switch (state) {
    case 'verified':
      await this.dealsContract.methods.setVerified(dealId).send({
        from:this.oracleAddress,
        gasPrice: this.gasPrice,
        gas: this.gasLimit,
      });
      break;
    case 'halted':
      await this.dealsContract.methods.setHalted(dealId).send({
        from:this.oracleAddress,
        gasPrice: this.gasPrice,
        gas: this.gasLimit,
      });
      break;
    case 'finished':
      if(!finishAmount){
        throw new Error(errors.BLOCKCHAIN_WRONG_FINISH_AMOUNT.data);
      }
      await this.dealsContract.methods.setFinished(dealId, finishAmount).send({
        from:this.oracleAddress,
        gasPrice: this.gasPrice,
        gas: this.gasLimit,
      });
      break;
    default:
      throw new Error(errors.BLOCKCHAIN_WRONG_DEAL_STATE.data);
    }
    console.log(`Updating deal #${dealId} to "${state}"`);
  }
};
