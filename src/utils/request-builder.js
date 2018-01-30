const xml2js = require('xml2js')
const environment = require('../environment')


const get_delivery_routing_request_body = body => {
  const request_body = {
    deliveryRoutingRequest: {
      clientId: environment.hermes_client_id,
      clientName: environment.hermes_client_name,
      sourceOfRequest: 'CLIENTWS',
      //this looks weird bc it is a workaround for: https://github.com/Leonidas-from-XIV/node-xml2js/issues/119
      deliveryRoutingRequestEntries: { deliveryRoutingRequestEntry: [], },
    },
  }

  const is_outside_EU = !body.ship_to.is_eu
  const is_international = body.ship_to.country_code !== body.ship_from.country_code
  const ship_to = body.ship_to
  const ship_from = body.ship_from
  const options = body.advanced_options
  const package = body.packages[0]
  const dimensions = getDimensions(package.dimensions)
  const customs = body.customs

  const entry = {
    addressValidationRequired: !is_international,
    customer: {
      address: {
        firstName: ship_to.first_name || '',
        lastName: ship_to.last_name,
        streetName: get_address_line_at(ship_to.address_lines, 0),
        addressLine1: get_address_line_at(ship_to.address_lines, 0),
        addressLine2: get_address_line_at(ship_to.address_lines, 1),
        addressLine3: get_address_line_at(ship_to.address_lines, 2),
        City: ship_to.city_locality,
        Region: ship_to.state_province,
        postCode: ship_to.postal_code,
        countryCode: ship_to.country_code.toUpperCase(),
      },
      homePhoneNo: ship_to.phone,
      mobilePhoneNo: ship_to.phone,
      email: ship_to.email,
      customerReference1: limit_to(body.reference, 20),
    },
    parcel: {
      weight: parseInt(package.weight),
      length: dimensions.length,
      width: dimensions.width,
      depth: dimensions.height,
      volume: dimensions.volume,
      combinedDimension: dimensions.combined,
      girth: dimensions.girth,
      value: package.insured_value.amount || 100,
    },
    services: get_services(body),
    senderAddress: {
      addressLine1: get_address_line_at(ship_from.address_lines, 0),
      addressLine2: get_address_line_at(ship_from.address_lines, 1),
      addressLine3: ship_from.city_locality,
      addressLine4: ship_from.postal_code,
    },
    expectedDespatchDate: body.ship_date,
    countryOfOrigin: ship_from.country_code.toUpperCase(),
  }

  if (is_international) {
    entry.diversions = get_diversions(options)
    set_international_properties(customs, options, is_outside_EU, entry)
  }
  if (package.insured_value.currency) {
    set_insured_currency(package.insured_value, entry)
  }

  set_customer_options(options, entry)
  set_other_options(options, entry)

  request_body.deliveryRoutingRequest.deliveryRoutingRequestEntries.deliveryRoutingRequestEntry.push(entry)

  return new xml2js.Builder().buildObject(request_body)
}

const getDimensions = dimensions => {
  if (!dimensions) {
    dimensions = {
      length: 0,
      width: 0,
      height: 0,
    }
  }

  ensure_integer_dimensions(dimensions)
  sort_primary_dimensions(dimensions)
  get_calculated_dimensions(dimensions)

  return dimensions
}

const ensure_integer_dimensions = dimensions => {
  dimensions.length = parseInt(dimensions.length)
  dimensions.width = parseInt(dimensions.width)
  dimensions.height = parseInt(dimensions.height)
}

const get_calculated_dimensions = dimensions => {
  dimensions.girth = 2 * (dimensions.width + dimensions.height)
  dimensions.volume = dimensions.length * dimensions.width * dimensions.height
  dimensions.combined = dimensions.length + dimensions.width + dimensions.height
}

const sort_primary_dimensions = dimensions => {
  const sorted_dimensions = [dimensions.length, dimensions.width, dimensions.height,].sort((a, b) => b - a)
  dimensions.length = sorted_dimensions[0]
  dimensions.width = sorted_dimensions[1]
  dimensions.height = sorted_dimensions[2]
}

const get_address_line_at = (address_lines, index) => {
  if (index >= address_lines.length) {
    return ''
  }
  return address_lines[index]
}

const limit_to = (source, limit) => {
  if ((source || '').length < limit) {
    return source
  }
  return source.substring(0, limit)
}

const get_services = input => {
  const services = {
    signature: (input.confirmation || '').toLowerCase().indexOf('signature') >= 0 ? true : false,
  }
  const options = input.advanced_options
  if (options.statedDay) {
    services.statedDay = {
      statedDayIndicator: options.statedDay,
    }
  }
  if (options.statedTime) {
    services.statedTime = options.statedTime
  }
  if (options.nextDay) {
    services.nextDay = options.nextDay
  }
  if (options.houseHoldSignature) {
    services.houseHoldSignature = options.houseHoldSignature
  }
  if (options.COD) {
    services.cashOnDelivery = {
      cashValue: options.COD.value,
      cashCurrency: options.COD.currency,
    }
  }
  return services
}

const get_diversions = options => {
  const diversions = {}
  if (options.exclude_cancel_delivery) {
    diversions.excludeCancelDelivery = options.exclude_cancel_delivery
  }
  if (options.exclude_later_date) {
    diversions.excludeLaterDate = options.exclude_later_date
  }
  if (options.exclude_neighbours) {
    diversions.excludeNeighbours = options.exclude_neighbours
  }
  if (options.exclude_safe_place) {
    diversions.excludeSafePlace = options.exclude_safe_place
  }
  return diversions
}

const set_international_properties = (customs, options, isOutsideEU, entry) => {
  entry.parcel.numberOfItems = customs.quantity
  entry.parcel.description = customs.description
  if (isOutsideEU) {
    entry.parcel.dutyPaid = options.bill_duties_to_sender ? 'P' : 'U'
  }
  entry.parcel.contents = { content: [], }
  let value = 0
  for (let i = 0; i < customs.customs_items.length; i++) {
    const customsItem = customs.customs_items[i]
    const amount = customsItem.value.amount
    value =+ amount
    const content = {
      skuCode: customsItem.sku,
      skuDescription: customsItem.sku_description,
      value: amount,
    }
    if (customsItem.harmonized_tariff_code) {
      content.hsCode = customsItem.harmonized_tariff_code
    }
    entry.parcel.contents.content.push(content)
  }
  entry.parcel.value = value === 0 ? 100 : value
}

const set_insured_currency = (insuredValue, entry) => {
  entry.parcel.currency = 'GBP'
}

const set_customer_options = (options, entry) => {
  if (options.customerAlert) {
    entry.customerAlertType = options.customerAlertType
    entry.customerAlertGroup = options.customerAlertGroup
  }
  if (options.deliveryMessage) {
    entry.deliveryMessage = options.deliveryMessage
  }
  if (options.specialInstruction1) {
    entry.specialInstruction1 = options.specialInstruction1
  }
  if (options.specialInstruction2) {
    entry.specialInstruction2 = options.specialInstruction2
  }
}

const set_other_options = (options, entry) => {
  if (options.hanging_garment) {
    entry.parcel.hangingGarment = options.hanging_garment
  }
  if (options.catalogue) {
    entry.parcel.catalogue = options.catalogue
  }
}

module.exports = get_delivery_routing_request_body
