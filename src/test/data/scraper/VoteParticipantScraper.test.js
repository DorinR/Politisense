/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const VoteParticipantScraper = require('../../../data/scraper/VoteParticipantScraper').VoteParticipantScraper
const Parameters = require('../../../data/ParameterEnums')

describe('VoteParticipantScraper.js', () => {
  test('VoteParticipantScraper.js', async (done) => {
    const undertest = VoteParticipantScraper.create({
      url: 'test-url.com',
      parliaments: 'all'
    })
    const registry = undertest.registry
    Assert.equal(Object.values(registry).length, 6)
    Assert.equal(registry.start,'VoteParticipantStart')
    Assert.equal(registry.stop,'GenericStopAction')
    Assert.equal(registry.after,'VoteParticipantAfterAction')
    Assert.equal(registry.before,'VoteParticipantBeforeAction')
    Assert.equal(registry.error,'ParseErrorAction')
    Assert.equal(registry.log,'TypedLogAction')
    done()
  })

  test('VoteParticipantScraper.js uses raw parliament numbers without throwing', async (done) => {
    const undertest = VoteParticipantScraper.create({
      url: 'test-url.com',
      parliaments: Parameters.Parliament.Number
    })
    Assert.equal(undertest.params.length, 24)
    Assert.equal(undertest.queryCount, undertest.maxQueryCount)
    Assert.equal(undertest.queryCount, undertest.params.length)
    done()
  }, 60000)

  test('VoteParticipantScraper.js uses raw parliament sessions without throwing', async (done) => {
    const undertest = VoteParticipantScraper.create({
      url: 'test-url.com',
      parliaments: Parameters.Parliament.Number,
      sessions: Parameters.Parliament.Session
    })
    Assert.equal(undertest.params.length, Parameters.Parliament.Number.length * Parameters.Parliament.Session.length)
    Assert.equal(undertest.queryCount, undertest.maxQueryCount)
    Assert.equal(undertest.queryCount, undertest.params.length)
    done()
  }, 60000)
})
