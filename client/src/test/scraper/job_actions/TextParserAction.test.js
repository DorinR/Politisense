/* eslint-env jest */
import { LinkScraper } from '../../../scraper/job_actions/LinkScraperAction'
import { TextParser } from '../../../scraper/job_actions/TextParserAction'
const chai = require('chai')
const Assert = chai.assert

describe('All Parser Tests', () => {
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

  test('Parser can find patterns', async (done) => {
    const parser = new TextParser()
    const didFind = await req.perform()
      .then((html) => {
        html = html.body
        Assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
        const $ = parser.load(html)
        const select = (elem) => {
          return $(elem).attr('href')
        }
        return parser.perform(html, 'a', select)
      })
      .then((links) => {
        Assert.isTrue(typeof links === typeof [], 'returned links are an array')
        return true
      })
      .catch((e) => {
        throw e
      })
    Assert.equal(didFind, true)
    done()
  })

  test('Parser cannot find fake patterns', async (done) => {
    const parser = new TextParser()
    const didFind = await req.perform()
      .then((html) => {
        html = html.body
        Assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
        const $ = parser.load(html)
        const select = (elem) => {
          return $(elem).attr('href')
        }
        return parser.perform(html, '', select)
      })
      .then((links) => {
        Assert.equal(typeof links, typeof [])
        Assert.equal(links.length, 0)
        return true
      })
      .catch((e) => {
        return false
      })
    Assert.equal(didFind, true)
    done()
  })
})
