/* eslint-env jest */
import { BroadDataGetter } from '../BroadDataGetter'

describe('BroadDataGetter.test', () => {
  it('should return some data', (done) => {
    const minutes = 60000
    jest.setTimeout(3 * minutes)
    const dataGetter = new BroadDataGetter()
    dataGetter.getGovernmentData(6).then(data => {
      expect(typeof data).toBe('object')
      console.log(JSON.stringify(data))
      done()
    })
  })
})
