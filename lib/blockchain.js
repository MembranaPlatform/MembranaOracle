const config = require('config');
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
      throw errors.BLOCKCHAIN_INITIALIZATION_ERROR.data;
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
        const tx = i.transactionHash;
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
          // console.log(contractDetails);
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
          // let offerDetails = await getOfferDetails(offerId);
          // if (!offerDetails){
          //   console.error(`offer ${offerId} not found or wrong STATE`);
          //   continue;
          // }
          // console.log(contractDetails);
          // console.log(offerDetails);
          // if(!(await verify(offerId,contractDetails, offerDetails, dealId))) {
          //   console.error(`offer ${offerId} looks like a fake`);
          // }
          // await verifyContract(web3, MercatusDeals, dealId);
        }
      }
      return await this.web3.eth.getBlockNumber();
    } catch (e) {
      console.error(e);
      return lastBlock;
    }
  }
  async eventProcessingLoop(){
    if(!this.initialized){
      throw errors.BLOCKCHAIN_UNINITIALIZED_ERROR.data;
    }
    let lastBlock = 0;
    while(this.initialized){
      try {
        lastBlock = await this.eventProcessing({lastBlock});
        await util.sleep(this.eventsLookupInterval);
      } catch (e) {
        console.error(e);
      }
    }
  }

};
