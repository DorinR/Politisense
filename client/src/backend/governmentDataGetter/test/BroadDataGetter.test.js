/* eslint-env jest */
import { BroadDataGetter } from '../BroadDataGetter'

describe('BroadDataGetter', () => {
  it('should return some data', (done) => {
    const minutes = 60000
    jest.setTimeout(5 * minutes)

    const dataGetter = new BroadDataGetter()
    dataGetter.getGovernmentData(50).then(data => {
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

  it('should only keep votes without same number and having greatest id', () => {
    const votes = [
      { id: 2, billNumber: 111 },
      { id: 1, billNumber: 111 },
      { id: 8, billNumber: 111 },
      { id: 3, billNumber: 111 },
      { id: 10, billNumber: 222 },
      { id: 16, billNumber: 222 }
    ]

    const dataGetter = new BroadDataGetter()
    const filteredVotes = dataGetter.removeMultipleBillVotes(votes)
    expect(filteredVotes).toHaveLength(2)
    expect(filteredVotes).toEqual(expect.arrayContaining([{ id: 8, billNumber: 111 }, { id: 16, billNumber: 222 }]))
  })
})
