import { Job } from '../src/Job'

const chai = require('chai')
chai.should()
const chaiPromise = require('chai-as-promised')
chai.use(chaiPromise)
// eslint-disable-next-line no-undef
describe('All Job tests', () => {
  // eslint-disable-next-line no-undef
  test('Can execute a Job', () => {
    const url = 'https://www.ourcommons.ca/en'
    const exc = new Job(url)
    return exc.execute().should.eventually.be.a('array')
  })
  // eslint-disable-next-line no-undef
  test('Job salvages poor links', () => {
    const url = 'www.ourcommons.ca/en'
    const exc = new Job(url)
    return exc.execute().should.eventually.be.a('array')
  })
  // eslint-disable-next-line no-undef
  test('Job throws on bad link', () => {
    const url = 'https://'
    const exc = new Job(url)
    exc.execute().should.eventually.throw().notify(chai.done)
  })
})
