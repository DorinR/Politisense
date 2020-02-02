/* eslint-env jest */
import { LinkScraper } from '../../../scraper/job_actions/LinkScraperAction'

const chai = require('chai')
const Assert = chai.assert

describe('LinkScraperAction.js', () => {
  let mockSend
  beforeAll(() => {
    mockSend = async (options) => {
      if (options.uri === 'https://www.google.ca/') {
        return { body: '' }
      } else {
        throw new Error()
      }
    }
  })

  test('LinkScraper::perform() returns response from valid URL', async (done) => {
    const req = new LinkScraper('https://www.google.ca/')
    req.send = mockSend
    const ret = await req.perform()
      .then((html) => {
        return html
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

  test('Static LinkScraper::headers() contains UserAgent and Accept', async (done) => {
    const headers = LinkScraper.headers()
    Assert.isOk(headers)
    Assert.equal(headers.Accept, '*/*', 'Header should contain acceptable URL criteria')
    Assert.isTrue(headers['User-Agent'].includes('PolitisenseScraper/'), 'Header should specify User-Agent')
    done()
  })
})
