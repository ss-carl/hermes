const xml2js = require('xml2js')

const parse = body => {
  return new Promise((resolve, reject) => {
    new xml2js.Parser().parseString(body, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

module.exports = {
  parse,
}
