const winston = require('winston')

require('request-debug')(require('request-promise-native'), (type, data) => {
  winston.info(type, data)
})
