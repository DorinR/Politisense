/* eslint-env jest */
import { GovtDataScraper } from '../GovtDataScraper'
import { ExpendituresScraper } from '../ExpendituresScraper'

describe('GovtDataScraper', () => {
  it('should return the current parliament session', (done) => {
    const govtDataScraper = new GovtDataScraper()
    jest.spyOn(govtDataScraper, 'getHtmlWithParliament').mockImplementation(async () => {
      return `
<div class="panel-collapse collapse work-section" aria-labelledby="tabbed-widget-members-work-tab">
<article>
    <div class="tabbed-widget-content-wrapper">
        <span class="subtitle">42nd Parliament, 1st Session</span>
    </div>
</article>
</div>
`
    })

    govtDataScraper.getCurrentParliament().then(parliament => {
      expect(parliament.number).toBe(42)
      expect(parliament.session).toBe(1)
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
})
