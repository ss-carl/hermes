const call_hermes = require('../utils/call-hermes')
const validate_delivery_routing_request = require('../utils/validation-helper')
const { get_messages, handle_hermes_errors, } = require('../utils/response-helper')
const { parse, } = require('../utils/xml')
const stream = require('stream')
const scissors = require('scissors')

const action = 'routeDeliveryCreatePreadviceAndLabel'

const create_label = (req, res, next) => {
  validate_delivery_routing_request(req)
    .then(call_hermes(action))
    .then(parse)
    .then(handle_hermes_errors)
    .then(rotate_label)
    .then(result => {
      res.send({
        transaction_id: req.transaction_id,
        label_download: {
          label_data: result.rotated_label,
        },
        tracking_number: result.routingResponse.routingResponseEntries[0].routingResponseEntry[0].outboundCarriers[0].carrier1[0].barcode1[0].barcodeNumber[0],
        messages: get_messages(result.routingResponse.routingResponseEntries[0]),
      })
    })
    .catch(next)
}

const rotate_label = result => {
  return new Promise((resolve, reject) => {
    const base64bytes = result.routingResponse.routingResponseEntries[0].routingResponseEntry[0].outboundCarriers[0].labelImage[0]
    const byteStream = stream.PassThrough()
    const chunks = []
    byteStream.end(Buffer.from(base64bytes, 'base64'))
    scissors(byteStream)
      .rotate(180)
      .pdfStream()
      .on('error', err => reject(err))
      .on('data', chunk => chunks.push(chunk))
      .on('end', () => {
        result.rotated_label = Buffer.concat(chunks).toString('base64')
        resolve(result)
      })
  })
}

module.exports = create_label
