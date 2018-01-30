const ValidationError = require('../errors/validation-error')

const validate_delivery_routing_request = req => {
  return new Promise((resolve, reject) => {
    const error = message => reject(new ValidationError(message))
    const body = req.body

    if (!body.ship_to.last_name) {
      return error('Last name is missing from the Ship To address')
    }

    if (!body.ship_to.address_lines || !body.ship_to.address_lines[0]) {
      return error('Address Line 1 is missing from the Ship To address')
    }

    if (body.packages && body.packages.length > 1) {
      return error('Muliple packages are not supported')
    }

    const is_outside_eu = !body.ship_to.is_eu
    const advanced_options = body.advanced_options || {}
    const has_no_duty_paid_flag = !(advanced_options.bill_duties_to_sender === true || advanced_options.bill_duties_to_sender === false)

    if (is_outside_eu && has_no_duty_paid_flag) {
      return error('For shipments outside of the EU, you must specify Duty Paid or Duty Unpaid')
    }

    if (is_outside_eu) {
      if (!body.customs) {
        return error('For shipments outside of the EU, customs are required')
      }

      for (let i = 0; i < body.customs.customs_items.length; i++) {
        const hsCode = body.customs.customs_items[i].harmonized_tariff_code || ''
        if (isNaN(hsCode) || hsCode.length !== 6) {
          return error('For shipments outside of the EU, each customs item must have a 6 digit harmonization code')
        }
      }

      const package = body.packages[0]
      const does_have_insured_value = package.insured_value.currency && package.insured_value.amount

      if (!does_have_insured_value) {
        return error('For shipments outside of the EU, insurance is required')
      }

      const invalid_currency_code = ['GBP', 'EUR', 'USD',].indexOf(package.insured_value.currency) < 0

      if (invalid_currency_code) {
        return error('For shipments outside of the EU, insurance currency must be in GBP, EUR, or USD')
      }
    }

    return resolve(req)
  })
}

module.exports = validate_delivery_routing_request
