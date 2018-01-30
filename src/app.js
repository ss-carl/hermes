const body_parser = require('body-parser')
const cors = require('cors')
const express = require('express')
const express_winston = require('express-winston')
const raven = require('raven')
const environment = require('./environment')
const winston_config = require('./winston-config')

const app = express()

// attach the shipstation carrierapi headers
// to the request object for future use
require('./shipstation-headers')(app)

// configure sentry and include the shipstation headers
// in the sentry context
require('./sentry-setup')(app)

// log all outgoing requests and their responses
require('./request-debug')

app.use(cors())

app.get('/ping', require('./routes/ping'))
app.use(express_winston.logger(winston_config))
app.use(body_parser.json())
app.post('/CreateLabel', require('./routes/create-label'))
app.post('/Register', require('./routes/register'))
app.post('/GetRates', require('./routes/get-rates'))
app.use('/debug', require('./routes/debug'))

// handle any expected errors before allowing
// them to propagate to sentry
app.use(require('./expected-errors'))

if (environment.is_production) {
  app.use(raven.errorHandler())
}

app.use(express_winston.errorLogger(winston_config))

// suppress default express handler dumping a stack trace
// winston has already logged it
app.use((err, req, res, next) => {
  if (res.headersSent) {
    next(err)
  } else {
    res.status(500).send({
      transaction_id: req.transaction_id,
      sentry: res.sentry,
      error: err,
    })
  }
})

module.exports = app
