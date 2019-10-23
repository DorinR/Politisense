import { LinkScraper } from '../../src/job_actions/LinkScraperAction'
import { TextParser } from '../../src/job_actions/TextParserAction'
const chai = require('chai')
const assert = chai.assert
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)

// eslint-disable-next-line no-undef
describe('All Parser Tests', () => {
  // eslint-disable-next-line no-undef
  test('Parser can find patterns', () => {
    const req = new LinkScraper('https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States')
    const parser = new TextParser()
    return req.perform()
      .then((html) => {
        assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
        const $ = parser.load(html)
        const select = (elem) => {
          return $(elem).attr('href')
        }
        return parser.perform(html, 'a', select)
      })
      .then((links) => {
        assert.isTrue(typeof links === typeof [], 'returned links are an array')
        assert.isTrue(links.length > 0, 'links are indeed present')
        return links
      })
      .catch((e) => {
        throw e
      })
      .should.eventually.be.a('array')
  })
  // eslint-disable-next-line no-undef
  test('Parser cannot find fake patterns', () => {
    const req = new LinkScraper('https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States')
    const parser = new TextParser()
    req.perform()
      .then((html) => {
        assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
        const $ = parser.load(html)
        const select = (elem) => {
          return $(elem).attr('href')
        }
        return parser.perform(html, 'a', select)
      })
      .then((links) => {
        assert.isTrue(typeof links === typeof [], 'returned links are an array')
        assert.isTrue(links.length < 0, 'links are not present')
        return links
      })
      .catch((e) => {
        throw e
      })
      .should.eventually.throw().notify(chai.done)
  })
})
