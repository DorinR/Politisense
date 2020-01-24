/* eslint-env jest */
import { LinkScraper, ScrapeErrorName } from '../../../scraper/job_actions/LinkScraperAction'

const chai = require('chai')
const Assert = chai.assert

describe('LinkScraperAction.js', () => {
  let mockSend
  let mockConnectionErrorSend
  beforeAll(() => {
    mockSend = async (options) => {
      if (options.uri === 'https://www.google.ca/') {
        return { body: '' }
      } else {
        throw new Error()
      }
    }
    mockConnectionErrorSend = async (options) => {
      if (options.uri.includes('not connection error')) {
        throw new Error()
      }
      throw new Error('ECONNRESET')
    }
  })

  test('LinkScraper::perform() returns response from valid URL', async (done) => {
    const req = new LinkScraper('https://www.google.ca/')
    req.send = mockSend
    const ret = await req.perform()
      .then((html) => {
        return html.body
      })
      .catch((e) => {
        return null
      })
    Assert.equal(typeof ret, typeof '')
    done()
  })

  test('LinkScraper::perform() throws on invalid valid URL', async (done) => {
    const req = new LinkScraper('')
    req.send = mockSend
    const didThrow = await req.perform()
      .then((html) => {
        return false
      })
      .catch((e) => {
        return true
      })
    Assert.equal(didThrow, true)
    done()
  })

  test('LinkScraper::malformedLinkError() returns null on valid url', async (done) => {
    const req = new LinkScraper('https://www.google.ca/')
    const error = req.malformedLinkError()
    Assert.equal(error, null, 'No error should be returned on a valid link')
    done()
  })

  test('LinkScraper::malformedLinkError() returns error on malformed url', async (done) => {
    const req = new LinkScraper('hps://www.google.ca/')
    const error = req.malformedLinkError()
    Assert.equal(error.name, ScrapeErrorName, 'Returned error should be a scrape error')
    Assert.isTrue(error.message.includes('ERROR: Malformed link passed to scraper:'), 'Error message should specify link was malformed')
    Assert.isTrue(error.message.includes(req.url), 'Error message should display the malformed link')
    done()
  })

  test('LinkScraper::connectionError() returns error on connection problem', async (done) => {
    const req = new LinkScraper('hps://www.google.ca/')
    req.send = mockConnectionErrorSend.bind(true)
    const didThrow = await req.perform()
      .then((html) => {
        return false
      })
      .catch((error) => {
        error = req.connectionError(error)
        Assert.equal(error.name, ScrapeErrorName, 'Returned error should be a scrape error')
        Assert.isTrue(error.message.includes('ERROR: Connection failure '), 'Error message should specify a connection error')
        Assert.isTrue(error.message.includes(req.url), 'Error message should display the link')
        Assert.isTrue(error.message.includes('ECONNRESET'), 'Error message should include the type of connection error')
        return true
      })
    Assert.equal(didThrow, true)
    done()
  })

  test('LinkScraper::connectionError() returns null on valid url', async (done) => {
    const req = new LinkScraper('not connection error')
    req.send = mockConnectionErrorSend.bind(false)
    const didThrow = await req.perform()
      .then((html) => {
        return false
      })
      .catch((e) => {
        e = req.connectionError(e)
        Assert.equal(e, null, 'Should not be a connection error')
        return true
      })
    Assert.equal(didThrow, true)
    done()
  })

  test('Static LinkScraper::headers() contains UserAgent and Accept', async (done) => {
    const headers = LinkScraper.headers()
    Assert.isOk(headers)
    Assert.equal(headers.Accept, '*/*', 'Header should contain acceptable URL criteria')
    Assert.isTrue(headers['User-Agent'].includes('PolitisenseScraper/'), 'Header should specify User-Agent')
    done()
  })
})
