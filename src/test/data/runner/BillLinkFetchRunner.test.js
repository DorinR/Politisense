/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const BillLinkFetchRunner = require('../../../data/runner/BillLinkFetchRunner').BillLinkFetchRunner
const InvalidParameterError = require('../../../data/error/InvalidParameterError').InvalidParameterError
const Parameters = require('../../../data/ParameterEnums')

describe('BillLinkFetchRunner.js', () => {
  let parliaments
  beforeAll(() => {
    parliaments = Parameters.Parliament.Number
  })

  test('BillLinkFetchRunner.js::create adds correct actions', async (done) => {
    const undertest = BillLinkFetchRunner.create({
      url: 'test-url.com',
      parliament: 'all'
    })
    const registry = undertest.registry
    Assert.equal(Object.values(registry).length, 5)
    Assert.equal(registry.before, 'BillLinkFetchBeforeAction')
    Assert.equal(registry.start, 'BillLinkStart')
    Assert.equal(registry.stop, 'GenericStopAction')
    Assert.equal(registry.error, 'ScrapeErrorAction')
    Assert.equal(registry.log, 'TypedLogAction')

    done()
  }, 60000)

  test('BillLinkFetchRunner.js uses raw parliaments without throwing', async (done) => {
    const undertest = BillLinkFetchRunner.create({
      url: 'test-url.com',
      parliaments: parliaments,
    })
    Assert.equal(undertest.params.length, parliaments.length)
    undertest.params.forEach(param => {
      Assert(param instanceof Object)
      Assert.isOk(param.parliament)
    })
    done()
  }, 60000)

  test('BillLinkFetchRunner.js throws when invalid parliament provided', async (done) => {
    try {
      BillLinkFetchRunner.create({
        url: 'test-url.com',
        parliaments: {}
      })
    } catch (e) {
      if(e instanceof chai.AssertionError) {
        throw e
      }
      if(!(e instanceof InvalidParameterError)) {
        Assert.fail()
      }
      done()
    }
    Assert.fail()
  }, 60000)

})
