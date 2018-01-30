const HermesError = require('./errors/hermes-error')
const ValidationError = require('./errors/validation-error')

module.exports = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(400).send({
      transaction_id: req.transaction_id,
      errors: [err.message,],
    })
  } else if (err instanceof HermesError) {
    res.status(400).send({
      transaction_id: req.transaction_id,
      errors: err.errors,
    })
  } else if (err.statusCode === 401) {
    res.status(401).send({
      transaction_id: req.transaction_id,
    })
  } else {
    next(err)
  }
}
