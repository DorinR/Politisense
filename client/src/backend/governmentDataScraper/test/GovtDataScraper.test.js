/* eslint-env jest */
import { GovtDataScraper } from '../GovtDataScraper'

describe('GovtDataScraper', () => {
  xit('should return the current parliament session', (done) => {
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

  xit('should only keep votes without same number and having greatest id', () => {
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

  it('runner', async(done) => {
    console.log('producing new data...')
    new GovtDataScraper().getGovernmentData(500)
      .then(({bills, mps, votes}) => {
        console.log(bills)
        console.log(mps)
        console.log(votes)
        return ({bills, mps, votes})
      })/*
      .then(async (data) => {
        const db = new Firestore()
        console.log('clearing old data...')
        await db.Politician().delete()
          .then(count => {
            console.log(`${count} politicians were deleted`)
          })
        await db.Bill().delete()
          .then(count => {
            console.log(`${count} bills were deleted`)
          })
        await db.VoteRecord().delete()
          .then(count => {
            console.log(`${count} voterecords were deleted`)
          })
        await db.Vote().delete()
          .then(count => {
            console.log(`${count} votes were deleted`)
          })
        return data
      })
      .then(async ({bills, mps, votes})=> {
        console.log('inserting new data...')
        const db = new Firestore()
        return await Promise.all(
          [Promise.all(
            bills.map(bill => {
              db.Bill().insert(bill)
            })
          ),
            Promise.all(
              mps.map(mp => {
                db.Politician().insert(mp)
              })
            ),
            Promise.all(
              votes.map(vote => {
                db.VoteRecord().insert(vote)
              })
            )]
        )
      })
      .then(async () => {
        const scraper = new GovtDataScraper()
        console.log('creating new collections...')
        return await Promise.all(
          [
            scraper.standardiseRidingHyphens(),
            scraper.createVotes(),
            scraper.modifyVoteRecords()
          ]
        )

      })*/
      .then(() => {
        console.log('data pipeline successful!')
    })
  }, 60000 )
})
