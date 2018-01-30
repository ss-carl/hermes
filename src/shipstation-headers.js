module.exports = app => {
  app.use((req, res, next) => {
    req.seller_id = req.get('shipstation-sellerid')
    req.seller_provider_id = req.get('shipstation-sellerproviderid')
    req.seller_email = req.get('shipstation-email')
    req.transaction_id = req.get('shipstation-transactionid')
    next()
  })
}
