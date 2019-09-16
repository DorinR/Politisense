import { Scraper } from './Scraper'
import { Parser } from './Parser'
const assert = require('chai').assert

// eslint-disable-next-line no-undef
describe('All Parser Tests', () => {
  // eslint-disable-next-line no-undef
  test('Parser can find patterns', () => {
    const req = new Scraper('https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States')
    const parser = new Parser()
    req.scrape()
      .then((html) => {
        assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
        return parser.parse(html, 'a', (elem) => {
          return elem.attr.href
        })
      })
      .then((links) => {
        assert.isTrue(typeof links === typeof [], 'returned links are an array')
        assert.isTrue(links.length > 0, 'links are indeed present')
      })
      .catch((e) => {
        assert.fail('valid html should be delivered by the scraper')
      })
  })
  // eslint-disable-next-line no-undef
  test('Parser cannot find fake patterns', () => {
    const req = new Scraper('https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States')
    const parser = new Parser()
    req.scrape()
      .then((html) => {
        assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
        return parser.parse(html, '', (elem) => {
          return elem
        })
      })
      .then((links) => {
        assert.isTrue(typeof links === typeof [], 'returned links are an array')
        assert.isTrue(links.length < 0, 'links are not present')
      })
      .catch((e) => {
        assert.fail('valid html should be delivered by the scraper')
      })
  })
})
