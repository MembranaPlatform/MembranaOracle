module.exports = {
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

  GENERAL: {
    code: -900,
    data: 'GENERAL: failure'
  },
  GENERAL_EXPRESS_BIND_FAILURE: {
    code: -901,
    data: 'GENERAL: unable to initiate web server'
  },
};
