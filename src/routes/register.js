const request = require('request-promise-native')
const url = require('url')
const xml2js = require('xml2js')
const environment = require('../environment')

const send_registration_successful_response = (response, username, password) => {
  response.status(200).send({
    credentials: {
      username: username,
      password: password,
    },
  })
}

const send_registration_unsuccessful_response = (response, error) => {
  const is_unauthorized = error.statusCode === 401
  if (is_unauthorized) {
    response.status(401).send({
      can_connect: false,
      message: 'Connection unsuccessful: Unable to authenticate with the provided credentials.',
    })
  } else {
    throw error
  }
}

const send_dummy_address_validation_request = (username, password) => {
  const builder = new xml2js.Builder({
    rootName: 'collectionRoutingRequest',
  })

  const requestBody = {
    clientId: environment.hermes_client_id,
    clientName: environment.hermes_client_name,
    sourceOfRequest: 'CLIENTWS',
    collectionRoutingRequestEntries: [
      {
        collectionRoutingRequestEntry: {
          addressValidationRequired: false,
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
          countryOfOrigin: 'GB',
          parcel: {
            weight: 1000,
            length: 10,
            width: 10,
            depth: 10,
            girth: 10,
            combinedDimension: 10,
            volume: 1000,
            value: 100,
            numberOfParts: 1,
            numberOfItems: 1,
            description: 'Parcel Description',
            originOfParcel: 'TimBukTu',
          },
        },
      },
    ],
  }

  return request
    .post({
      url: url.resolve(environment.hermes_base_url, 'validateCollectionAddress'),
      body: builder.buildObject(requestBody),
      auth: {
        user: username,
        pass: password,
      },
    })
}

const verify_credentials = (username, password, response, next) => {
  send_dummy_address_validation_request(username, password)
    .then(() => send_registration_successful_response(response, username, password))
    .catch((error) => send_registration_unsuccessful_response(response, error))
    .catch(next)
}

const register = (request, response, next) => {
  const credentials = request.body.credentials
  const username = credentials.username
  const password = credentials.password
  verify_credentials(username, password, response, next)
}

module.exports = register
