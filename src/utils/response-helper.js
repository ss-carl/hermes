const HermesError = require('../errors/hermes-error')

const get_messages = (entry) => {
  const warningMessages = get_messages_of_type(entry, 'warningMessages')
  const errorMessages = get_messages_of_type(entry, 'errorMessages')
  const messages = warningMessages.concat(errorMessages)
  return messages
}

const get_messages_of_type = (entry, property) =>
  get_error_descriptions(entry.routingResponseEntry[0][property])

const get_error_descriptions = messages => messages ? messages.map(message => message.errorDescription[0]).filter(m => m) : []

const routing_response_has_errors = response => response.routingResponse.routingResponseEntries[0].routingResponseEntry[0].errorMessages || false

const handle_hermes_errors = response => {
  if (routing_response_has_errors(response)) {
    throw new HermesError(get_messages(response.routingResponse.routingResponseEntries[0]))
  } else {
    return response
  }
}

module.exports = {
  get_messages,
  routing_response_has_errors,
  handle_hermes_errors,
}
