import { Scraper } from '../src/WebPageScraper'
const assert = require('chai').assert

// eslint-disable-next-line no-undef
describe('All Scraper Request Tests', () => {
  // eslint-disable-next-line no-undef
  test('Valid URL returns html', () => {
    const req = new Scraper('https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States')
    req.scrape()
      .then((html) => {
        assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
      })
      .catch((e) => {
        assert.fail('valid html should be delivered by the scraper')
      })
  })
  // eslint-disable-next-line no-undef
  test('Invalid URL invokes fail function', () => {
    const req = new Scraper('')
    req.scrape()
      .then((html) => {
        assert.fail('valid html is delivered by the scraper where none should exist')
      })
      .catch((e) => {
        assert.isTrue(true, 'there is no valid html coming from this link')
      })
  })
})
