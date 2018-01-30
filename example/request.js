const assert = require('better-assert')
const request = require('request-promise-native')


describe('if you have the server running, request', function() {
  describe('GET /ping', function() {
    it('should get back pong', function(done) {
      request
        .get({ uri: 'http://localhost:9000/ping', })
        .then((r) => {
          assert(r === 'pong')
          done()
        })
    })
  })
})
