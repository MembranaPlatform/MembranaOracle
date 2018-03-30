module.exports =  {
  'oracle': {
    'exchange': String,
    'newContractExchange':  String,
    'queue': String,
    'blockchain': {
      'gasPrice': 'numeric(<0,>)',
      'gasLimit': 'numeric(<0,>)',
      'provider': String,
      'dealsAddress': String,
      'oracleAddress': String,
      'oraclePrivateKey': String
    }
  }
};
