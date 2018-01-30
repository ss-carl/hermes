const assert = require('better-assert')
const url = require('url')

describe('when building a hermes url', function() {
  it('should correctly combine the path with a base url', function() {
    const finalUrl = url.resolve('http://intcon-proxy.sslocal.com/hermes/prod/', 'routeDeliveryCreatePreadviceAndLabel')
    assert(finalUrl === 'http://intcon-proxy.sslocal.com/hermes/prod/routeDeliveryCreatePreadviceAndLabel')
  })
})
