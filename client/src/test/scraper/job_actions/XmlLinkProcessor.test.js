/* eslint-env jest */
import { LinkScraper } from '../../../scraper/job_actions/LinkScraperAction'
import { TextParser } from '../../../scraper/job_actions/TextParserAction'
import { XmlLinkSelector } from '../../../scraper/job_actions/XmlLinkSelectionAction'
const chai = require('chai')
const assert = chai.assert
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)

describe('All Processor Tests', () => {

  let mockFn
  beforeAll(() => {
    mockFn = async (options) => {
      if (options.uri === 'https://www.google.ca/') {
        return {
          body: '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '</head>' +
            '<body>' +
            '<a href="https://www.google.ca/xml">google</a>' +
            '</body>' +
            '</html>'
        }
      } else {
        throw new Error()
      }
    }
  })

  let req
  beforeEach(() => {
    req = new LinkScraper('https://www.google.ca/')
    req.send = mockFn
  })

  // eslint-disable-next-line no-undef
  test('XML Parser can find patterns', () => {
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
        return selector.perform(links)
      })
      .catch((e) => {
        throw e
      })
      .should.eventually.be.a('array')
  })
  // eslint-disable-next-line no-undef
  test('XML Parser cannot find fake patterns', () => {
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
