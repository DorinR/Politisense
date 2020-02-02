/* eslint-env jest */
import { LinkScraper } from '../../../../../backend/util/action/fetch_action/LinkScraperAction'
import { ParseError, TextParser } from '../../../../../backend/util/action/parse_action/TextParserAction'

const chai = require('chai')
const Assert = chai.assert

describe('TextParserAction.js', () => {
  let mockSend
  let mockLoad
  let parser
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
      Assert.equal(options.normalizeWhitespace, true)
      Assert.equal(options.xmlMode, true)
      Assert.equal(options.xml, true)
    }
  })

  let req
  beforeEach(() => {
    req = new LinkScraper('https://www.google.ca/')
    req.send = mockSend
    parser = new TextParser(false, 'a', (elem, $) => {
      return $(elem).attr('href')
    })
  })

  test('TextParser::perform() finds all links', async (done) => {
    const didFind = await req.perform()
      .then((html) => {
        Assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
        return parser.perform(html)
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
    parser.tag = ''
    const didFind = await req.perform()
      .then((html) => {
        Assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
        return parser.perform(html)
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
    const didFind = await req.perform()
      .then((html) => {
        Assert.isTrue(typeof html === 'string', 'valid html is delivered by the scraper')
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
    parser.xml = true
    parser.load = mockLoad.bind(parser)
    parser.loadAsXml('<some><xml><content>value</content></xml></some>')
    done()
  })

  test('TextParser::loadAsXml() null or undefined content throws', async (done) => {
    parser.xml = true
    parser.load = mockLoad.bind(parser)
    try {
      parser.loadAsXml()
    } catch (e) {
      Assert(e instanceof ParseError)
      Assert(e.message.includes('non-null content'))
    }
    done()
  })
})
