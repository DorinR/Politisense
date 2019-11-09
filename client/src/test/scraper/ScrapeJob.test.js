import { ScrapeJob } from '../../scraper/ScrapeJob'
import { ScrapeRunner } from '../../scraper/ScrapeRunner'
const chai = require('chai')
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)
// eslint-disable-next-line no-undef
describe('All Job tests', () => {
  // eslint-disable-next-line no-undef
  test('Job throws on bad link', () => {
    const url = 'https://'
    const mngr = new ScrapeRunner()
    mngr.enqueueJobsCb = () => {}
    const exc = new ScrapeJob(url, mngr, [])
    exc.execute().should.eventually.throw().notify(chai.done)
  }, 10000)
})
