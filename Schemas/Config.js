module.exports =  {
  'oracle': {
    'exchange': String,
    'newContractExchange':  String,
    'queue': String,
    'blockchain': {
      'gasPrice': 'numericInt(<0,>)',
      'gasLimit': 'numericInt(<0,>)',
      'provider': String,
      'dealsAddress': String,
      'oracleAddress': String,
      'oraclePrivateKey': String,
      'eventsLookupInterval': 'int(0,)'
    }
  }
};
