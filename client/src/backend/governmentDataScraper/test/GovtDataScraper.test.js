/* eslint-env jest */
import { GovtDataScraper } from '../GovtDataScraper'
import { ExpendituresScraper } from '../ExpendituresScraper'

describe('GovtDataScraper', () => {
  it('should return the current parliament session', (done) => {
    const dataGetter = new GovtDataScraper()
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

    const dataGetter = new GovtDataScraper()
    const filteredVotes = dataGetter.removeMultipleBillVotes(votes)
    expect(filteredVotes).toHaveLength(2)
    expect(filteredVotes).toEqual(expect.arrayContaining([{ id: 8, billNumber: 111 }, { id: 16, billNumber: 222 }]))
  })

  it('aaa', async () => {
    const ret = await new ExpendituresScraper('https://www.ourcommons.ca/PublicDisclosure/MemberExpenditures.aspx?FormatType=XML')
      .createExpenditureRecords()
      .then(promises => {
        Promise.all(promises)
          .then(records => {
            records.forEach(record => {
              console.log(record[0])
            })
            expect(true).toBe(true)
          })
      })
  }, 60000)
})
