require('./src/newrelic')
const winston = require('winston')
const app = require('./src/app')
const environment = require('./src/environment')

const port = environment.port
app.listen(port, () => winston.info('Server started.', { port: port, }))
