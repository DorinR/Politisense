/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const CategoryRunner = require('../../../data/runner/CategoryRunner').CategoryRunner
const InvalidParameterError = require('../../../data/error/InvalidParameterError').InvalidParameterError
const Parameters = require('../../../data/ParameterEnums')

describe('CategoryRunner.js', () => {
  let parliaments
  beforeAll(() => {
    parliaments = Parameters.Parliament.Number
  })

  test('CategoryRunner.js::create adds correct actions', async (done) => {
    const undertest = CategoryRunner.create({
      url: 'test-url.com',
      parliaments: 'all'
    })
    const registry = undertest.registry
    Assert.equal(Object.values(registry).length, 4)
    Assert.equal(registry.start, 'CategoryStart')
    Assert.equal(registry.stop, 'GenericStopAction')
    Assert.equal(registry.error, 'ThrowAction')
    Assert.equal(registry.log, 'TypedLogAction')
    done()
  }, 60000)

  test('CategoryRunner.js throws on invalid parliament', async (done) => {
    try {
      CategoryRunner.create({
        url: 'test-url.com',
        parliaments: 4,
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

  test('CategoryRunner.js can use parliament array', async (done) => {
    const undertest = CategoryRunner.create({
      url: 'test-url.com',
      parliaments: parliaments
    })
    Assert.equal(undertest.params.length, parliaments.length)
    done()
  }, 60000)
})