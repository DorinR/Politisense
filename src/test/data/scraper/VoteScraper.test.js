/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert
const VoteScraper = require('../../../data/scraper/VoteScraper').VoteScraper
const Parameters = require('../../../data/ParameterEnums')
const flatten = require('flat')

describe('VoteScraper.js', () => {
  let parls
  let types
  let results
  let topics
  beforeAll(() => {
    parls = Object.values(flatten(Parameters.VoteParameters.Parliament))
    types = Object.values(flatten(Parameters.VoteParameters.Type))
    results = Object.values(flatten(Parameters.VoteParameters.Outcome))
    topics = Object.values(flatten(Parameters.VoteParameters.Topic))
  })

  test('VoteScraper.js::create adds correct actions', async (done) => {
    const undertest = VoteScraper.create({
      url: 'test-url.com',
      parliamentSessions: 'all'
    })
    const registry = undertest.registry
    Assert.equal(Object.values(registry).length, 5)
    Assert.equal(registry.start,'VoteRecordStart')
    Assert.equal(registry.stop,'GenericStopAction')
    Assert.equal(registry.after,'VoteAfterAction')
    Assert.equal(registry.error,'ParseErrorAction')
    Assert.equal(registry.log,'TypedLogAction')

    done()
  }, 60000)

  test('VoteScraper.js uses mapped Parliament Session Keys for parliament without throwing', async (done) => {
    const undertest = VoteScraper.create({
      url: 'test-url.com',
      parliamentSessions: parls
    })
    Assert.equal(undertest.params.length, parls.length)
    done()
  }, 60000)

  test('VoteScraper.js uses mapped vote-type keys without throwing', async (done) => {
    const undertest = VoteScraper.create({
      url: 'test-url.com',
      parliamentSessions: parls,
      types: types
    })
    Assert.equal(undertest.params.length, parls.length * types.length)
    done()
  }, 60000)

  test('VoteScraper.js uses mapped vote result keys without throwing', async (done) => {

    const undertest = VoteScraper.create({
      url: 'test-url.com',
      parliamentSessions: parls,
      types: types,
      voteResults: results
    })
    Assert.equal(undertest.params.length, parls.length * types.length * results.length)
    done()
  }, 60000)

  test('VoteScraper.js uses mapped vote result keys without throwing', async (done) => {
    const undertest = VoteScraper.create({
      url: 'test-url.com',
      parliamentSessions: parls,
      types: types,
      voteResults: results,
      topics: topics
    })
    Assert.equal(undertest.params.length, parls.length * types.length * results.length * topics.length)
    done()
  }, 60000)

})
