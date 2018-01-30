class HermesError extends Error {
  constructor(errors, message) {
    super(message || 'The Hermes API processed the request but returned an error')
    this.errors = errors
  }
}

module.exports = HermesError
