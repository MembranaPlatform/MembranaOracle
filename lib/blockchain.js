module.exports = class{
  constructor({dealsAddress, oracleAddress, oraclePrivateKey, amqp}){
    this.dealsAddress = dealsAddress;
    this.oracleAddress = oracleAddress;
    this.oraclePrivateKey = oraclePrivateKey;
    this.amqp = amqp;
  }
  async init(){
    
  }
};
