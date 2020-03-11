/* eslint-env jest */
const chai = require('chai')
const Assert = chai.assert

const PoliticianScraper = require('../../../data/scraper/PoliticianScraper').PoliticianScraper
const Parameter = require('../../../data/ParameterEnums')
const Parameters = Parameter.PoliticianParameters
const flatten = require('flat')

describe('PoliticianScraper.js', () => {
  let parliaments
  let caucuses
  let provinces
  let genders
  let prefixes
  beforeAll(() => {
    parliaments = Object.values(flatten(Parameter.Parliament.Number))
    caucuses = Object.values(flatten(Parameters.Caucus))
    provinces = Object.values(flatten(Parameters.Province))
    genders = ['M', 'F']
    prefixes = ['A', 'B', 'C', 'D']
  })

  test('PoliticianScraper.js::create adds correct actions', async (done) => {
    const undertest = PoliticianScraper.create({
      url: 'test-url.com',
      parliament: 'all'
    })
    const registry = undertest.registry
    Assert.equal(Object.values(registry).length, 5)
    Assert.equal(registry.start, 'PoliticianStart')
    Assert.equal(registry.stop, 'GenericStopAction')
    Assert.equal(registry.after, 'PoliticianAfterAction')
    Assert.equal(registry.error, 'ParseErrorAction')
    Assert.equal(registry.log, 'TypedLogAction')

    done()
  }, 60000)

  test('PoliticianScraper.js uses raw parliament values for parliament without throwing', async (done) => {
    const undertest = PoliticianScraper.create({
      url: 'test-url.com',
      parliaments: 'all'
    })
    Assert.equal(undertest.params.length, 1)
    done()
  }, 60000)

  test('PoliticianScraper.js uses raw parliaments and caucuses without throwing', async (done) => {
    const undertest = PoliticianScraper.create({
      url: 'test-url.com',
      parliaments: parliaments,
      caucuses: caucuses
    })
    Assert.equal(undertest.params.length, parliaments.length * caucuses.length)
    done()
  }, 60000)

  test('PoliticianScraper.js uses raw parliaments, caucuses, provinces without throwing', async (done) => {
    const undertest = PoliticianScraper.create({
      url: 'test-url.com',
      parliaments: parliaments,
      caucuses: caucuses,
      provinces: provinces
    })
    Assert.equal(undertest.params.length, parliaments.length * caucuses.length * provinces.length)
    done()
  }, 60000)

  test('PoliticianScraper.js uses raw parliaments, sessions, provinces, genders without throwing', async (done) => {
    const undertest = PoliticianScraper.create({
      url: 'test-url.com',
      parliaments: parliaments,
      caucuses: caucuses,
      provinces: provinces,
      genders: genders
    })
    Assert.equal(undertest.params.length, parliaments.length * caucuses.length * provinces.length * genders.length)
    done()
  }, 60000)

  test('PoliticianScraper.js uses raw parliaments, sessions, provinces, genders, prefixes without throwing', async (done) => {
    const undertest = PoliticianScraper.create({
      url: 'test-url.com',
      parliaments: parliaments,
      caucuses: caucuses,
      provinces: provinces,
      genders: genders,
      lastNamePrefixes: prefixes
    })
    Assert.equal(undertest.params.length, parliaments.length * caucuses.length * provinces.length * genders.length * prefixes.length)
    done()
  }, 60000)
})
