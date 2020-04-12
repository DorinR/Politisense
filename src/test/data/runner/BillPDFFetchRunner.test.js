/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const BillPDFFetchRunner = require('../../../data/runner/BillPDFFetchRunner').BillPDFFetchRunner
const InvalidParameterError = require('../../../data/error/InvalidParameterError').InvalidParameterError
const Parameters = require('../../../data/ParameterEnums')

describe('BillPDFFetchRunner.js', () => {
  // eslint-disable-next-line no-unused-vars
  let parliaments
  beforeAll(() => {
    parliaments = Parameters.Parliament.Number
  })

  test('BillPDFFetchRunner.js::create adds correct actions', async (done) => {
<<<<<<< Updated upstream
    const undertest = BillPDFFetchRunner.create([{
      url: 'test-url.com',
      parliament: 43,
      id: ' '
    }])
=======
    const undertest = BillPDFFetchRunner.create({
      url: 'test-url.com',
      parliament: 43,
      id: ' '
    })
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      BillPDFFetchRunner.create([{
        url: 'test-url.com',
        parliaments: ' ',
        id: ' '
      }])
=======
      BillPDFFetchRunner.create({
        url: 'test-url.com',
        parliaments: ' ',
        id: ' '
      })
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      BillPDFFetchRunner.create([{
        url: 'test-url.com',
        parliaments: 43
      }])
=======
      BillPDFFetchRunner.create({
        url: 'test-url.com',
        parliaments: 43
      })
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      BillPDFFetchRunner.create([{
        parliaments: 43,
        bill: ''
      }])
=======
      BillPDFFetchRunner.create({
        parliaments: 43,
        bill: ''
      })
>>>>>>> Stashed changes
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
