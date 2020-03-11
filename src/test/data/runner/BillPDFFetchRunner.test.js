/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const BillPDFFetchRunner = require('../../../data/runner/BillPDFFetchRunner').BillPDFFetchRunner
const InvalidParameterError = require('../../../data/error/InvalidParameterError').InvalidParameterError
const Parameters = require('../../../data/ParameterEnums')

describe('BillPDFFetchRunner.js', () => {
  let parliaments
  beforeAll(() => {
    parliaments = Parameters.Parliament.Number
  })

  test('BillPDFFetchRunner.js::create adds correct actions', async (done) => {
    const undertest = BillPDFFetchRunner.create({
      url: 'test-url.com',
      parliament: 43,
      id: ' '
    })
    const registry = undertest.registry
    Assert.equal(Object.values(registry).length, 4)
    Assert.equal(registry.start, 'BillPDFFetchStartAction')
    Assert.equal(registry.stop, 'GenericStopAction')
    Assert.equal(registry.error, 'ScrapeErrorAction')
    Assert.equal(registry.log, 'TypedLogAction')
    done()
  }, 60000)

  test('BillPDFFetchRunner.js throws on invalid parliament', async (done) => {
    try {
      BillPDFFetchRunner.create({
        url: 'test-url.com',
        parliaments: ' ',
        id: ' '
      })
    } catch (e) {
      if (e instanceof chai.AssertionError) {
        throw e
      }
      if (!(e instanceof InvalidParameterError)) {
        Assert.fail()
      }
      done()
    }
    Assert.fail()
  }, 60000)

  test('BillPDFFetchRunner.js throws on no bill', async (done) => {
    try {
      BillPDFFetchRunner.create({
        url: 'test-url.com',
        parliaments: 43
      })
    } catch (e) {
      if (e instanceof chai.AssertionError) {
        throw e
      }
      if (!(e instanceof InvalidParameterError)) {
        Assert.fail()
      }
      done()
    }
    Assert.fail()
  }, 60000)

  test('BillPDFFetchRunner.js throws on no url', async (done) => {
    try {
      BillPDFFetchRunner.create({
        parliaments: 43,
        bill: ''
      })
    } catch (e) {
      if (e instanceof chai.AssertionError) {
        throw e
      }
      if (!(e instanceof InvalidParameterError)) {
        Assert.fail()
      }
      done()
    }
    Assert.fail()
  }, 60000)
})
