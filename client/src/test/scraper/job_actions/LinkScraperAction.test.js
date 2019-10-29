import { LinkScraper } from '../../../scraper/job_actions/LinkScraperAction'
const chai = require('chai')
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)

// eslint-disable-next-line no-undef
describe('All Scraper Request Tests', () => {
  // eslint-disable-next-line no-undef
  test('Valid URL returns html', () => {
    const req = new LinkScraper('https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States')
    return req.perform()
      .then((html) => {
        return html
      })
      .catch((e) => {
        throw e
      })
      .should.eventually.be.a('string')
  })
  // eslint-disable-next-line no-undef
  test('Invalid URL invokes fail function', () => {
    const req = new LinkScraper('')
    req.perform()
      .then((html) => {
        return html
      })
      .catch((e) => {
        throw e
      })
      .should.eventually.throw().notify(chai.done)
  })
})
