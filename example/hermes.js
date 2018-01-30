const request = require('request-promise-native')
// const util = require('util')
const xml2js = require('xml2js')
const environment = require('../src/environment')

const requestBody = {
  clientId: environment.hermes_client_id,
  clientName: environment.hermes_client_name,
  sourceOfRequest: 'CLIENTWS',
  deliveryRoutingRequestEntries: [
    {
      deliveryRoutingRequestEntry: {
        customer: {
          address: {
            lastName: 'lastname',
            streetName: 'Bloomsbury',
            City: 'London',
            postCode: 'WC1B 3DG',
            countryCode: 'GB',
          },
          customerReference1: '123123123',
        },
        parcel: {
          weight: 10,
          length: 10,
          width: 10,
          depth: 10,
          girth: 0,
          combinedDimension: 0,
          volume: 0,
          currency: 'USD',
          value: 300,
        },
        expectedDespatchDate: '2017-12-23T00:00:00',
        countryOfOrigin: 'GB',
      },
    },
  ],
}

// these actually talk to the hermes api
describe('testing against the live hermes api', function() {
  it('validateDeliveryAddress should work', function(done) {
    const builder = new xml2js.Builder({
      rootName: 'deliveryRoutingRequest',
    })
    request.post({
      url: 'http://intcon-proxy.sslocal.com/hermes/prod/validateDeliveryAddress',
      body: builder.buildObject(requestBody),
      auth: {
        user: environment.hermes_username,
        pass: environment.hermes_password,
      },
    }).then(() => {
    // }).then((body) => {
      // console.info(util.inspect(body))
      done()
    }).catch((err) => {
      // console.info(util.inspect(err))
      done(err)
    })
  })

  it('determineDeliveryRouting should work', function(done) {
    const builder = new xml2js.Builder({
      rootName: 'deliveryRoutingRequest',
    })
    request.post({
      url: 'http://intcon-proxy.sslocal.com/hermes/prod/determineDeliveryRouting',
      body: builder.buildObject(requestBody),
      auth: {
        user: environment.hermes_username,
        pass: environment.hermes_password,
      },
    }).then(() => {
    // }).then((body) => {
      // console.info(util.inspect(body))
      done()
    }).catch((err) => {
      // console.info(util.inspect(err))
      done(err)
    })
  })

  it('routeDeliveryCreatePreadviceAndLabel should work', function(done) {
    const builder = new xml2js.Builder({
      rootName: 'deliveryRoutingRequest',
    })
    request.post({
      url: 'http://intcon-proxy.sslocal.com/hermes/prod/routeDeliveryCreatePreadviceAndLabel',
      body: builder.buildObject(requestBody),
      auth: {
        user: environment.hermes_username,
        pass: environment.hermes_password,
      },
    }).then((body) => {
      const parser = new xml2js.Parser()
      parser.parseString(body, (err, result) => {
        err
        result
        // console.info(util.inspect(result, { depth: null, }))
        done()
      })
    }).catch((err) => {
      // console.info(util.inspect(err))
      done(err)
    })
  })
})
