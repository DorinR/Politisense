/* eslint-env jest */
const Utils = require('../../util/utils')
const LinkScraper = Utils.Actions.LinkScraperAction
const ScrapeJob = require('../../job/jobs').ScrapeJob

const chai = require('chai')
const Assert = chai.assert

describe('ScrapeJob.js', () => {
  function setupJob (url) {
    const undertest = ScrapeJob.create(url, () => {}, [])
    const scraper = new LinkScraper(url)
    scraper.send = mockSend
    undertest.actions[0] = scraper.perform.bind(scraper)
    return undertest
  }

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
    const exc = setupJob(url)
    const didScrape = await exc.execute()
      .then(res => {
        Assert.equal(typeof res, typeof [])
        Assert.equal(res.length, 1)
        Assert(res[0].includes('xml'))
        return true
      })
      .catch(e => {
        return false
      })
    Assert.equal(didScrape, true)
    done()
  }, 10000)

  it('ScrapeJob::execute() returns null on bad link', async (done) => {
    const url = 'https://'
    const exc = setupJob(url)
    const didScrape = await exc.execute()
      .then(res => {
        return res.length !== 0
      })
      .catch(e => {
        return false
      })
    Assert.equal(didScrape, false)
    done()
  }, 10000)

  it('ScrapeJob::create() adds a scraper, parser, processor, requeue-er', async (done) => {
    const url = 'https://www.google.ca/'
    const exc = ScrapeJob.create(url, () => {}, [])
    Assert(exc.actions.length === 4)
    Assert.notEqual(exc.actions[0], null)
    Assert(typeof exc.actions[0] === 'function')
    Assert.notEqual(exc.actions[1], null)
    Assert(typeof exc.actions[1] === 'function')
    Assert.notEqual(exc.actions[2], null)
    Assert(typeof exc.actions[2] === 'function')
    Assert.notEqual(exc.actions[3], null)
    Assert(typeof exc.actions[3] === 'function')
    done()
  }, 1000)
})
