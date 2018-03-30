const Web3 = require('web3');
const errors = require('../lib/errors');

module.exports = class{
  constructor({dealsAddress, dealsAbi, oracleAddress, oraclePrivateKey, provider, gasPrice, gasLimit,  amqp}){
    this.dealsAddress = dealsAddress;
    this.dealsAbi = dealsAbi;
    this.oracleAddress = oracleAddress;
    this.oraclePrivateKey = oraclePrivateKey;
    this.provider = provider;
    this.gasPrice = gasPrice;
    this.gasLimit = gasLimit;
    this.amqp = amqp;
  }
  async init(){
    if(!this.dealsAddress || ! this.dealsAbi || !this.oracleAddress
       || !this.oraclePrivateKey || !this.provider || !this.gasPrice
      || !this.gasLimit || !this.amqp){
      throw errors.BLOCKCHAIN_INITIALIZATION_ERROR.data;
    }
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.provider));
    this.web3.gasPrice = this.web3.utils.toHex(this.web3.utils.toWei(this.gasPrice, 'gwei'));
    this.web3.gasLimit = this.web3.utils.toHex(this.gasLimit);
    this.web3.eth.accounts.wallet.add(this.oraclePrivateKey);
  }
  async eventProcessing(){
    
  }
};
