const chai = require('chai');
const ganache = require('ganache-cli');
const expect = chai.expect;
const Web3 = require('web3');
const Blockchain = require('../lib/blockchain');
let blockchainSettings;
const dealsAbi = require('../abi/MembranaDeals.js');
const DealsBinary = require('./MembranaDeals.js');
const BN = require('bn.js');
let web3, acc1, acc2, acc3, membranaDeals, blockchain, dealParams;

describe('testing deal creating event',  () => {
  before('testnet initialization...', async () => {
    blockchainSettings = require('./config.js');
    // module.exports = {
    //  gasPrice: '99',
    //  gasLimit: '5000000',
    //  oracleAddress: '',
    //  oraclePrivateKey: '',
    //  eventsLookupInterval: 3000
    // };
    blockchainSettings.provider =  ganache.provider();
    web3 = new Web3(blockchainSettings.provider);
    [acc1, acc2, acc3] = await web3.eth.personal.getAccounts();
    dealParams = {
      duration: 31,
      maxLoss: 20,
      startBalance: 10000000,
      targetBalance: 20000000,
      amount: 15000000,
      investor: 'theInvestor',
      investorAddress: acc1,
      trader: 'mrTrader',
      traderAddress: acc2,
      offerId: '31337',
      currency: 0,
    };
  });

  it('topping up Oracle balance', async () => {
    await web3.eth.sendTransaction({from: acc3, to: blockchainSettings.oracleAddress, value: 10 ** 12});
    web3.gasPrice = web3.utils.toHex(web3.utils.toWei(blockchainSettings.gasPrice, 'gwei'));
    web3.gasLimit = web3.utils.toHex(blockchainSettings.gasLimit);
    const oracleBalance = await web3.eth.getBalance(blockchainSettings.oracleAddress);
    expect(oracleBalance).to.equal(String(10 ** 12));
  });

  it('deploing the contract', async () => {
    const MembranaDeals =  new web3.eth.Contract(dealsAbi);
    membranaDeals = await MembranaDeals.deploy({data: DealsBinary}).send({from:acc1, gasPrice: 99, gas: 5000000});
    blockchainSettings.dealsAddress = membranaDeals.options.address;
    const dealsCount = await membranaDeals.methods.getDealsCount().call();
    expect(dealsCount).to.equal('0');
  });

  it('blockchain event listner initialization', async () => {
    blockchain = new Blockchain({dealsAbi, ...blockchainSettings,
      newDealCallback: async(data) => {
        console.log(data);
        blockchain.stopEventProcessingLoop();
      }
    });
    await blockchain.init();
    blockchain.startEventProcessingLoop();
  });

  it('creating valid new deal', async  () => {
    await membranaDeals.methods.makeDeal(
      dealParams.duration, dealParams.maxLoss, dealParams.startBalance,
      dealParams.targetBalance, dealParams.amount , dealParams.investor,
      dealParams.investorAddress ,dealParams.trader, dealParams.traderAddress,
      dealParams.offerId, dealParams.currency ).send({
      from: dealParams.investorAddress,
      gasPrice: blockchainSettings.gasPrice,
      gas: blockchainSettings.gasLimit,
      value:  dealParams.amount
    });
    const dealsCount = await membranaDeals.methods.getDealsCount().call();
    const dealsBalance = await web3.eth.getBalance(blockchainSettings.dealsAddress);
    expect(dealsCount).to.equal('1');
    expect(dealsBalance).to.equal(String(dealParams.amount));
  });
  it('waiting 5 sec',  async () => {
    await new Promise(res => setTimeout(res, 5000));
  });
  it('checking new deal state', async  () => {
    const dealState = await membranaDeals.methods.getState(0).call();
    expect(dealState).to.equal('0');
  });
  it('verifying the deal', async  () => {
    await blockchain.dealStateUpdate({
      dealId: 0,
      state: 'verified',
    });
    const dealState = await membranaDeals.methods.getState(0).call();
    expect(dealState).to.equal('1');
  });
  it('finishing the deal with 3/4 target profit reach', async  () => {
    const acc1balance1 = await web3.eth.getBalance(acc1);
    const acc2balance1 = await web3.eth.getBalance(acc2);
    const dealsBalance1 = await web3.eth.getBalance(await blockchainSettings.dealsAddress);
    await blockchain.dealStateUpdate({
      dealId: 0,
      state: 'finished',
      finishAmount: dealParams.startBalance + (dealParams.targetBalance - dealParams.startBalance)*3/4
    });
    const dealState = await membranaDeals.methods.getState(0).call();
    const acc1balance2 = await web3.eth.getBalance(acc1);
    const acc2balance2 = await web3.eth.getBalance(acc2);
    const dealsBalance2 = await web3.eth.getBalance(blockchainSettings.dealsAddress);
    const acc1Return = (new BN(acc1balance2).sub(new BN(acc1balance1))).toString();
    const acc2Return = (new BN(acc2balance2).sub(new BN(acc2balance1))).toString();
    expect(dealState).to.equal('3');
    expect(dealsBalance1).to.equal(String(dealParams.amount));
    expect(dealsBalance2).to.equal('0');
    expect(acc1Return).to.equal(String((1 / 4) * dealParams.amount));
    expect(acc2Return).to.equal(String((3 / 4) * dealParams.amount));
  });

  it('ceating and halting new deal', async  () => {
    await membranaDeals.methods.makeDeal(
      dealParams.duration, dealParams.maxLoss, dealParams.startBalance,
      dealParams.targetBalance, dealParams.amount , dealParams.investor,
      dealParams.investorAddress ,dealParams.trader, dealParams.traderAddress,
      dealParams.offerId, dealParams.currency ).send({
      from: dealParams.investorAddress,
      gasPrice: blockchainSettings.gasPrice,
      gas: blockchainSettings.gasLimit,
      value:  dealParams.amount
    });
    await blockchain.dealStateUpdate({
      dealId: 1,
      state: 'verified',
    });
    const acc1balance1 = await web3.eth.getBalance(acc1);
    const acc2balance1 = await web3.eth.getBalance(acc2);
    const dealsBalance1 = await web3.eth.getBalance(await blockchainSettings.dealsAddress);
    await blockchain.dealStateUpdate({
      dealId: 1,
      state: 'halted',
      finishAmount: dealParams.startBalance + (dealParams.targetBalance - dealParams.startBalance)*3/4
    });
    const dealState = await membranaDeals.methods.getState(1).call();
    const acc1balance2 = await web3.eth.getBalance(acc1);
    const acc2balance2 = await web3.eth.getBalance(acc2);
    const dealsBalance2 = await web3.eth.getBalance(blockchainSettings.dealsAddress);
    const acc1Return = (new BN(acc1balance2).sub(new BN(acc1balance1))).toString();
    const acc2Return = (new BN(acc2balance2).sub(new BN(acc2balance1))).toString();
    expect(dealsBalance1).to.equal(String(dealParams.amount));
    expect(dealsBalance2).to.equal('0');
    expect(acc1Return).to.equal('0');
    expect(acc2Return).to.equal(String(dealParams.amount));
    expect(dealState).to.equal('2');
  });
});
