/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const RoleScraper = require('../../../data/scraper/RoleScraper').RoleScraper
const Parameters = require('../../../data/ParameterEnums')

describe('RoleScraper.js', () => {
  test('RoleScraper.js::create adds correct actions', async (done) => {
    const undertest = RoleScraper.create({
      url: 'test-url.com',
      parliamentSessions: 'all'
    })
    const registry = undertest.registry
    Assert.equal(Object.values(registry).length, 5)
    Assert.equal(registry.start, 'RoleStartAction')
    Assert.equal(registry.before, 'RoleBeforeAction')
    Assert.equal(registry.stop, 'GenericStopAction')
    Assert.equal(registry.error, 'ParseErrorAction')
    Assert.equal(registry.log, 'TypedLogAction')

    done()
  }, 60000)

  test('RoleScraper.js uses parliaments without throwing', async (done) => {
    const undertest = RoleScraper.create({
      url: 'test-url.com',
      parliaments: Parameters.Parliament.Number
    })
    Assert.equal(undertest.params.length, Parameters.Parliament.Number.length)
    done()
  }, 60000)
})
