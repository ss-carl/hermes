const environment = require('./environment')
const raven = require('raven')

module.exports = app => {
  if (environment.is_production) {
    raven.config().install()
    app.use(raven.requestHandler())
    app.use((req, res, next) => {
      raven.mergeContext({
        user: {
          id: req.seller_provider_id,
          username: req.seller_id,
          email: req.seller_email,
        },
        extra: {
          transaction_id: req.transaction_id,
        },
      })
      next()
    })
  }
}
