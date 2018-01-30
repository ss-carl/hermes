const environment = require('./environment')
const winston = require('winston')

const logging_transports = [
  new winston.transports.Console({
    colorize: !environment.is_production,
    json: environment.is_production,
    stringify: environment.is_production,
  }),
]

const winston_config = {
  transports: logging_transports,
  meta: true,
  dynamicMeta: req => {
    return {
      seller_id: req.seller_id,
      seller_provider_id: req.seller_provider_id,
      seller_email: req.seller_email,
      transaction_id: req.transaction_id,
    }
  },
}

winston.configure(winston_config)

module.exports = winston_config
