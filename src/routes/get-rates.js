const call_hermes = require('../utils/call-hermes')
const validate_delivery_routing_request = require('../utils/validation-helper')
const { handle_hermes_errors, get_messages, } = require('../utils/response-helper')
const { parse, } = require('../utils/xml')
const stub_get_rates = require('../utils/stub-get-rates')

const action = 'determineDeliveryRouting'

const get_rates = (req, res, next) => {
  stub_get_rates(req.body)
  validate_delivery_routing_request(req)
    .then(call_hermes(action))
    .then(parse)
    .then(handle_hermes_errors)
    .then(result => {
      const entry = result.routingResponse.routingResponseEntries[0]

      res.send({
        transaction_id: req.transaction_id,
        rates: [
          {
            shipping_amount: {
              amount: '0.0',
              currency: 'GBP',
            },
            warning_messages: [
              'The request has been validated, but Hermes does not provide rates.',
            ].concat(get_messages(entry)),
          },
        ],
      })
    })
    .catch(next)
}

module.exports = get_rates
