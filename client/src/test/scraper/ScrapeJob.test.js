/* eslint-env jest */
import { ScrapeJob } from '../../scraper/ScrapeJob'
import { ScrapeRunner } from '../../scraper/ScrapeRunner'
const chai = require('chai')
const Assert = chai.assert
describe('All Job tests', () => {
  let mockFn
  let manager
  beforeAll(() => {
    mockFn = async (options) => {
      if (options.uri === 'https://www.google.ca/') {
        return {
          body: '<!DOCTYPE html>' +
            '<html>' +
            '<head>' +
            '</head>' +
            '<body>' +
            '<a href="https://www.google.ca">google</a>' +
            '</body>' +
            '</html>'
        }
      } else {
        throw new Error()
      }
    }
    manager = new ScrapeRunner()
    manager.enqueueJobsCb = () => {}
  })

  test('Job succeeds on good link', async (done) => {
    const url = 'https://www.google.ca/'
    const exc = new ScrapeJob(url, () => {}, [])
    exc.scraper.send = mockFn
    const didScrape = await exc.execute()
      .then(res => {
        return true
      })
      .catch(e => {
        console.log(e)
        return false
      })
    Assert.equal(didScrape, true)
    done()
  }, 10000)

  test('Job throws on bad link', async (done) => {
    const url = 'https://'
    const exc = new ScrapeJob(url, () => {}, [])
    exc.scraper.send = mockFn
    const didScrape = await exc.execute()
      .then(res => {
        console.log(res)
        return true
      })
      .catch(e => {
        return false
      })
    Assert.equal(didScrape, false)
    done()
  }, 10000)
})
