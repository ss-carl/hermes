const request = require('request-promise-native')
const url = require('url')
const get_delivery_routing_request_body = require('../utils/request-builder')
const environment = require('../environment')

const call_hermes = action => {
  return req => {
    return request.post({
      url: url.resolve(environment.hermes_base_url, action),
      body: get_delivery_routing_request_body(req.body),
      auth: {
        user: req.body.credentials.username,
        pass: req.body.credentials.password,
      },
    })
  }
}

module.exports = call_hermes
