import { ScrapeRunner } from '../src/ScrapeRunner'

const chai = require('chai')
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)

// eslint-disable-next-line no-undef
describe('All ScraperRunner tests', () => {
  // eslint-disable-next-line no-undef
  test('ScrapeRunner Retrieves XML - This test calls the whole pipe, takes a long time', () => {
    const runner = new ScrapeRunner()
    runner.getXmlContent().should.eventually.be.a('array')
  })
})
