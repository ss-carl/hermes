const environment = require('../environment')

module.exports = (req, res) => {
  res.send(environment.git_sha || 'pong')
}
