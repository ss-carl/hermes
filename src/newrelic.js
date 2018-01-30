const environment = require('./environment')

if (environment.is_production) {
  require('newrelic')
}

module.exports = true
