/* eslint-env jest */
import { ScrapeJob } from '../../scraper/ScrapeJob'
import { LinkScraper } from '../../scraper/job_actions/LinkScraperAction'
import { Selector } from '../../scraper/job_actions/SelectionAction'
import { TextParser } from '../../scraper/job_actions/TextParserAction'

const chai = require('chai')
const Assert = chai.assert

describe('ScrapeJob.js', () => {
  let mockSend
  beforeAll(() => {
    mockSend = async (options) => {
      if (options.uri === 'https://www.google.ca/') {
        return {
          body: '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '</head>' +
            '<body>' +
            '<a href="https://www.google.ca">google</a>' +
            '<a href="https://www.google.ca/xml">google</a>' +
            '</body>' +
            '</html>'
        }
      } else {
        throw new Error()
      }
    }
  })

  it('ScrapeJob::execute() returns xml links on success', async (done) => {
    const url = 'https://www.google.ca/'
    const exc = new ScrapeJob(url, () => {}, [])
    exc.scraper.send = mockSend
    const didScrape = await exc.execute()
      .then(res => {
        Assert.equal(typeof res, typeof [])
        Assert.equal(res.length, 1)
        Assert(res[0].includes('xml'))
        return true
      })
      .catch(e => {
        console.log(e)
        return false
      })
    Assert.equal(didScrape, true)
    done()
  }, 10000)

  it('ScrapeJob::execute() throws on initial bad link', async (done) => {
    const url = 'https://'
    const exc = new ScrapeJob(url, () => {}, [])
    exc.scraper.send = mockSend
    const didScrape = await exc.execute()
      .then(res => {
        return true
      })
      .catch(e => {
        return false
      })
    Assert.equal(didScrape, false)
    done()
  }, 10000)

  it('ScrapeJob::initialiseJobComponents() adds a scraper, parser, processor', async (done) => {
    const url = 'https://www.google.ca/'
    const exc = new ScrapeJob(url, () => {}, [])
    Assert.notEqual(exc.scraper, null)
    Assert(exc.scraper instanceof LinkScraper)
    Assert.notEqual(exc.processor, null)
    Assert(exc.processor instanceof Selector)
    Assert.notEqual(exc.parser, null)
    Assert(exc.parser instanceof TextParser)
    done()
  }, 1000)
})
