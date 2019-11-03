import { ScrapeJob } from '../../scraper/ScrapeJob'
import { ScrapeRunner } from '../../scraper/ScrapeRunner'
const chai = require('chai')
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)

// eslint-disable-next-line no-undef
describe('All Job tests', () => {
  // eslint-disable-next-line no-undef
  test('Can execute a Job', () => {
    const url = 'https://www.ourcommons.ca/en'
    const mngr = new ScrapeRunner()
    mngr.enqueueJobsCb = function () {}
    const exc = new ScrapeJob(url, mngr)
    return exc.execute().then(result => {
      return result
    }).then(array => {
      array.should.be.an('array')
    })
  })
  // eslint-disable-next-line no-undef
  test('Job throws on bad link', () => {
    const url = 'https://'
    const mngr = new ScrapeRunner()
    mngr.enqueueJobsCb = () => {}
    const exc = new ScrapeJob(url, mngr)
    exc.execute().should.eventually.throw().notify(chai.done)
  })
})
