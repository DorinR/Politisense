/* eslint-env jest */
import { LinkScraper } from '../../../scraper/job_actions/LinkScraperAction'
import { ParseError, TextParser } from '../../../scraper/job_actions/TextParserAction'

const chai = require('chai')
const Assert = chai.assert

describe('TextParserAction.js', () => {
  let mockSend
  let mockLoad
  beforeAll(() => {
    mockSend = async (options) => {
      if (options.uri === 'https://www.google.ca/') {
        return {
          body: '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '</head>' +
            '<body>' +
            '<a href="https://www.google.ca/xml">google</a>' +
            '<a href="https://www.google.ca/xml">google1</a>' +
            '</body>' +
            '</html>'
        }
      } else {
        throw new Error()
      }
    }
    mockLoad = (content, options) => {
      Assert.notEqual(content, null)
      Assert.equal(typeof content, typeof '')
      Assert.notEqual(options.normalizeWhitespace, null)
      Assert.equal(options.normalizeWhitespace, true)
      Assert.notEqual(options.xmlMode, null)
      Assert.equal(options.xmlMode, true)
      Assert.notEqual(options.xml, null)
      Assert.equal(options.xml, true)
    }
  })

  let req
  beforeEach(() => {
    req = new LinkScraper('https://www.google.ca/')
    req.send = mockSend
  })

  test('TextParser::perform() finds all links', async (done) => {
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
        Assert.equal(links.length, 2)
        return true
      })
      .catch((e) => {
        throw e
      })
    Assert.equal(didFind, true)
    done()
  })

  test('TextParser::perform() does not select links when not specified', async (done) => {
    const parser = new TextParser()
    const didFind = await req.perform()
      .then((html) => {
        html = html.body
        Assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
        const $ = parser.load(html)
        const select = (elem) => {
          return $(elem).attr('href')
        }
        return parser.perform(html, ' ', select)
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

  test('TextParser::perform() throws on invalid params passed', async (done) => {
    const parser = new TextParser()
    const didFind = await req.perform()
      .then((html) => {
        html = html.body
        Assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
        parser.load(html)
        return parser.perform()
      })
      .then((links) => {
        return true
      })
      .catch((e) => {
        Assert(e instanceof ParseError)
        Assert(e.message.includes('need to pass content'))
        return false
      })
    Assert.equal(didFind, false)
    done()
  })

  test('TextParser::loadAsXml() passes correct parameters to cheerio', async (done) => {
    const parser = new TextParser()
    parser.load = mockLoad
    parser.loadAsXml('<some><xml><content>value</content></xml></some>')
    done()
  })

  test('TextParser::loadAsXml() null or undefined content throws', async (done) => {
    const parser = new TextParser()
    parser.load = mockLoad
    try {
      parser.loadAsXml()
    } catch (e) {
      Assert(e instanceof ParseError)
      Assert(e.message.includes('non-null content'))
    }
    done()
  })
})
