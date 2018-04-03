module.exports = {
  BLOCKCHAIN_ERROR: {
    code: -300,
    data: 'Blockchain: error '
  },
  BLOCKCHAIN_INITIALIZATION_ERROR: {
    code: -301,
    data: 'Blockchain: initialization error '
  },
  BLOCKCHAIN_UNINITIALIZED_ERROR: {
    code: -302,
    data: 'Blockchain: uninitialized yet '
  },
  BLOCKCHAIN_INCORRECT_CONTRACT: {
    code: -303,
    data: 'Blockchain: incorrect contract'
  },

  VALIDATION_ERROR: {
    code: -400,
    data: 'Validation: error '
  },
  VALIDATION_PARSING_ERROR: {
    code: -401,
    data: 'Validation: parsing error '
  },
  VALIDATION_MODEL_ERROR: {
    code: -402,
    data: 'Validation: model verification error '
  },
  VALIDATION_CONFIG_ERROR: {
    code: -403,
    data: 'Validation: incorrect or incomplete config '
  },

  PROVIDER_ERROR: {
    code: -500,
    data: 'Provider: error'
  },
  PROVIDER_UNKONOWN_ENDPOINT: {
    code: -501,
    data: 'Provider: unknown endpoint '
  },
  PROVIDER_EXCHANGE_ERROR: {
    code: -502,
    data: 'Provider: exchange error '
  },
  PROVIDER_WRONG_API_KEY: {
    code: -503,
    data: 'Provider: invalid API key '
  },
  PROVIDER_EXCHANGE_CRASHES: {
    code: -504,
    data: 'Provider: exchange backend unknown error '
  },
  PROVIDER_WRONG_MARKET: {
    code: -505,
    data: 'Provider: invalid market'
  },
  PROVIDER_INSUFFICIENT_FUNDS: {
    code: -506,
    data: 'Provider: insufficient funds'
  },
  PROVIDER_NO_QUANTITY: {
    code: -507,
    data: 'Provider: quantity in not provided'
  },
  PROVIDER_ORDER_TOO_SMALL: {
    code: -507,
    data: 'Provider: min trade requirement is not met'
  },
  PROVIDER_DUST_ORDER: {
    code: -508,
    data: 'Provider: order price is too low (dust order)'
  },
  PROVIDER_ORDER_NOT_OPEN: {
    code: -509,
    data: 'Provider: order is not open'
  },
  PROVIDER_ORDER_REFERENCE_INCORRECT: {
    code: -510,
    data: 'Provider: order reference is incorrect'
  },
  PROVIDER_ORDER_REFERENCE_INVALID: {
    code: -511,
    data: 'Provider: order reference is invalid'
  },

  AMQP_ERROR: {
    code: -600,
    data: 'AMQP: error'
  },
  AMQP_CONNECTION_ERROR: {
    code: -601,
    data: 'AMQP: connection error'
  },
  AMQP_BINDING_ERROR: {
    code: -602,
    data: 'AMQP: connection error'
  },
  AMQP_MESSAGE_DECODING_ERROR: {
    code: -603,
    data: 'AMQP: message decoding error'
  },
  AMQP_INCORRECT_MESSAGE: {
    code: -604,
    data: 'AMQP: incorrect message'
  },

  MEMC_ERROR: {
    code: -700,
    data: 'Memcached: error'
  },
  MEMC_READ_ERROR: {
    code: -701,
    data: 'Memcached: error on reading '
  },
  MEMC_WRITE_ERROR: {
    code: -702,
    data: 'Memcached: error on writting '
  },

  REST_ERROR: {
    code: -800,
    data: 'REST: error'
  },
  REST_UNKNOWN_CALL: {
    code: -801,
    data: 'REST: unknown call'
  },
  REST_NO_EXCHANGE: {
    code: -802,
    data: 'REST: exchange is not set'
  },
  REST_INCORRECT_EXCHANGE: {
    code: -803,
    data: 'REST: incorrect exchange'
  },
  REST_API_KEY_REQUIRED: {
    code: -804,
    data: 'REST: this request requires an API key'
  },
  REST_WRONG_PARAMETERS: {
    code: -805,
    data: 'REST: wrong parameters'
  },
  REST_REQUEST_BODY: {
    code: -806,
    data: 'REST: request body parsing error'
  },

  GENERAL: {
    code: -900,
    data: 'GENERAL: failure'
  },
  GENERAL_EXPRESS_BIND_FAILURE: {
    code: -901,
    data: 'GENERAL: unable to initiate web server'
  },
};
