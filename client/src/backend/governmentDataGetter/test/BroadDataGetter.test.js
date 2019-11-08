/* eslint-env jest */
import { BroadDataGetter } from '../BroadDataGetter'

describe('BroadDataGetter.test', () => {
  it('should return some data', (done) => {
    const minutes = 60000
    jest.setTimeout(5 * minutes)

    const dataGetter = new BroadDataGetter()
    dataGetter.getGovernmentData(4).then(data => {
      expect(typeof data).toBe('object')
      console.log(JSON.stringify(data))
      done()
    })
  })

  it('should return the current parliament session', (done) => {
    const dataGetter = new BroadDataGetter()
    dataGetter.getCurrentParliament().then(parliament => {
      expect(typeof parliament.number).toBe('number')
      expect(typeof parliament.session).toBe('number')
      // A parliament session is either 1, 2 or 3
      expect(parliament.session).toBeLessThanOrEqual(3)
      expect(parliament.session).toBeGreaterThanOrEqual(1)
      console.log(JSON.stringify(parliament))
      done()
    })
  })
})
