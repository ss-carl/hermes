const fs = require('fs')
const f = fs.readFileSync('./fake.pdf')
const file = './fake-label.js'
fs.writeFileSync(file, 'module.exports = \'')
fs.appendFileSync('./fake.js', f.toString('base64'))
fs.appendFileSync(file, '\'')
