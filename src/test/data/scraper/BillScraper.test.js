/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const BillScraper = require('../../../data/scraper/BillScraper').BillScraper
const InvalidParameterError = require('../../../data/error/InvalidParameterError').InvalidParameterError
const Parameters = require('../../../data/ParameterEnums')
const flatten = require('flat')

describe('BillScraper.js', () => {
  let parliaments
  let sessions
  let originatingChambers
  let billTypes
  let sponsorAffiliations
  let sponsors
  let statuses
  beforeAll(() => {
    parliaments = Parameters.Parliament.Number
    sessions = Parameters.Parliament.Session
    originatingChambers = Object.values(flatten(Parameters.BillParameters.Chambers))
    sponsorAffiliations = Object.values(flatten(Parameters.BillParameters.Affiliation))
    billTypes = Object.values(flatten(Parameters.BillParameters.Type))
    statuses = Object.values(flatten(Parameters.BillParameters.Status))
    sponsors = ['some sponsor', 'cannot really check these names']
  })

  test('BillScraper.js::create adds correct actions', async (done) => {
    const undertest = BillScraper.create({
      url: 'test-url.com',
      parliament: 'all'
    })
    const registry = undertest.registry
    Assert.equal(Object.values(registry).length, 4)
    Assert.equal(registry.start, 'BillStartAction')
    Assert.equal(registry.stop, 'GenericStopAction')
    Assert.equal(registry.error, 'ParseErrorAction')
    Assert.equal(registry.log, 'TypedLogAction')

    done()
  }, 60000)

  test('BillScraper.js uses raw parliament values without session throws', async (done) => {
    try {
      BillScraper.create({
        url: 'test-url.com',
        parliaments: [43, 44]
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

  test('BillScraper.js uses raw parliaments and sessions without throwing', async (done) => {
    const undertest = BillScraper.create({
      url: 'test-url.com',
      parliaments: parliaments,
      sessions: sessions
    })
    Assert.equal(undertest.params.length, parliaments.length * sessions.length)
    done()
  }, 60000)

  test('BillScraper.js uses raw parliaments, sessions, chambers without throwing', async (done) => {
    const undertest = BillScraper.create({
      url: 'test-url.com',
      parliaments: parliaments,
      sessions: sessions,
      originatingChambers: originatingChambers
    })
    Assert.equal(undertest.params.length, parliaments.length * sessions.length * originatingChambers.length)
    done()
  }, 60000)

  test('BillScraper.js uses raw parliaments, sessions, originating chambers, affiliations without throwing', async (done) => {
    const undertest = BillScraper.create({
      url: 'test-url.com',
      parliaments: parliaments,
      sessions: sessions,
      originatingChambers: originatingChambers,
      sponsorAffiliations: sponsorAffiliations
    })
    Assert.equal(undertest.params.length,
      parliaments.length * sessions.length * sponsorAffiliations.length * originatingChambers.length)
    done()
  }, 60000)

  test('BillScraper.js uses raw parliaments, sessions, chambers, affiliations, sponsors without throwing', async (done) => {
    const undertest = BillScraper.create({
      url: 'test-url.com',
      parliaments: parliaments,
      sessions: sessions,
      originatingChambers: originatingChambers,
      sponsorAffiliations: sponsorAffiliations,
      sponsors: sponsors
    })
    Assert.equal(undertest.params.length,
      parliaments.length * sessions.length * sponsorAffiliations.length * originatingChambers.length * sponsors.length)
    done()
  }, 60000)

  test('BillScraper.js uses raw parliaments, sessions, originating chambers, affiliations, sponsors without throwing', async (done) => {
    const undertest = BillScraper.create({
      url: 'test-url.com',
      parliaments: parliaments,
      sessions: sessions,
      originatingChambers: originatingChambers,
      sponsorAffiliations: sponsorAffiliations,
      sponsors: sponsors
    })
    Assert.equal(undertest.params.length,
      parliaments.length * sessions.length * sponsorAffiliations.length * originatingChambers.length * sponsors.length)
    done()
  }, 60000)

  test('BillScraper.js uses raw parliaments, sessions, originating chambers, affiliations, sponsors without throwing', async (done) => {
    const undertest = BillScraper.create({
      url: 'test-url.com',
      parliaments: parliaments,
      sessions: sessions,
      originatingChambers: originatingChambers,
      sponsorAffiliations: sponsorAffiliations,
      sponsors: sponsors,
      statuses: statuses
    })
    Assert.equal(undertest.params.length,
      parliaments.length * sessions.length * sponsorAffiliations.length * originatingChambers.length * sponsors.length * statuses.length)
    done()
  }, 60000)

  test('BillScraper.js uses raw parliaments, sessions, originating chambers, affiliations, sponsors without throwing', async (done) => {
    const undertest = BillScraper.create({
      url: 'test-url.com',
      parliaments: parliaments,
      sessions: sessions,
      originatingChambers: originatingChambers,
      sponsorAffiliations: sponsorAffiliations,
      sponsors: sponsors,
      statuses: statuses,
      billTypes: billTypes
    })
    Assert.equal(undertest.params.length,
      parliaments.length * sessions.length * sponsorAffiliations.length *
      originatingChambers.length * sponsors.length * statuses.length * billTypes.length)
    done()
  }, 60000)
})
