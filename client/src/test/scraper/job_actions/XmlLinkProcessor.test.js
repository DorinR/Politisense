import { LinkScraper } from '../../../scraper/job_actions/LinkScraperAction'
import { TextParser } from '../../../scraper/job_actions/TextParserAction'
import { XmlLinkSelector } from '../../../scraper/job_actions/XmlLinkSelectionAction'
const chai = require('chai')
const assert = chai.assert
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)

// eslint-disable-next-line no-undef
describe('All Processor Tests', () => {
  // eslint-disable-next-line no-undef
  test('Parser can find patterns', () => {
    const req = new LinkScraper('https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States')
    const parser = new TextParser()
    const selector = new XmlLinkSelector()
    return req.perform()
      .then((html) => {
        html = html.body
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
        return selector.perform(links)
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
    const selector = new XmlLinkSelector()
    req.perform()
      .then((html) => {
        html = html.body
        assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
        return parser.perform(html, '', (elem) => {
          return elem
        })
      })
      .then((links) => {
        assert.isTrue(typeof links === typeof [], 'returned links are an array')
        assert.isTrue(links.length <= 0, 'links are not present')
        const xmls = selector.perform(links)
        assert.isTrue(xmls.length === 0, 'should not find any links')
        return xmls
      })
      .catch((e) => {
        throw e
      })
      .should.eventually.be.a('array')
  })
})
