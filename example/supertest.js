const request = require('supertest')
const app = require('../src/app')

describe('supertest', function() {
  describe('can be used to unit test an express app', function() {
    it('hides a bunch of details', function(done) {
      request(app)
        .get('/ping')
        .expect(200, 'pong', done)
    })
  })
})
