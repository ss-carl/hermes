const stub_get_rates = body => {
  body.reference = 'Stubreference'
  const ship_to = body.ship_to
  ship_to.last_name = 'Stublastname'
  ship_to.address_lines = ['Stub first address line',]
  return body
}

module.exports = stub_get_rates
