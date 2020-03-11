/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const ClassificationRunner = require('../../../data/runner/ClassificationRunner').ClassificationRunner
const InvalidParameterError = require('../../../data/error/InvalidParameterError').InvalidParameterError
const Parameters = require('../../../data/ParameterEnums')

describe('ClassificationRunner.js', () => {
  let parliaments
  beforeAll(() => {
    parliaments = Parameters.Parliament.Number
  })

  test('ClassificationRunner.js::create adds correct actions', async (done) => {
    const undertest = ClassificationRunner.create({
      parliaments: 'all'
    })
    const registry = undertest.registry
    Assert.equal(Object.values(registry).length, 4)
    Assert.equal(registry.start, 'ClassifyStart')
    Assert.equal(registry.stop, 'GenericStopAction')
    Assert.equal(registry.error, 'ThrowAction')
    Assert.equal(registry.log, 'TypedLogAction')
    done()
  }, 60000)

  test('ClassificationRunner.js throws on invalid parliament', async (done) => {
    try {
      ClassificationRunner.create(4)
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

  test('ClassificationRunner.js funnels parameters to first action', async (done) => {
    const undertest = ClassificationRunner.create({
      parliaments: parliaments
    })
    Assert.equal(undertest.params.length, 1)
    done()
  }, 60000)

  test('ClassificationRunner.js throws on invalid parliaments specified', async (done) => {
    try {
      const undertest = ClassificationRunner.create({
        parliaments: null
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
