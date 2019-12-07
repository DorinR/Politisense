/* eslint-env jest */
import { LinkScraper } from '../../../scraper/job_actions/LinkScraperAction'
const chai = require('chai')
const Assert = chai.assert

describe('All Scraper Request Tests', () => {
  let mockFn
  beforeAll(() => {
    mockFn = async (options) => {
      if (options.uri === 'https://www.google.ca/') {
        return { body: '' }
      } else {
        throw new Error()
      }
    }
  })

  test('Valid URL returns html', async (done) => {
    const req = new LinkScraper('https://www.google.ca/')
    req.send = mockFn
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

  test('Invalid URL invokes fail function', async (done) => {
    const req = new LinkScraper('')
    req.send = mockFn
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
})
